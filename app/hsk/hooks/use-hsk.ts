import { useState, useEffect, useCallback } from "react";

export type HskWord = {
  _id: string;
  chinese: string;
  pinyin: string;
  english: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleEnglish?: string;
  hskLevel: number;
  audioUrl?: string;
};

export type UserProgress = {
  userId: string;
  hskLevel: number;
  learnedWordIds: string[];
  streak: number;
  lastStudiedAt?: string | null;
  totalCorrect: number;
  totalAttempted: number;
};

export type LevelStat = {
  level: number;
  total: number;
};

export function useHskWords(level: number | null) {
  const [words, setWords] = useState<HskWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    if (!level) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/hsk/words/${level}/all`);
      const json = await res.json();
      if (json.success) setWords(json.data);
      else setError(json.message);
    } catch {
      setError("Failed to load words");
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  return { words, loading, error, refetch: fetchWords };
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hsk/progress");
      if (res.status === 401) { setProgress([]); return; }
      const json = await res.json();
      if (json.success) setProgress(json.data);
    } catch {
      setError("Failed to load progress");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const markLearned = async (hskLevel: number, wordId: string) => {
    try {
      const res = await fetch("/api/hsk/progress/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hskLevel, wordId }),
      });
      const json = await res.json();
      if (json.success) await fetchProgress();
    } catch {}
  };

  const recordAttempt = async (hskLevel: number, correct: boolean) => {
    try {
      await fetch("/api/hsk/progress/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hskLevel, correct }),
      });
      await fetchProgress();
    } catch {}
  };

  return { progress, loading, error, markLearned, recordAttempt, refetch: fetchProgress };
}

export function useLevelStats() {
  const [stats, setStats] = useState<LevelStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/hsk/levels/stats")
      .then((r) => r.json())
      .then((json) => { if (json.success) setStats(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
