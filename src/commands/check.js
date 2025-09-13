import { llmCheckAndFix } from "../services/gemini.js";

export const data = {
  name: "check",
  description: "Check, fix, and optimize code using Gemini",
  options: [
    { name: "lang", type: 3, description: "java|c|cpp|python", required: true },
    { name: "code", type: 3, description: "Paste your code", required: true }
  ]
};

// Helper to split long messages into 2000-char chunks
function splitMessage(text, maxLength = 2000) {
  const chunks = [];
  while (text.length > 0) {
    chunks.push(text.slice(0, maxLength));
    text = text.slice(maxLength);
  }
  return chunks;
}

export async function execute(interaction) {
  const lang = interaction.options.getString("lang");
  const code = interaction.options.getString("code");

  await interaction.deferReply({ flags: 64 }); // reply hidden to user only

  try {
    const result = await llmCheckAndFix(code, lang);

    // Format output nicely
    const output =
      `🎯 **Code Check Result**\n\n` +
      `📝 **Original Code:**\n\`\`\`${lang}\n${code}\n\`\`\`\n\n` +
      `✅ **Errors:**\n${Array.isArray(result.errors) ? result.errors.join("\n") : result.errors}\n\n` +
      `🔧 **Fixed Code:**\n\`\`\`${lang}\n${result.fixed_code}\n\`\`\`\n\n` +
      `⚡ **Optimized Code:**\n\`\`\`${lang}\n${result.optimized_code}\n\`\`\``;

    // Split into safe chunks
    const parts = splitMessage(output);

    // First part replaces the deferred reply
    await interaction.editReply(parts[0]);

    // Any extra parts follow up
    for (let i = 1; i < parts.length; i++) {
      await interaction.followUp({ content: parts[i], flags: 64 });
    }
  } catch (e) {
    await interaction.editReply(`⚠️ Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
