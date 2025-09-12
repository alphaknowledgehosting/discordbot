import { containsBadWord } from "../commands/moderation/filter.js";

export default async (client, message) => {
  if (message.author.bot) return;

  if (containsBadWord(message.content)) {
    await message.delete().catch(console.error);
    await message.channel.send(
      `${message.author}, your message contained inappropriate language and was removed. 🚫`
    );
  }
};
