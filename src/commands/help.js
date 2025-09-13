export const data = {
  name: "help",
  description: "Show AkiBot commands"
};

export async function execute(interaction) {
  try {
    // ✅ Step 1: Defer reply immediately
    await interaction.deferReply({ flags: 64 });

    // ✅ Step 2: Edit reply safely
    await interaction.editReply(
      "**AkiBot — Commands**\n" +
      "/help — Show all commands\n" +
      "/check [lang] [code] — Check/fix code (java|c|cpp|python)\n" +
      "/company [name] — Get company-related question CSVs"+
      "/listcompanies — Show available companies from CSV files"
    );
  } catch (err) {
    console.error("Help command failed:", err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("⚠️ Something went wrong while showing help.");
    }
  }
}
