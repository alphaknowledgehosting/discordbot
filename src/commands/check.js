import { llmCheckAndFix } from "../services/gemini.js";
import { splitMessage } from "../utils/splitMessage.js";

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

  await interaction.deferReply({ flags: 64 });
  try {
    const result = await llmCheckAndFix(code, lang);

    // Format reply content
    const reply = 
      `🎯 **Code Check Result**\n\n` +
      `📝 **Original Code:**\n\`\`\`${lang}\n${code}\n\`\`\`\n\n` +
      `✅ **Errors:**\n${Array.isArray(result.errors) ? result.errors.join("\n") : result.errors}\n\n` +
      `🔧 **Fixed Code:**\n\`\`\`${lang}\n${result.fixed_code}\n\`\`\`\n\n` +
      `⚡ **Optimized Code:**\n\`\`\`${lang}\n${result.optimized_code}\n\`\`\``;

    // Split if too long
    const parts = splitMessage(reply);
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        await interaction.editReply(parts[i]);
      } else {
        await interaction.followUp({ content: parts[i], flags: 64 });
      }
    }
  } catch (e) {
    await interaction.editReply(`⚠️ Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
