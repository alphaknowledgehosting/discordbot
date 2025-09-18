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
import * as Syntax from "./commands/syntax.js";
import * as Format from "./commands/format.js";
import * as Company from "./commands/company.js";
import * as ListCompanies from "./commands/listcompanies.js";

import http from "http";
import https from "https";
import url from "url";

// ✅ Keep Render service alive
const PORT = process.env.PORT || 5173;
const app = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health endpoint
  if (pathname === "/health" && req.method === "GET") {
    try {
      const healthData = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        message: "AkiBot is healthy and running",
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch
        },
        memory: {
          used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
        }
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(healthData, null, 2));
      return;
    } catch (error) {
      const errorData = {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
        error: error.message
      };
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify(errorData, null, 2));
      return;
    }
  }

  // Status endpoint
  if (pathname === "/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("AkiBot is alive!\n");
    return;
  }

  // API info
  if (pathname === "/api" && req.method === "GET") {
    const apiInfo = {
      name: "AkiBot API",
      version: "1.0.0",
      endpoints: {
        "/health": "GET - Detailed health check",
        "/status": "GET - Simple alive check",
        "/api": "GET - API information"
      },
      documentation: "https://github.com/your-repo/akibot"
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(apiInfo, null, 2));
    return;
  }

  // Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify(
      {
        error: "Not Found",
        message: "Try /health, /status, or /api",
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Status check: http://localhost:${PORT}/status`);
});

// ✅ Self-ping every 14 minutes
const SELF_URL = process.env.RENDER_EXTERNAL_URL;
if (SELF_URL) {
  setInterval(() => {
    https
      .get(SELF_URL, (res) => {
        console.log(`🔄 Keep-alive ping: ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error("Ping error:", err.message);
      });
  }, 14 * 60 * 1000);
}

// ✅ Register slash commands
const commands = [
  Help.data,
  Check.data,
  Debug.data,
  Syntax.data,
  Format.data,
  Company.data,
  ListCompanies.data
];

// Create Discord client
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

    // guild-level for instant updates
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Guild slash commands registered.");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
}

// Bot ready
client.once(Events.ClientReady, (c) => {
  console.log(`🤖 Logged in as ${c.user.tag}`);
  startContestWatcher(client);
  startYouTubeWatcher(client);
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const cmdMap = {
      [Help.data.name]: Help,
      [Check.data.name]: Check,
      [Debug.data.name]: Debug,
      [Syntax.data.name]: Syntax,
      [Format.data.name]: Format,
      [Company.data.name]: Company,
      [ListCompanies.data.name]: ListCompanies
    };

    const command = cmdMap[interaction.commandName];
    if (command) return command.execute(interaction);
  } catch (err) {
    console.error("Command error:", err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("⚠️ Something went wrong.");
    } else {
      await interaction.reply({ content: "⚠️ Something went wrong.", flags: 64 });
    }
  }
});

// Auto-delete bad words
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
