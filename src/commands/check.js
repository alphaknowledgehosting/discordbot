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

  await interaction.deferReply({ flags: 64 }); // reply hidden to user only
  try {
    const result = await llmCheckAndFix(code, lang);

    let replyMsg = `🎯 **Code Check Result**\n\n`;

    // ✅ Errors
    if (result.errors && result.errors.length > 0) {
      const errorsText = Array.isArray(result.errors)
        ? result.errors.map(e =>
            typeof e === "string" ? e : `Line ${e.line || "?"}: ${e.message}`
          ).join("\n")
        : result.errors;

      replyMsg += `✅ **Errors Found:**\n${errorsText}\n\n`;
    } else {
      replyMsg += `✅ **No errors detected.**\n\n`;
    }

    // 🔧 Fixed code
    if (result.fixed_code) {
      replyMsg += `🔧 **Fixed Code:**\n\`\`\`${lang}\n${result.fixed_code}\n\`\`\`\n\n`;
    }

    // ⚡ Optimized code
    if (result.optimized_code) {
      replyMsg += `⚡ **Optimized Code:**\n\`\`\`${lang}\n${result.optimized_code}\n\`\`\`\n`;
    }

    // ✅ Send everything in one private message
    await interaction.editReply(replyMsg);

  } catch (e) {
    await interaction.editReply(`⚠️ Sorry, I couldn't analyze the code: ${e.message}`);
  }
}
