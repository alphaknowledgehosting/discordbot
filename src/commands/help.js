export const data = {
  name: "help",
  description: "Show AkiBot commands"
};

export async function execute(interaction) {
  await interaction.reply({
    ephemeral: true,
    content:
`**AkiBot — Commands**
/help — This message
/check [lang] [code] — Check/fix code (java|c|cpp|python)
/debug [lang] [issue] [code] — Debug with steps
`
  });
}
