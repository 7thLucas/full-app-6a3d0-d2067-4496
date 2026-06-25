import { HskWordModel } from "./hsk-word.model";
import { UserProgressModel } from "./user-progress.model";

export class HskService {
  // ── Words ──────────────────────────────────────────────────────────────────

  static async getWordsByLevel(level: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [words, total] = await Promise.all([
      HskWordModel.find({ hskLevel: level, isActive: true })
        .skip(skip)
        .limit(limit)
        .lean(),
      HskWordModel.countDocuments({ hskLevel: level, isActive: true }),
    ]);
    return { words, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async getAllWordsByLevel(level: number) {
    return HskWordModel.find({ hskLevel: level, isActive: true }).lean();
  }

  static async getWordById(id: string) {
    return HskWordModel.findById(id).lean();
  }

  static async createWord(data: {
    chinese: string;
    pinyin: string;
    english: string;
    hskLevel: number;
    exampleSentence?: string;
    examplePinyin?: string;
    exampleEnglish?: string;
    audioUrl?: string;
  }) {
    return HskWordModel.create(data);
  }

  static async updateWord(id: string, data: Partial<{
    chinese: string;
    pinyin: string;
    english: string;
    hskLevel: number;
    exampleSentence: string;
    examplePinyin: string;
    exampleEnglish: string;
    audioUrl: string;
    isActive: boolean;
  }>) {
    return HskWordModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static async deleteWord(id: string) {
    return HskWordModel.findByIdAndDelete(id);
  }

  static async getLevelStats() {
    const levels = [1, 2, 3, 4, 5, 6];
    const stats = await Promise.all(
      levels.map(async (level) => ({
        level,
        total: await HskWordModel.countDocuments({ hskLevel: level, isActive: true }),
      }))
    );
    return stats;
  }

  static async getQuizWords(level: number, count = 4) {
    // Get random words for quiz options
    return HskWordModel.aggregate([
      { $match: { hskLevel: level, isActive: true } },
      { $sample: { size: count } },
    ]);
  }

  // ── User Progress ──────────────────────────────────────────────────────────

  static async getUserProgress(userId: string) {
    return UserProgressModel.find({ userId }).lean();
  }

  static async getUserProgressByLevel(userId: string, hskLevel: number) {
    return UserProgressModel.findOne({ userId, hskLevel }).lean();
  }

  static async markWordLearned(userId: string, hskLevel: number, wordId: string) {
    const today = new Date().toISOString().split("T")[0];
    const progress = await UserProgressModel.findOne({ userId, hskLevel });

    if (!progress) {
      return UserProgressModel.create({
        userId,
        hskLevel,
        learnedWordIds: [wordId],
        streak: 1,
        lastStudiedAt: today,
        totalCorrect: 1,
        totalAttempted: 1,
      });
    }

    if (!progress.learnedWordIds.includes(wordId)) {
      progress.learnedWordIds.push(wordId);
    }

    // Update streak
    const lastDate = progress.lastStudiedAt;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      progress.streak = lastDate === yesterdayStr ? (progress.streak || 0) + 1 : 1;
      progress.lastStudiedAt = today;
    }

    progress.totalCorrect = (progress.totalCorrect || 0) + 1;
    progress.totalAttempted = (progress.totalAttempted || 0) + 1;
    return progress.save();
  }

  static async recordAttempt(userId: string, hskLevel: number, correct: boolean) {
    const today = new Date().toISOString().split("T")[0];
    const progress = await UserProgressModel.findOne({ userId, hskLevel });

    if (!progress) {
      return UserProgressModel.create({
        userId,
        hskLevel,
        learnedWordIds: [],
        streak: correct ? 1 : 0,
        lastStudiedAt: today,
        totalCorrect: correct ? 1 : 0,
        totalAttempted: 1,
      });
    }

    const lastDate = progress.lastStudiedAt;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      progress.streak = lastDate === yesterdayStr ? (progress.streak || 0) + 1 : 1;
      progress.lastStudiedAt = today;
    }

    if (correct) progress.totalCorrect = (progress.totalCorrect || 0) + 1;
    progress.totalAttempted = (progress.totalAttempted || 0) + 1;
    return progress.save();
  }
}
