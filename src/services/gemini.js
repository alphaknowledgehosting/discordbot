import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Task: 1) detect syntax/logic errors 2) explain briefly 3) output corrected code only.
Language: ${lang}
User code:
\`\`\`${lang}
${code}
\`\`\`
Return JSON with fields: "summary" (1-3 sentences) and "fixed_code".
  `.trim();

  const res = await model.generateContent(prompt);
  const text = res.response.text();
  // Attempt to parse JSON from model output
  const jsonMatch = text.match(/\{[\s\S]*\}$/);
  if (!jsonMatch) throw new Error("LLM did not return JSON");
  return JSON.parse(jsonMatch[0]);
}

export async function llmDebug(description, code, lang) {
  const prompt = `
You are AkiBot, a senior debugger.
Given language ${lang}. The user reports:
${description}

Code:
\`\`\`${lang}
${code}
\`\`\`

Do:
1) Identify root cause concisely.
2) Provide step-by-step fix.
3) Provide a corrected code block.

Return JSON with "root_cause", "steps", "fixed_code".
  `.trim();
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}$/);
  if (!jsonMatch) throw new Error("LLM did not return JSON");
  return JSON.parse(jsonMatch[0]);
}
