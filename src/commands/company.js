import fs from "fs";
import path from "path";

export const data = {
  name: "company",
  description: "Get question CSV files for a specific company",
  options: [
    {
      name: "name",
      type: 3, // STRING
      description: "Company name (e.g., square, amazon, google)",
      required: true
    }
  ]
};

export async function execute(interaction) {
  const companyName = interaction.options.getString("name").toLowerCase();

  await interaction.deferReply({ flags: 64 }); // ✅ private reply only

  try {
    const folderPath = path.resolve("./data"); // put your CSVs in `data/` folder
    const files = fs.readdirSync(folderPath);

    // Match files by prefix before "_"
    const companyFiles = files.filter(
      (f) => f.toLowerCase().startsWith(companyName + "_") && f.endsWith(".csv")
    );

    if (companyFiles.length === 0) {
      await interaction.editReply(`⚠️ No CSV files found for company **${companyName}**.`);
      return;
    }

    // Reply with the file names as a list
    let replyMessage = `📂 **Files for company: ${companyName}**\n\n`;
    replyMessage += companyFiles.map((f) => `- ${f}`).join("\n");

    await interaction.editReply(replyMessage);

    // (Optional) If you want to attach the files:
    // await interaction.editReply({
    //   content: replyMessage,
    //   files: companyFiles.map((f) => path.join(folderPath, f))
    // });

  } catch (err) {
    console.error("Company command error:", err);
    await interaction.editReply("⚠️ Failed to fetch company files.");
  }
}
