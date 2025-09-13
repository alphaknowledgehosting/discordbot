import fs from "fs";
import path from "path";

export const data = {
  name: "company",
  description: "Get past question files for a company",
  options: [
    {
      name: "name",
      type: 3,
      description: "Company name (e.g., amazon, square)",
      required: true
    }
  ]
};

export async function execute(interaction) {
  const companyName = interaction.options.getString("name").toLowerCase();
  const folderPath = path.resolve("data"); // ✅ CSV storage folder (root/data)

  let files = [];
  try {
    if (!fs.existsSync(folderPath)) {
      return interaction.reply({
        content: `⚠️ No **data** folder found at \`${folderPath}\`.  
Please create a \`/data\` folder in your project root and place CSV files like:  
\`amazon_1year.csv\`, \`amazon_6months.csv\``,
        flags: 64
      });
    }

    files = fs.readdirSync(folderPath)
      .filter(f => f.toLowerCase().startsWith(companyName) && f.endsWith(".csv"));
  } catch (err) {
    console.error("❌ FS error:", err);
    return interaction.reply({
      content: `⚠️ Could not read files. Make sure your \`/data\` folder is accessible.`,
      flags: 64
    });
  }

  if (files.length === 0) {
    return interaction.reply({
      content: `❌ No CSV files found for **${companyName}** in \`${folderPath}\`.  
Make sure file names follow this format:  
\`${companyName}_1year.csv\`, \`${companyName}_2year.csv\`, etc.`,
      flags: 64
    });
  }

  // Confirm privately in the server
  await interaction.reply({
    content: `📩 Found ${files.length} file(s) for **${companyName}**. Sending to your DMs...`,
    flags: 64
  });

  // Send files via DM
  try {
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await interaction.user.send({
        content: `📄 **${file}**`,
        files: [filePath]
      });
    }
  } catch (err) {
    console.error("❌ DM error:", err);
    await interaction.followUp({
      content: "⚠️ Could not DM you. Please enable DMs from server members.",
      flags: 64
    });
  }
}
