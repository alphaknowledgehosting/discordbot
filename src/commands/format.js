import { llmFormatCode } from "../services/gemini.js";

export const data = {
  name: "format",
  description: "Format and organize code automatically",
  options: [
    { name: "code", type: 3, description: "Paste your code", required: true }
  ]
};

export async function execute(interaction) {
  const code = interaction.options.getString("code");

  await interaction.deferReply({ flags: 64 }); // private reply
  try {
    const result = await llmFormatCode(code);

    await interaction.editReply({
      content: "🎨 **Code Formatter**",
      embeds: [
        {
          color: 0x5865F2,
          title: "📥 Original",
          description: `\`\`\`\n${code}\n\`\`\``
        },
        {
          color: 0x57F287,
          title: `📤 Formatted (${result.detected_lang})`,
          description: `\`\`\`${result.detected_lang}\n${result.formatted_code}\n\`\`\``
        },
        {
          color: 0xFEE75C,
          title: "📊 Stats",
          description: `Original: ${code.length} chars\nFormatted: ${result.formatted_code.length} chars`
        }
      ]
    });
  } catch (e) {
    await interaction.editReply({
      embeds: [
        {
          color: 0xED4245,
          title: "⚠️ Formatting Failed",
          description: e.message
        }
      ]
    });
  }
}
