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
    // Try strict JSON parse first
    return JSON.parse(text);
  } catch {
    // Fallback: try to extract code block
    const codeMatch = text.match(/```[\s\S]*?```/);
    return {
      summary: "AI response (fallback mode)",
      fixed_code: codeMatch
        ? codeMatch[0].replace(/```[\w]*\n?|\n?```/g, "")
        : text
    };
  }
}
