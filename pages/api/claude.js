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
You are a rural medical triage assistant.

You MUST return ONLY valid JSON in this exact format:

{
  "triage": "EMERGENCY | PHC | HOME_CARE",
  "diagnosis": ["short string"],
  "steps": ["short actionable step"],
  "red_flags": ["danger signs"],
  "confidence": number (0-100),
  "explanation": "simple explanation"
}

STRICT RULES:
- ONLY JSON (no markdown, no extra text)
- Keep it medically safe
- If life-threatening → EMERGENCY
- Be concise and practical for ASHA/PHC workers
`;

function safeParse(text) {
  if (!text) return null;

  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function normalizeResponse(parsed, rawText) {
  return {
    triage: parsed?.triage || "PHC",
    diagnosis: Array.isArray(parsed?.diagnosis)
      ? parsed.diagnosis
      : ["Unable to determine diagnosis"],

    steps: Array.isArray(parsed?.steps)
      ? parsed.steps
      : ["Check patient condition", "Contact PHC doctor"],

    red_flags: Array.isArray(parsed?.red_flags)
      ? parsed.red_flags
      : [],

    confidence:
      typeof parsed?.confidence === "number"
        ? parsed.confidence
        : 0,

    explanation:
      parsed?.explanation ||
      rawText ||
      "Unable to analyze case",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, image } = req.body;

    const userText = message || "Analyze this medical case";

    const content = [
      {
        type: "text",
        text: userText,
      },
    ];

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
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    const rawText = response?.content?.[0]?.text || "";

    const parsed = safeParse(rawText);

    const finalResponse = normalizeResponse(parsed, rawText);

    return res.status(200).json(finalResponse);
  } catch (err) {
    console.error("claude.js error:", err);

    return res.status(200).json({
      triage: "PHC",
      diagnosis: ["System error"],
      steps: ["Retry", "Check network", "Contact doctor"],
      red_flags: [],
      confidence: 0,
      explanation: "Backend failure occurred",
    });
  }
      }
