export const CONFIG = {
  notifyChannelId: process.env.NOTIFY_CHANNEL_ID,
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID,
  // Poll intervals
  contestsCron: "*/10 * * * *", // every 10 minutes
  youtubeCron: "*/5 * * * *",   // every 5 minutes
  // Sources
  contestsEndpoint: "https://kontests.net/api/v1/all" // aggregated contests
};
