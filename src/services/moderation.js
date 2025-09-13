import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const en = fs.readFileSync(path.join(__dirname, "../data/banned.en.txt"), "utf8")
  .split("\n").map(s => s.trim()).filter(Boolean);
const hi = fs.readFileSync(path.join(__dirname, "../data/banned.hi.txt"), "utf8")
  .split("\n").map(s => s.trim()).filter(Boolean);
const te = fs.readFileSync(path.join(__dirname, "../data/banned.te.txt"), "utf8")
  .split("\n").map(s => s.trim()).filter(Boolean);

// Very simple language hints:
const isDevanagari = (s) => /[\u0900-\u097F]/.test(s);  // Hindi
const isTelugu     = (s) => /[\u0C00-\u0C7F]/.test(s);  // Telugu

function containsBadWord(msg, list) {
  const lower = msg.toLowerCase();
  return list.some(w => w && lower.includes(w));
}

export function shouldDelete(messageContent) {
  // Check script to choose list
  if (isTelugu(messageContent)) return containsBadWord(messageContent, te);
  if (isDevanagari(messageContent)) return containsBadWord(messageContent, hi);
  // default to English
  return containsBadWord(messageContent, en);
}
