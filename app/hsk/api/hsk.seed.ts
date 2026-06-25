import { createLogger } from "~/lib/logger";
import { HskWordModel } from "./hsk-word.model";
import { hsk1Words } from "../data/hsk1-words";
import { hsk2Words } from "../data/hsk2-words";

const logger = createLogger("HskSeed");

export async function seedHskWords(): Promise<void> {
  try {
    const existing = await HskWordModel.countDocuments();
    if (existing > 0) {
      logger.info(`HSK words already seeded (${existing} words), skipping.`);
      return;
    }

    const allWords = [...hsk1Words, ...hsk2Words];
    await HskWordModel.insertMany(allWords);
    logger.info(`✅ Seeded ${allWords.length} HSK words successfully.`);
  } catch (error) {
    logger.error("❌ Failed to seed HSK words:", error);
  }
}
