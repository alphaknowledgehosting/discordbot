import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  Events
} from "discord.js";

import { shouldDelete } from "./services/moderation.js";
import { startContestWatcher } from "./services/contests.js";
import { startYouTubeWatcher } from "./services/youtube.js";

import * as Help from "./commands/help.js";
import * as Check from "./commands/check.js";
import * as Debug from "./commands/debug.js";

import http from "http";

// ✅ Create an HTTP server (to satisfy Render Web Service port checks)
const PORT = process.env.PORT || 5173;
const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("AkiBot is alive!\n");
});

// ✅ Express-style listen log
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Slash commands to register
const commands = [Help.data, Check.data, Debug.data];

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Register slash commands
async function registerCommands() {
  try {
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands
    });

    console.log("✅ Slash commands registered.");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
}

// Bot ready event
client.once(Events.ClientReady, (c) => {
  console.log(`🤖 Logged in as ${c.user.tag}`);
  startContestWatcher(client);
  startYouTubeWatcher(client);
});

// Slash command handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === Help.data.name) return Help.execute(interaction);
    if (interaction.commandName === Check.data.name) return Check.execute(interaction);
    if (interaction.commandName === Debug.data.name) return Debug.execute(interaction);
  } catch (err) {
    console.error("Command error:", err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("⚠️ Something went wrong while executing this command.");
    } else {
      await interaction.reply({ content: "⚠️ Something went wrong.", flags: 64 }); // ephemeral
    }
  }
});

// Moderation (auto-delete bad words)
client.on(Events.MessageCreate, async (msg) => {
  try {
    if (!msg.guild || msg.author.bot || !msg.content) return;

    if (shouldDelete(msg.content)) {
      await msg.delete();
      await msg.channel.send({
        content: `⚠️ ${msg.author}, your message was removed due to prohibited language.`,
        allowedMentions: { users: [msg.author.id] }
      });
    }
  } catch (err) {
    console.error("Moderation error:", err.message);
  }
});

// Start bot
await registerCommands();
client.login(process.env.DISCORD_TOKEN);
