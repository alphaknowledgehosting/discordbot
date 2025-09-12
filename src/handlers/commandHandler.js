// src/handlers/commandHandler.js
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function commandHandler(client) {
  const commandFolders = readdirSync(path.join(__dirname, "../commands"));

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(
      path.join(__dirname, `../commands/${folder}`)
    ).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      // Use dynamic import in ESM
      import(pathToFileURL(path.join(__dirname, `../commands/${folder}/${file}`)))
        .then((commandModule) => {
          const command = commandModule.default || commandModule;
          if (command?.name) {
            client.commands.set(command.name, command);
            console.log(`✅ Loaded command: ${command.name}`);
          }
        })
        .catch((err) =>
          console.error(`❌ Failed to load command ${file}:`, err)
        );
    }
  }
}
