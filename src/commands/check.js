import { llmCheckAndFix } from "../services/gemini.js";

export const data = {
  name: "check",
  description: "Check & correct code using Gemini",
  options: [
    { name: "lang", type: 3, description: "java|c|cpp|python", required: true },
    { name: "code", type: 3, description: "Paste your code", required: true }
  ]
};

export async function execute(interaction) {
  const lang = interaction.options.getString("lang");
  const code = interaction.options.getString("code");

  await interaction.deferReply({ ephemeral: true });
  try {
    const result = await llmCheckAndFix(code, lang);
    await interaction.editReply(
      `**Summary:** ${result.summary}\n` +
      "```" + lang + "\n" + result.fixed_code + "\n```"
    );
  } catch (e) {
    await interaction.editReply(`Sorry, I couldn't parse a fix: ${e.message}`);
  }
}
