// pages/api/claude.js
// Stable PHC AI Triage Backend (FIXED VERSION)

import Anthropic from "@anthropic-ai/sdk";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `
You are a medical triage assistant for rural healthcare workers.

You MUST return ONLY valid JSON:

{
  "triage": "EMERGENCY | PHC | HOME_CARE",
  "diagnosis": ["string"],
  "steps": ["string"],
  "red_flags": ["string"],
  "confidence": number,
  "explanation": "string"
}

STRICT RULES:
- ONLY JSON (no markdown, no text outside JSON)
- Be medically safe
- If life-threatening → EMERGENCY
- Keep responses concise and practical
`;

function safeJsonParse(text) {
  if (!text) return null;

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

function extractList(text, keyword) {
  if (!text) return [];

  const regex = new RegExp(
    `${keyword}[:\\-]\\s*([\\s\\S]*?)(\\n\\n|$)`,
    "i"
  );

  const match = text.match(regex);
  if (!match) return [];

  return match[1]
    .split("\n")
    .map((s) => s.replace(/[-•]/g, "").trim())
    .filter(Boolean);
}

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
    const { message, messages, image, max_tokens, model, system } = req.body;

    // FIX 1: safer input handling
    const userText =
      message ||
      messages?.[0]?.content ||
      (image ? "Analyze this medical image" : "Analyze this medical case");

    const content = [
      {
        type: "text",
        text: userText,
      },
    ];

    // FIX 2: image support (safe fallback type)
    if (image) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: image,
        },
      });
    }

    const response = await anthropic.messages.create({
      model: model || "claude-sonnet-4-20250514",
      max_tokens: max_tokens || 1024,
      system: system || SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    const rawText = response.content?.[0]?.text || "";

    // FIX 3: safe parsing
    const parsed = safeJsonParse(rawText);

    // FIX 4: normalized response (ALWAYS SAFE FOR FRONTEND)
    const normalized = parsed || {
      triage: "PHC",
      diagnosis: extractList(rawText, "diagnosis"),
      steps: extractList(rawText, "steps"),
      red_flags: [],
      confidence: 0.3,
      explanation: rawText || "Unable to analyze case",
    };

    return res.status(200).json(normalized);

  } catch (err) {
    console.error("[claude.js error]", err);

    return res.status(500).json({
      triage: "PHC",
      diagnosis: [],
      steps: ["Retry analysis", "Check network", "Contact PHC doctor"],
      red_flags: [],
      confidence: 0.1,
      explanation: "System error occurred. Please try again.",
    });
  }
}
