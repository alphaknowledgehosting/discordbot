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

  await interaction.deferReply({ flags: 64 }); // private reply
  try {
    const result = await llmSyntaxCheck(code, lang);

    if (result.syntax_ok) {
      await interaction.editReply("✅ No syntax errors detected!");
    } else {
      await interaction.editReply(
        `❌ Syntax errors found:\n- ${result.errors.join("\n- ")}`
      );
    }
  } catch (e) {
    await interaction.editReply(`Syntax check failed: ${e.message}`);
  }
}
