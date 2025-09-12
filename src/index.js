// src/index.js (or bot.js)
import commandHandler from "./handlers/commandHandler.js";

import { Client, GatewayIntentBits, Collection } from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { loadBadWords } from "./commands/moderation/filter.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

// --- Initialize Bot ---
(async () => {
  try {
    // Load bad words from Gemini at startup
    await loadBadWords();

    // Database connection
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ Connected to MongoDB");
    }

    // Load commands dynamically
    commandHandler(client);

    client.once("ready", () => {
      console.log(`🚀 ${client.user.tag} is online and ready!`);
      console.log(`📊 Serving ${client.guilds.cache.size} servers`);
      console.log(`👥 Watching ${client.users.cache.size} users`);
    });

    // Message handler (commands + ping fallback)
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;

      const prefix = process.env.BOT_PREFIX || "!";
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName);

      // --- Fallback ping ---
      if (!command) {
        if (commandName === "ping") {
          const latency = Date.now() - message.createdTimestamp;
          return message.reply(
            `🏓 Pong! Latency: ${latency}ms | API: ${Math.round(
              client.ws.ping
            )}ms`
          );
        }
        return;
      }

      // --- Cooldown System ---
      const { cooldowns } = client;
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(
            `⏰ Please wait ${timeLeft.toFixed(
              1
            )} more seconds before using \`${command.name}\` again.`
          );
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      // --- Execute command ---
      try {
        await command.execute(message, args);
      } catch (error) {
        console.error("Command execution error:", error);
        message.reply("❌ There was an error executing that command!");
      }
    });

    client.on("error", console.error);
    client.on("warn", console.warn);

    // --- Login ---
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("❌ Bot startup error:", err);
  }
})();
