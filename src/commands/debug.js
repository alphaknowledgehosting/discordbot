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

  await interaction.deferReply({ flags: 64 }); // ✅ ephemeral replacement
  try {
    const result = await llmDebug(issue, code, lang);
    await interaction.editReply(
      `**Root cause:** ${result.root_cause}\n\n` +
      `**Steps:**\n${result.steps}\n\n` +
      "```" + lang + "\n" + result.fixed_code + "\n```"
    );
  } catch (e) {
    await interaction.editReply(`Debugging failed: ${e.message}`);
  }
}
