import { Router } from "express";
import {
  getWordsByLevel,
  getAllWordsByLevel,
  getQuizWords,
  getLevelStats,
  getUserProgress,
  getUserProgressByLevel,
  markWordLearned,
  recordAttempt,
  adminCreateWord,
  adminUpdateWord,
  adminDeleteWord,
  adminGetWordsByLevel,
} from "./hsk.controller";
import { requireAuth, requireAdmin } from "~/modules/authentication/authentication.middleware";

const router = Router();

// Public / user routes
router.get("/hsk/levels/stats", getLevelStats);
router.get("/hsk/words/:level/all", getAllWordsByLevel);
router.get("/hsk/words/:level", getWordsByLevel);
router.get("/hsk/quiz/:level", getQuizWords);

// Authenticated user routes
router.get("/hsk/progress", requireAuth, getUserProgress);
router.get("/hsk/progress/:level", requireAuth, getUserProgressByLevel);
router.post("/hsk/progress/learn", requireAuth, markWordLearned);
router.post("/hsk/progress/attempt", requireAuth, recordAttempt);

// Admin routes
router.get("/admin/hsk/words/:level", requireAdmin, adminGetWordsByLevel);
router.post("/admin/hsk/words", requireAdmin, adminCreateWord);
router.put("/admin/hsk/words/:id", requireAdmin, adminUpdateWord);
router.delete("/admin/hsk/words/:id", requireAdmin, adminDeleteWord);

export default router;
