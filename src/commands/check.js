import { llmCheckAndFix } from "../services/gemini.js";

export const data = {
  name: "check",
  description: "Check, debug, and optimize code using Gemini",
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

    await interaction.editReply({
  content: "🎯 **Code Check Result**",
  embeds: [
    {
      color: 0x5865F2,
      title: "📝 Original",
      description: `\`\`\`${lang}\n${code}\n\`\`\``
    },
    {
      color: 0x57F287,
      title: "✅ Errors",
      description: result.errors || "No errors detected"
    },
    {
      color: 0xFEE75C,
      title: "🔧 Fixed Code",
      description: `\`\`\`${lang}\n${result.fixed_code}\n\`\`\``
    },
    {
      color: 0xF47FFF,
      title: "⚡ Optimized Code",
      description: `\`\`\`${lang}\n${result.optimized_code}\n\`\`\``
    },
    {
      color: 0xED4245,
      title: "📊 Stats",
      description: `Original: ${code.length} chars\nFixed: ${result.fixed_code.length} chars\nOptimized: ${result.optimized_code.length} chars`
    }
  ]
});

  } catch (e) {
    await interaction.editReply(`Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
