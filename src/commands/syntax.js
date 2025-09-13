import { llmSyntaxCheck } from "../services/gemini.js";

export const data = {
  name: "syntax",
  description: "Check code for syntax errors only",
  options: [
    { name: "lang", type: 3, description: "java|c|cpp|python", required: true },
    { name: "code", type: 3, description: "Paste your code", required: true }
  ]
};

export async function execute(interaction) {
  const lang = interaction.options.getString("lang");
  const code = interaction.options.getString("code");

  await interaction.deferReply({ flags: 64 }); // ephemeral reply
  try {
    const result = await llmSyntaxCheck(code, lang);

    await interaction.editReply({
      content: "🔍 **Syntax Check Result**",
      embeds: [
        {
          color: 0x5865F2,
          title: "📝 Original",
          description: `\`\`\`${lang}\n${code}\n\`\`\``
        },
        {
          color: result.syntax_ok ? 0x57F287 : 0xED4245,
          title: result.syntax_ok
            ? "✅ No Syntax Errors"
            : "❌ Syntax Errors Found",
          description: result.syntax_ok
            ? "Your code is syntactically correct."
            : result.errors.join("\n")
        },
        {
          color: 0xFEE75C,
          title: "📊 Stats",
          description: `Original: ${code.length} chars`
        }
      ]
    });
  } catch (e) {
    await interaction.editReply({
      embeds: [
        {
          color: 0xED4245,
          title: "⚠️ Syntax Check Failed",
          description: e.message
        }
      ]
    });
  }
}
