import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function safeParse(text: string) {
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

async function callClaude({ messages, system, max_tokens = 1024 }: {
  messages: Anthropic.MessageParam[];
  system?: string;
  max_tokens?: number;
}) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens,
    messages,
    ...(system ? { system } : {}),
  });
  const block = response.content?.[0];
  return block && block.type === "text" ? block.text : "";
}

router.post("/claude", async (req, res) => {
  try {
    const { messages, system, max_tokens, message, image, mediaType } = req.body;

    if (messages && Array.isArray(messages) && messages.length > 0) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: max_tokens || 1024,
        messages,
        ...(system ? { system } : {}),
      });
      return res.status(200).json(response);
    }

    if (!message && !image) {
      return res.status(400).json({ error: "No message or messages provided" });
    }

    if (image) {
      const content: Anthropic.MessageParam["content"] = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: (mediaType || "image/jpeg") as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: image,
          },
        },
        {
          type: "text",
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
      ];

      const rawText = await callClaude({
        messages: [{ role: "user", content }],
        max_tokens: 800,
      });

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

    const isTriageCall = message.includes("Age:") && message.includes("Symptoms:");

    if (isTriageCall) {
      const rawText = await callClaude({
        system: `You are a medical triage assistant for rural India ASHA workers.
Respond with ONLY valid JSON (no markdown, no extra text):
{
  "level": "RED" or "YELLOW" or "GREEN",
  "condition": "most likely condition in 3-5 words",
  "confidence": <number 0-100>,
  "first_aid": ["step 1", "step 2", "step 3"],
  "call_108": true or false,
  "extra_symptom": "one symptom that would increase confidence"
}
RED = life-threatening emergency. YELLOW = needs PHC visit. GREEN = home care.`,
        messages: [{ role: "user", content: message }],
        max_tokens: 600,
      });

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

    const rawText = await callClaude({
      system: `You are Dr. Meena Singh, PHC doctor at Barmer, Rajasthan, and an expert ASHA worker assistant.
Reply in simple conversational Hindi (or English if the question is in English).
Be warm, practical, and direct. Keep responses under 120 words.
For emergencies always mention calling 108. No markdown formatting.`,
      messages: [{ role: "user", content: message }],
      max_tokens: 500,
    });

    return res.status(200).json({
      explanation: rawText || "Maafi, abhi jawab dene mein mushkil aa rahi hai. Dobara try karein.",
    });

  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    req.log.error({ err }, "[/api/claude] error");

    const status = e?.status || 500;
    const errMsg =
      status === 401 ? "Invalid API key. Check ANTHROPIC_API_KEY."
      : status === 429 ? "Rate limit hit. Wait a moment and try again."
      : status === 529 ? "Anthropic is overloaded. Try again shortly."
      : e?.message || "Server error";

    return res.status(200).json({
      level: "YELLOW", condition: "Unable to analyse", confidence: 0,
      first_aid: ["Check vitals", "Contact PHC doctor", "Monitor closely"],
      call_108: false, extra_symptom: "",
      triage: "PHC", diagnosis: ["Analysis failed"], steps: ["Retry", "Contact PHC"],
      red_flags: [], explanation: errMsg,
    });
  }
});

export default router;
