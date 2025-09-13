import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * ✅ Code checker & fixer with optimization
 * Returns JSON with:
 *  - errors (list of problems + line numbers if possible)
 *  - fixed_code (corrected version)
 *  - optimized_code (better/cleaner version)
 */
export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Analyze the following ${lang} code. Return JSON with fields:
"errors": explanation of problems with line numbers if possible,
"fixed_code": corrected version of the code,
"optimized_code": improved and more efficient version.
User code:
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text();

  try {
    return JSON.parse(text);
  } catch {
    const codeMatch = text.match(/```[\s\S]*?```/);
    return {
      errors: "Could not parse structured JSON (fallback mode).",
      fixed_code: codeMatch
        ? codeMatch[0].replace(/```[\w]*\n?|\n?```/g, "")
        : code,
      optimized_code: code
    };
  }
}

/**
 * ✅ Debugger
 * Returns JSON with:
 *  - root_cause (why the bug happens)
 *  - steps (steps to fix it)
 *  - fixed_code (corrected version)
 */
export async function llmDebug(issue, code, lang) {
  const prompt = `
You are AkiBot, a debugging assistant.
Analyze the reported issue in the ${lang} code.
Return JSON with fields:
"root_cause": why the bug happens,
"steps": step-by-step explanation to fix it,
"fixed_code": corrected version.
Issue: ${issue}
User code:
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text();

  try {
    return JSON.parse(text);
  } catch {
    const codeMatch = text.match(/```[\s\S]*?```/);
    return {
      root_cause: "Could not parse structured JSON (fallback mode).",
      steps: text,
      fixed_code: codeMatch
        ? codeMatch[0].replace(/```[\w]*\n?|\n?```/g, "")
        : code
    };
  }
}

/**
 * ✅ Syntax checker only
 * Returns JSON with:
 *  - syntax_ok (true/false)
 *  - errors (list of syntax errors with line numbers if possible)
 */
export async function llmSyntaxCheck(code, lang) {
  const prompt = `
You are AkiBot, a strict syntax checker.
Analyze the following ${lang} code for SYNTAX ERRORS only.
Do NOT fix or optimize the code.
Return JSON with fields:
"syntax_ok": true or false,
"errors": a list of syntax issues with line numbers if possible.
User code:
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      syntax_ok: false,
      errors: [`Failed to parse LLM response. Raw output: ${text}`]
    };
  }
}

/**
 * ✅ Code formatter
 * Auto-detects language & returns formatted version
 */
export async function llmFormatCode(code) {
  const prompt = `
You are AkiBot, a professional code formatter.
Auto-detect the language of the given code and reformat it properly with indentation and spacing.
Return JSON with fields:
"detected_lang": the detected programming language,
"formatted_code": the neatly formatted version.
User code:
\`\`\`
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text();

  try {
    return JSON.parse(text);
  } catch {
    const codeMatch = text.match(/```[\s\S]*?```/);
    return {
      detected_lang: "unknown",
      formatted_code: codeMatch
        ? codeMatch[0].replace(/```[\w]*\n?|\n?```/g, "")
        : code
    };
  }
}
