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

    // 🔹 Split into multiple messages if too long
    const parts = [];

    parts.push(`🎯 **Code Check Result**`);
    parts.push(`📝 **Original Code:**\n\`\`\`${lang}\n${code}\n\`\`\``);

    if (result.errors && result.errors.length > 0) {
      const errorsText = Array.isArray(result.errors)
        ? result.errors.map(e =>
            typeof e === "string" ? e : `Line ${e.line || "?"}: ${e.message}`
          ).join("\n")
        : result.errors;

      parts.push(`✅ **Errors Found:**\n${errorsText}`);
    } else {
      parts.push(`✅ **No errors detected.**`);
    }

    if (result.fixed_code) {
      parts.push(`🔧 **Fixed Code:**\n\`\`\`${lang}\n${result.fixed_code}\n\`\`\``);
    }

    if (result.optimized_code) {
      parts.push(`⚡ **Optimized Code:**\n\`\`\`${lang}\n${result.optimized_code}\n\`\`\``);
    }

    // Send all parts safely
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
