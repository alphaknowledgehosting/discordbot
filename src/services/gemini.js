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
 * ✅ Code checker & fixer with optimization
 */
export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Analyze the following ${lang} code.
Return ONLY JSON with fields:
"errors": array of {"line": number, "message": string},
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
Analyze this ${lang} code for the issue: ${issue}.
Return ONLY JSON with fields:
"root_cause": string,
"steps": string,
"fixed_code": corrected version.
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

/**
 * ✅ Syntax checker
 */
export async function llmSyntaxCheck(code, lang) {
  const prompt = `
You are AkiBot, a strict syntax checker.
Check ONLY for syntax errors in ${lang} code.
Return ONLY JSON with fields:
"syntax_ok": true or false,
"errors": list of syntax errors (with line numbers if possible).
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text().trim();

  return safeParseJSON(text, {
    syntax_ok: false,
    errors: ["Failed to parse JSON output."]
  });
}

/**
 * ✅ Code formatter
 */
export async function llmFormatCode(code) {
  const prompt = `
You are AkiBot, a professional code formatter.
Auto-detect the language and reformat code with proper indentation.
Return ONLY JSON with fields:
"detected_lang": string,
"formatted_code": string.
\`\`\`
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text().trim();

  return safeParseJSON(text, {
    detected_lang: "unknown",
    formatted_code: code
  });
}
