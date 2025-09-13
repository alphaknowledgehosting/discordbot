import { llmDebug } from "../services/gemini.js";

export const data = {
  name: "debug",
  description: "Explain a bug & provide a fixed version",
  options: [
    { name: "lang", type: 3, description: "java|c|cpp|python", required: true },
    { name: "issue", type: 3, description: "Describe the problem", required: true },
    { name: "code", type: 3, description: "Paste your code", required: true }
  ]
};

export async function execute(interaction) {
  const lang = interaction.options.getString("lang");
  const issue = interaction.options.getString("issue");
  const code = interaction.options.getString("code");

  await interaction.deferReply({ flags: 64 }); // private reply
  try {
    const result = await llmDebug(issue, code, lang);

    await interaction.editReply({
      content: "🐞 **Debug Report**",
      embeds: [
        {
          color: 0x5865F2,
          title: "📝 Original Code",
          description: `\`\`\`${lang}\n${code}\n\`\`\``
        },
        {
          color: 0xED4245,
          title: "❌ Root Cause",
          description: result.root_cause
        },
        {
          color: 0x57F287,
          title: "🛠️ Steps to Fix",
          description: result.steps
        },
        {
          color: 0xF47FFF,
          title: "🔧 Fixed Code",
          description: `\`\`\`${lang}\n${result.fixed_code}\n\`\`\``
        },
        {
          color: 0xFEE75C,
          title: "📊 Stats",
          description: `Original: ${code.length} chars\nFixed: ${result.fixed_code.length} chars`
        }
      ]
    });
  } catch (e) {
    await interaction.editReply(`⚠️ Debugging failed: ${e.message}`);
  }
}
