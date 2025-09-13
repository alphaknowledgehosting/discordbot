import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * ✅ Code checker & fixer with optimization
 * Returns structured plain text with:
 * - Errors
 * - Fixed Code
 * - Optimized Code
 */
export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Analyze the following ${lang} code.
Return your answer ONLY in this format (do not output JSON):

Errors:
- <error 1>
- <error 2>
- <error 3>

Fixed Code:
\`\`\`${lang}
<fixed version here>
\`\`\`

Optimized Code:
\`\`\`${lang}
<optimized version here>
\`\`\`

User code:
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}

/**
 * ✅ Debugger
 * Explains root cause, steps, and gives fixed code
 */
export async function llmDebug(issue, code, lang) {
  const prompt = `
You are AkiBot, a debugging assistant.
Analyze the reported issue in the ${lang} code.
Return your answer ONLY in this format (do not output JSON):

Root Cause:
<why the bug happens>

Steps to Fix:
- <step 1>
- <step 2>

Fixed Code:
\`\`\`${lang}
<fixed version here>
\`\`\`

Issue:
${issue}

User code:
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}

/**
 * ✅ Syntax checker only
 * Returns plain text with syntax errors or "No syntax errors found"
 */
export async function llmSyntaxCheck(code, lang) {
  const prompt = `
You are AkiBot, a strict syntax checker.
Analyze the following ${lang} code for SYNTAX ERRORS only.
Do NOT fix or optimize the code.
Return your answer ONLY in this format (do not output JSON):

Syntax Check Result:
- If there are errors, list them like:
  - Line X: <error message>
- If there are no errors, say:
  ✅ No syntax errors found

User code:
\`\`\`${lang}
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}

/**
 * ✅ Code formatter
 * Auto-detects language & returns neatly formatted version
 */
export async function llmFormatCode(code) {
  const prompt = `
You are AkiBot, a professional code formatter.
Auto-detect the language of the given code and reformat it properly with indentation and spacing.
Return your answer ONLY in this format (do not output JSON):

Detected Language: <language>

Formatted Code:
\`\`\`
<formatted version here>
\`\`\`

User code:
\`\`\`
${code}
\`\`\`
  `.trim();

  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}
