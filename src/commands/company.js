import fs from "fs";
import path from "path";

export const data = {
  name: "company",
  description: "Get past question files for a company",
  options: [
    {
      name: "name",
      type: 3,
      description: "Company name (e.g., amazon, google, tesla, ibm)",
      required: true
    }
  ]
};

export async function execute(interaction) {
  const companyName = interaction.options.getString("name").toLowerCase();
  const folderPath = path.resolve("./data"); // ✅ relative to project root

  let files = [];
  try {
    files = fs.readdirSync(folderPath).filter(
      (f) =>
        f.toLowerCase().startsWith(companyName) && f.toLowerCase().endsWith(".csv")
    );
  } catch (err) {
    console.error("File read error:", err);
  }

  if (files.length === 0) {
    return interaction.reply({
      content: `❌ No files found for **${companyName}**.`,
      flags: 64 // private reply
    });
  }

  // Confirm privately in server
  await interaction.reply({
    content: `📩 I found ${files.length} file(s) for **${companyName}**. Check your DMs!`,
    flags: 64
  });

  // Send CSVs in DM
  try {
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await interaction.user.send({
        content: `📄 File: **${file}**`,
        files: [filePath]
      });
    }
  } catch (err) {
    console.error("DM error:", err);
    await interaction.followUp({
      content: "⚠️ Could not DM you. Please enable DMs from server members.",
      flags: 64
    });
  }
}
