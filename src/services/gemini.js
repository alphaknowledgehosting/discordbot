import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function safeParseJSON(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```json\n([\s\S]*?)```/i);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {}
    }
    return fallback;
  }
}

/**
 * ✅ Code checker & fixer
 */
export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Analyze this ${lang} code and return ONLY JSON:
"errors": list of issues with "line" + "message",
"fixed_code": corrected version,
"optimized_code": optimized version.
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text().trim();

  return safeParseJSON(text, {
    errors: ["Failed to parse JSON output."],
    fixed_code: code,
    optimized_code: code
  });
}

/**
 * ✅ Debugger
 */
export async function llmDebug(issue, code, lang) {
  const prompt = `
You are AkiBot, a debugging assistant.
Analyze the issue in ${lang} code and return ONLY JSON:
"root_cause": why the bug happens,
"steps": how to fix it step-by-step,
"fixed_code": corrected version.
Issue: ${issue}
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text().trim();

  return safeParseJSON(text, {
    root_cause: "Failed to parse JSON output.",
    steps: "No steps available.",
    fixed_code: code
  });
}
