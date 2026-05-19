// pages/api/claude.js — FULLY FIXED
//
// The frontend has 4 different callers, each sending { message } or { message, image }
// and each reading a DIFFERENT shape from the response:
//
//  analyzeWithClaude  → sends { message }  → reads data.level, data.condition,
//                                             data.confidence, data.first_aid,
//                                             data.call_108, data.extra_symptom
//
//  analyseImage       → sends { message, image, mediaType }
//                                           → reads data.triage, data.diagnosis,
//                                             data.steps, data.red_flags,
//                                             data.confidence, data.explanation
//
//  sendChat           → sends { message }  → reads data.explanation
//
//  sendHelp           → sends { message }  → reads data.explanation
//
//  analysePregWith    → calls api.anthropic.com directly (intercepted by index.js)
//                       reads d.content[0].text and parses JSON itself — handled fine
//
// This backend must detect which caller is sending the request and return the
// exact shape that caller reads.

import Anthropic from "@anthropic-ai/sdk";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

const anthropic = new Anthropic();

// ── helpers ────────────────────────────────────────────────────────────────
function safeParse(text) {
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

async function callClaude({ messages, system, max_tokens = 1024 }) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens,
    messages,
    ...(system ? { system } : {}),
  });
  return response.content?.[0]?.text || "";
}

// ── handler ────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system, max_tokens, message, image, mediaType } = req.body;

    // ── PATH A: full Anthropic messages array (pregnancy call goes here via
    //           index.js fetch intercept — just proxy it straight through) ──
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: max_tokens || 1024,
        messages,
        ...(system ? { system } : {}),
      });
      return res.status(200).json(response);
    }

    // ── PATH B: { message, image } — detect intent from content ───────────
    if (!message && !image) {
      return res.status(400).json({ error: "No message or messages provided" });
    }

    // ── IMAGE ANALYSIS ─────────────────────────────────────────────────────
    if (image) {
      const content = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType || "image/jpeg",
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

    // ── TRIAGE (main symptom analysis) ─────────────────────────────────────
    // Detected by: message contains "Age:", "Symptoms:", "SpO2:", "Temp:"
    const isTriageCall =
      message.includes("Age:") &&
      message.includes("Symptoms:");

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

    // ── CHAT / HELP (Dr. Meena Singh + ASHA Copilot) ───────────────────────
    // Both send { message } and read data.explanation
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

  } catch (err) {
    console.error("[/api/claude] error:", err?.status, err?.message);

    const status = err?.status || 500;
    const errMsg =
      status === 401 ? "Invalid API key. Check ANTHROPIC_API_KEY in .env.local."
      : status === 429 ? "Rate limit hit. Wait a moment and try again."
      : status === 529 ? "Anthropic is overloaded. Try again shortly."
      : err?.message || "Server error";

    // Return safe fallbacks so the UI doesn't crash regardless of which
    // feature triggered the error
    return res.status(200).json({
      // triage fallback
      level: "YELLOW", condition: "Unable to analyse", confidence: 0,
      first_aid: ["Check vitals", "Contact PHC doctor", "Monitor closely"],
      call_108: false, extra_symptom: "",
      // image fallback
      triage: "PHC", diagnosis: ["Analysis failed"], steps: ["Retry", "Contact PHC"],
      red_flags: [], explanation: errMsg,
    });
  }
}
