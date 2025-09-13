import fetch from "node-fetch";
import cron from "node-cron";
import { CONFIG } from "../config.js";

let lastSent = new Set(); // dedupe within process lifetime

function normalizeContest(c) {
  return {
    name: c.name,
    url: c.url,
    site: c.site,
    start_time: c.start_time,
    end_time: c.end_time
  };
}

export function startContestWatcher(client) {
  cron.schedule(CONFIG.contestsCron, async () => {
    try {
      const r = await fetch(CONFIG.contestsEndpoint);
      const arr = await r.json();
      const upcoming = (arr || [])
        .map(normalizeContest)
        .filter(c =>
          ["Codeforces", "LeetCode", "CodeChef"].includes(c.site) ||
          /your-website\.com/i.test(c.url) // customize to your domain
        );

      const channel = client.channels.cache.get(CONFIG.notifyChannelId);
      if (!channel) return;

      for (const c of upcoming) {
        const key = `${c.site}-${c.name}-${c.start_time}`;
        if (lastSent.has(key)) continue;
        lastSent.add(key);

        await channel.send(
          `📢 **Upcoming Contest** (${c.site})\n` +
          `**${c.name}**\n` +
          `Starts: ${c.start_time}\nEnds: ${c.end_time}\n` +
          `${c.url}`
        );
      }
    } catch (e) {
      console.error("Contest watcher error:", e.message);
    }
  });
}
