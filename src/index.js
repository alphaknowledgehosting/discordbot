import "dotenv/config";
import { Client, GatewayIntentBits, Partials, REST, Routes, Events } from "discord.js";
import { shouldDelete } from "./services/moderation.js";
import { startContestWatcher } from "./services/contests.js";
import { startYouTubeWatcher } from "./services/youtube.js";
import * as Help from "./commands/help.js";
import * as Check from "./commands/check.js";
import * as Debug from "./commands/debug.js";

const commands = [Help.data, Check.data, Debug.data];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // needed for moderation
  ],
  partials: [Partials.Channel]
});

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  // For global commands:
  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
    { body: commands }
  );
  // For dev-guild only (faster updates), use:
  // await rest.put(
  //   Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
  //   { body: commands }
  // );
  console.log("✅ Slash commands registered.");
}

client.once(Events.ClientReady, async (c) => {
  console.log(`🤖 Logged in as ${c.user.tag}`);
  startContestWatcher(client);
  startYouTubeWatcher(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === Help.data.name) return Help.execute(interaction);
    if (interaction.commandName === Check.data.name) return Check.execute(interaction);
    if (interaction.commandName === Debug.data.name) return Debug.execute(interaction);
  } catch (e) {
    console.error(e);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("Something went wrong.");
    } else {
      await interaction.reply({ content: "Something went wrong.", ephemeral: true });
    }
  }
});

// Auto-delete bad words (Telugu/Hindi/English)
client.on(Events.MessageCreate, async (msg) => {
  try {
    if (!msg.guild || msg.author.bot) return;
    if (!msg.content) return;

    if (shouldDelete(msg.content)) {
      await msg.delete();
      await msg.channel.send({ content: `⚠️ ${msg.author}, your message was removed due to prohibited language.`, allowedMentions: { users: [msg.author.id] }});
    }
  } catch (e) {
    console.error("Moderation error:", e.message);
  }
});

await registerCommands();
client.login(process.env.DISCORD_TOKEN);
