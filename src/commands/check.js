import { llmCheckAndFix } from "../services/gemini.js";

export const data = {
  name: "check",
  description: "Check, fix, and optimize code using Gemini",
  options: [
    { name: "lang", type: 3, description: "java|c|cpp|python", required: true },
    { name: "code", type: 3, description: "Paste your code", required: true }
  ]
};

export async function execute(interaction) {
  const lang = interaction.options.getString("lang");
  const code = interaction.options.getString("code");

  await interaction.deferReply({ flags: 64 }); // reply hidden to user only
  try {
    const result = await llmCheckAndFix(code, lang);

    // ✅ ensure safe fallbacks
    const errors = result?.errors || ["No errors detected."];
    const fixedCode = result?.fixed_code || code;
    const optimizedCode = result?.optimized_code || fixedCode;

    await interaction.editReply({
      content: "🎯 **Code Check Result**",
      embeds: [
        {
          color: 0x5865F2,
          title: "📝 Original Code",
          description: `\`\`\`${lang}\n${code}\n\`\`\``
        },
        {
          color: 0xED4245,
          title: "❌ Errors",
          description: Array.isArray(errors)
            ? errors.map(e => typeof e === "string" ? e : `Line ${e.line || "?"}: ${e.description || e.message}`).join("\n")
            : errors.toString()
        },
        {
          color: 0x57F287,
          title: "🔧 Fixed Code",
          description: `\`\`\`${lang}\n${fixedCode}\n\`\`\``
        },
        {
          color: 0xF47FFF,
          title: "⚡ Optimized Code",
          description: `\`\`\`${lang}\n${optimizedCode}\n\`\`\``
        },
        {
          color: 0xFEE75C,
          title: "📊 Stats",
          description: `Original: ${code.length} chars\nFixed: ${fixedCode.length} chars\nOptimized: ${optimizedCode.length} chars`
        }
      ]
    });
  } catch (e) {
    await interaction.editReply(`⚠️ Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
