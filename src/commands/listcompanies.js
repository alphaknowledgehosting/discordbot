import fs from "fs";
import path from "path";

export const data = {
  name: "listcompanies",
  description: "List all companies that have question CSV files"
};

export async function execute(interaction) {
  // Always resolve to project root
  const folderPath = path.join(process.cwd(), "data");

  let files = [];
  try {
    if (fs.existsSync(folderPath)) {
      files = fs.readdirSync(folderPath).filter(f => f.endsWith(".csv"));
    }
  } catch (err) {
    console.error("❌ Error reading data folder:", err);
  }

  if (files.length === 0) {
    return interaction.reply({
      content: "❌ No CSV files found in `data/` folder.",
      flags: 64
    });
  }

  // Extract company names (before first "_") and deduplicate
  const companies = [...new Set(files.map(f => f.split("_")[0].toLowerCase()))];

  await interaction.reply({
    content: `🏢 **Available Companies:**\n- ${companies.join("\n- ")}`,
    flags: 64
  });
}
