import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * 🔹 Safe JSON parser with fallback
 */
function safeParseJSON(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```json\n([\s\S]*?)```/i);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {}
    }
    return fallback;
  }
}

/**
 * ✅ Code checker & fixer with optimization
 */
export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Analyze the following ${lang} code carefully. 
Return ONLY valid JSON with these fields:
"errors": an array of objects with "line" and "message" about problems,
"fixed_code": corrected version (formatted properly),
"optimized_code": cleaner, more efficient version.

User code:
\`\`\`${lang}
${code}
\`\`\`
`.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text().trim();

  // Try parsing as JSON
  const parsed = safeParseJSON(text, null);
  if (parsed) return parsed;

  // 🔹 Fallback extraction if JSON fails
  const fixedMatch = text.match(/Fixed Code:```[\s\S]*?```/i);
  const optimizedMatch = text.match(/Optimized Code:```[\s\S]*?```/i);
  const errorsMatch = text.match(/Errors?:([\s\S]*?)(?=Fixed|Optimized|$)/i);

  return {
    errors: errorsMatch
      ? errorsMatch[1].trim().split("\n").map(e => e.trim()).filter(Boolean)
      : ["Could not extract errors. Raw output returned."],
    fixed_code: fixedMatch
      ? fixedMatch[0].replace(/.*```[\w]*\n?|```$/g, "").trim()
      : code,
    optimized_code: optimizedMatch
      ? optimizedMatch[0].replace(/.*```[\w]*\n?|```$/g, "").trim()
      : code
  };
}
