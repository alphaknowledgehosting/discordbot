// src/utils/splitMessage.js

/**
 * Splits a long string into smaller chunks so that
 * they fit within Discord's 2000-character message limit.
 *
 * @param {string} text - The text to split.
 * @param {number} maxLength - Maximum allowed length per chunk (default: 1990).
 *                             Slightly less than 2000 to allow for formatting.
 * @returns {string[]} Array of text chunks.
 */
export function splitMessage(text, maxLength = 1990) {
  if (!text || typeof text !== "string") return [""];
  
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + maxLength));
    start += maxLength;
  }

  return chunks;
}
