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

  await interaction.deferReply({ flags: 64 }); // reply private to user
  try {
    const result = await llmCheckAndFix(code, lang);

    // Handle errors output nicely
    const errorsText = Array.isArray(result.errors)
      ? result.errors.map(e => (typeof e === "string" ? e : `Line ${e.line || "?"}: ${e.description || e.message || e}`)).join("\n")
      : (result.errors || "No errors found");

    await interaction.editReply(
      `🎯 **Code Check Result**\n\n` +
      `📝 **Original Code:**\n\`\`\`${lang}\n${code}\n\`\`\`\n\n` +
      `✅ **Errors:**\n${errorsText}\n\n` +
      `🔧 **Fixed Code:**\n\`\`\`${lang}\n${result.fixed_code || code}\n\`\`\`\n\n` +
      `⚡ **Optimized Code:**\n\`\`\`${lang}\n${result.optimized_code || code}\n\`\`\``
    );
  } catch (e) {
    await interaction.editReply(`⚠️ Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
