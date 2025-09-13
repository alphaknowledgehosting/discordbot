import cron from "node-cron";
import Parser from "rss-parser";
import { CONFIG } from "../config.js";

const parser = new Parser();
let latestVideoId = null;

export function startYouTubeWatcher(client) {
  cron.schedule(CONFIG.youtubeCron, async () => {
    try {
      if (!CONFIG.youtubeChannelId) return;
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CONFIG.youtubeChannelId}`;
      const feed = await parser.parseURL(feedUrl);
      if (!feed?.items?.length) return;

      const newest = feed.items[0]; // most recent
      const id = newest.id || (newest.link ?? "");
      if (id && id !== latestVideoId) {
        latestVideoId = id;
        const ch = client.channels.cache.get(CONFIG.notifyChannelId);
        if (!ch) return;
        await ch.send(`🎬 **New YouTube Upload**: ${newest.title}\n${newest.link}`);
      }
    } catch (e) {
      console.error("YouTube watcher error:", e.message);
    }
  });
}
