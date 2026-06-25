import type { Request, Response } from "express";
import { HskService } from "./hsk.service";

// ── Public / User endpoints ────────────────────────────────────────────────

export async function getWordsByLevel(req: Request, res: Response): Promise<void> {
  try {
    const level = parseInt(req.params.level, 10);
    if (isNaN(level) || level < 1 || level > 7) {
      res.status(400).json({ success: false, message: "Invalid HSK level" });
      return;
    }
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const data = await HskService.getWordsByLevel(level, page, limit);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllWordsByLevel(req: Request, res: Response): Promise<void> {
  try {
    const level = parseInt(req.params.level, 10);
    if (isNaN(level) || level < 1 || level > 7) {
      res.status(400).json({ success: false, message: "Invalid HSK level" });
      return;
    }
    const words = await HskService.getAllWordsByLevel(level);
    res.json({ success: true, data: words });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getQuizWords(req: Request, res: Response): Promise<void> {
  try {
    const level = parseInt(req.params.level, 10);
    if (isNaN(level) || level < 1 || level > 7) {
      res.status(400).json({ success: false, message: "Invalid HSK level" });
      return;
    }
    const count = parseInt(req.query.count as string, 10) || 4;
    const words = await HskService.getQuizWords(level, Math.max(count, 4));
    res.json({ success: true, data: words });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getLevelStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = await HskService.getLevelStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserProgress(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const progress = await HskService.getUserProgress(userId);
    res.json({ success: true, data: progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserProgressByLevel(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const level = parseInt(req.params.level, 10);
    const progress = await HskService.getUserProgressByLevel(userId, level);
    res.json({ success: true, data: progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function markWordLearned(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { hskLevel, wordId } = req.body;
    const progress = await HskService.markWordLearned(userId, hskLevel, wordId);
    res.json({ success: true, data: progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function recordAttempt(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { hskLevel, correct } = req.body;
    const progress = await HskService.recordAttempt(userId, hskLevel, correct);
    res.json({ success: true, data: progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── Admin endpoints ────────────────────────────────────────────────────────

export async function adminCreateWord(req: Request, res: Response): Promise<void> {
  try {
    const word = await HskService.createWord(req.body);
    res.status(201).json({ success: true, data: word });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminUpdateWord(req: Request, res: Response): Promise<void> {
  try {
    const word = await HskService.updateWord(req.params.id, req.body);
    if (!word) {
      res.status(404).json({ success: false, message: "Word not found" });
      return;
    }
    res.json({ success: true, data: word });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminDeleteWord(req: Request, res: Response): Promise<void> {
  try {
    await HskService.deleteWord(req.params.id);
    res.json({ success: true, message: "Word deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminGetWordsByLevel(req: Request, res: Response): Promise<void> {
  try {
    const level = parseInt(req.params.level, 10);
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const data = await HskService.getWordsByLevel(level, page, limit);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
