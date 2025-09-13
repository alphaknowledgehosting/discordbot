import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ Code checker & fixer
export async function llmCheckAndFix(code, lang) {
  const prompt = `
You are AkiBot, a precise programming assistant.
Return JSON with fields: "summary" and "fixed_code".
Language: ${lang}
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
      summary: "AI response (fallback mode)",
      fixed_code: codeMatch
        ? codeMatch[0].replace(/```[\w]*\n?|\n?```/g, "")
        : text
    };
  }
}

// ✅ Debugger
export async function llmDebug(issue, code, lang) {
  const prompt = `
You are AkiBot, a debugging assistant.
Analyze the issue and return JSON with fields:
"root_cause", "steps", "fixed_code".
Language: ${lang}
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
