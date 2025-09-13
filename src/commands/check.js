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

    await interaction.editReply(
      `**Errors Found:**\n${result.errors || "No errors detected"}\n\n` +
      `**Corrected Code:**\n\`\`\`${lang}\n${result.fixed_code || code}\n\`\`\`\n\n` +
      `**Optimized Code:**\n\`\`\`${lang}\n${result.optimized_code || code}\n\`\`\``
    );
  } catch (e) {
    await interaction.editReply(`Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
