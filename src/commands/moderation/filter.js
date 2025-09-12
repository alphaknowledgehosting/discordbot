import { getBadWords } from "../../services/badWordsService.js";

let badWordsList = [];

export async function loadBadWords() {
  badWordsList = await getBadWords();
  console.log("Loaded Bad Words:", badWordsList.length);
}

export function containsBadWord(messageContent) {
  if (!badWordsList.length) return false;

  return badWordsList.some(word =>
    messageContent.toLowerCase().includes(word.toLowerCase())
  );
}
