import { createLogger } from "~/lib/logger";
import { HskWordModel } from "./hsk-word.model";
import { hsk1Words } from "../data/hsk1-words";
import { hsk2Words } from "../data/hsk2-words";
import { hsk3Words } from "../data/hsk3-words";
import { hsk4Words } from "../data/hsk4-words";
import { hsk5Words } from "../data/hsk5-words";
import { hsk6Words } from "../data/hsk6-words";

const logger = createLogger("HskSeed");

const levelData: Record<number, typeof hsk1Words> = {
  1: hsk1Words,
  2: hsk2Words,
  3: hsk3Words,
  4: hsk4Words,
  5: hsk5Words,
  6: hsk6Words,
};

export async function seedHskWords(): Promise<void> {
  try {
    for (const level of [1, 2, 3, 4, 5, 6]) {
      const count = await HskWordModel.countDocuments({ hskLevel: level });
      if (count === 0) {
        const words = levelData[level];
        await HskWordModel.insertMany(words);
        logger.info(`✅ Seeded ${words.length} HSK level ${level} words.`);
      } else {
        logger.info(`HSK level ${level} already seeded (${count} words), skipping.`);
      }
    }
  } catch (error) {
    logger.error("❌ Failed to seed HSK words:", error);
  }
}
