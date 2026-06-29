import { createLogger } from "~/lib/logger";
import { HskWordModel } from "./hsk-word.model";
import { hsk1Words } from "../data/hsk1-words";
import { hsk2Words } from "../data/hsk2-words";
import { hsk3Words } from "../data/hsk3-words";
import { hsk4Words } from "../data/hsk4-words";
import { hsk5Words } from "../data/hsk5-words";
import { hsk6Words } from "../data/hsk6-words";

const logger = createLogger("HskSeed");

const allWordsByLevel = [
  { level: 1, words: hsk1Words },
  { level: 2, words: hsk2Words },
  { level: 3, words: hsk3Words },
  { level: 4, words: hsk4Words },
  { level: 5, words: hsk5Words },
  { level: 6, words: hsk6Words },
];

export async function seedHskWords(): Promise<void> {
  try {
    for (const { level, words } of allWordsByLevel) {
      const existingChars = await HskWordModel.distinct("chinese", { hskLevel: level });
      const existingSet = new Set(existingChars);
      const toInsert = words.filter((w) => !existingSet.has(w.chinese));
      if (toInsert.length > 0) {
        await HskWordModel.insertMany(toInsert);
        logger.info(`✅ Added ${toInsert.length} new words for HSK ${level}`);
      } else {
        logger.info(`HSK level ${level} up to date (${existingChars.length} words)`);
      }
    }
  } catch (error) {
    logger.error("❌ Failed to seed HSK words:", error);
  }
}
