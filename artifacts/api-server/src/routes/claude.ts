import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "express-rate-limit";

const router = Router();

const claudeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL = "gemini-2.0-flash-lite";

function safeParse(text: string) {
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    ...(systemInstruction ? { systemInstruction } : {}),
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateWithHistory(
  messages: Array<{ role: string; parts: Array<{ text: string }> }>,
  systemInstruction?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    ...(systemInstruction ? { systemInstruction } : {}),
  });
  const lastMessage = messages[messages.length - 1];
  const history = messages.slice(0, -1);
  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: m.parts,
    })),
  });
  const result = await chat.sendMessage(lastMessage.parts[0].text);
  return result.response.text();
}

router.post("/claude", claudeRateLimit, async (req, res) => {
  try {
    const { messages, system, message, image, mediaType } = req.body;

    // Multi-turn chat (pregnancy flow and general messages array)
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const history = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      const model = genAI.getGenerativeModel({
        model: MODEL,
        ...(system ? { systemInstruction: system } : {}),
      });
      const lastMsg = history[history.length - 1];
      const chat = model.startChat({ history: history.slice(0, -1) });
      const result = await chat.sendMessage(lastMsg.parts[0].text);
      const text = result.response.text();
      // Return Anthropic-compatible shape so the pregnancy view can parse it
      return res.status(200).json({
        content: [{ type: "text", text }],
      });
    }

    if (!message && !image) {
      return res.status(400).json({ error: "No message or image provided" });
    }

    // Image analysis
    if (image) {
      const model = genAI.getGenerativeModel({ model: MODEL });
      const mimeType = (mediaType || "image/jpeg") as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp";
      const result = await model.generateContent([
        {
          inlineData: { mimeType, data: image },
        },
        {
          text: `You are a medical image analysis assistant for rural India ASHA workers.
Analyse this skin/medical image and respond with ONLY valid JSON (no markdown, no extra text):
{
  "triage": "EMERGENCY" or "PHC" or "HOME_CARE",
  "diagnosis": ["primary finding in plain language"],
  "steps": ["step 1", "step 2", "step 3"],
  "red_flags": ["any danger signs present"],
  "confidence": <number 0-100>,
  "explanation": "1-2 sentence plain language explanation for ASHA worker"
}`,
        },
      ]);
      const rawText = result.response.text();
      const parsed = safeParse(rawText);
      return res.status(200).json({
        triage:      parsed?.triage      || "PHC",
        diagnosis:   parsed?.diagnosis   || ["Unable to analyse image"],
        steps:       parsed?.steps       || ["Consult PHC doctor"],
        red_flags:   parsed?.red_flags   || [],
        confidence:  parsed?.confidence  || 0,
        explanation: parsed?.explanation || rawText || "Analysis inconclusive",
      });
    }

    // Symptom triage
    const isTriageCall = message.includes("Age:") && message.includes("Symptoms:");
    if (isTriageCall) {
      const rawText = await generateText(
        message,
        `You are a medical triage assistant for rural India ASHA workers.
Respond with ONLY valid JSON (no markdown, no extra text):
{
  "level": "RED" or "YELLOW" or "GREEN",
  "condition": "most likely condition in 3-5 words",
  "confidence": <number 0-100>,
  "first_aid": ["step 1", "step 2", "step 3"],
  "call_108": true or false,
  "extra_symptom": "one symptom that would increase confidence"
}
RED = life-threatening emergency. YELLOW = needs PHC visit. GREEN = home care.`
      );
      const parsed = safeParse(rawText);
      return res.status(200).json({
        level:         parsed?.level         || "YELLOW",
        condition:     parsed?.condition     || "Unable to determine",
        confidence:    parsed?.confidence    || 0,
        first_aid:     parsed?.first_aid     || ["Check vitals", "Contact PHC doctor", "Monitor closely"],
        call_108:      parsed?.call_108      || false,
        extra_symptom: parsed?.extra_symptom || "",
      });
    }

    // General chat / copilot / doctor chat
    const rawText = await generateText(
      message,
      `You are Dr. Meena Singh, PHC doctor at Barmer, Rajasthan, and an expert ASHA worker assistant.
Reply in simple conversational Hindi (or English if the question is in English).
Be warm, practical, and direct. Keep responses under 120 words.
For emergencies always mention calling 108. No markdown formatting.`
    );

    return res.status(200).json({
      explanation: rawText || "Maafi, abhi jawab dene mein mushkil aa rahi hai. Dobara try karein.",
    });

  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    req.log.error({ err }, "[/api/claude] error");

    const msg = e?.message || "Server error";
    const isBilling = msg.includes("quota") || msg.includes("billing") || msg.includes("API_KEY");
    const explanation = isBilling
      ? "Gemini API key issue. Check that GEMINI_API_KEY is valid and has quota."
      : msg;

    return res.status(200).json({
      level: "YELLOW", condition: "Unable to analyse", confidence: 0,
      first_aid: ["Check vitals", "Contact PHC doctor", "Monitor closely"],
      call_108: false, extra_symptom: "",
      triage: "PHC", diagnosis: ["Analysis failed"], steps: ["Retry", "Contact PHC"],
      red_flags: [], explanation,
    });
  }
});

export default router;
