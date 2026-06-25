import { useState, useCallback } from "react";
import { useParams, Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { LearnNavbar } from "~/hsk/components/navbar";
import { Flashcard } from "~/hsk/components/flashcard";
import { QuizMode } from "~/hsk/components/quiz-mode";
import { StreakBadge } from "~/hsk/components/streak-badge";
import { useHskWords, useUserProgress } from "~/hsk/hooks/use-hsk";

type Mode = "flashcard" | "quiz";

export default function LearnLevelPage() {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level ?? "1", 10);
  const { config, loading } = useConfigurables();
  const { isAuthenticated } = useAuth();
  const { words, loading: wordsLoading } = useHskWords(levelNum);
  const { progress, markLearned, recordAttempt } = useUserProgress();

  const [mode, setMode] = useState<Mode>("flashcard");
  const [cardIndex, setCardIndex] = useState(0);
  const [sessionLearned, setSessionLearned] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const hskLevels = config?.hskLevels ?? [];
  const enableQuizMode = config?.enableQuizMode !== false;
  const levelLabel = hskLevels[levelNum - 1]?.level ?? `HSK ${levelNum}`;
  const levelDescription = hskLevels[levelNum - 1]?.description ?? "";

  const levelProgress = progress.find((p) => p.hskLevel === levelNum);
  const streak = levelProgress?.streak ?? 0;

  const handleKnow = useCallback(async () => {
    const word = words[cardIndex];
    if (!word) return;

    setFeedback("correct");
    setTimeout(() => setFeedback(null), 600);

    if (!sessionLearned.includes(word._id)) {
      setSessionLearned((prev) => [...prev, word._id]);
    }

    if (isAuthenticated) {
      await markLearned(levelNum, word._id);
    }

    setCardIndex((i) => (i + 1) % words.length);
  }, [words, cardIndex, sessionLearned, isAuthenticated, markLearned, levelNum]);

  const handleSkip = useCallback(() => {
    setCardIndex((i) => (i + 1) % words.length);
  }, [words.length]);

  const handleQuizAttempt = useCallback(async (correct: boolean) => {
    if (isAuthenticated) {
      await recordAttempt(levelNum, correct);
    }
  }, [isAuthenticated, recordAttempt, levelNum]);

  if (loading || wordsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${
        feedback === "correct" ? "bg-green-50" : feedback === "wrong" ? "bg-red-50" : ""
      }`}
    >
      <LearnNavbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            ← Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{levelLabel}</h1>
            {levelDescription && (
              <p className="text-muted-foreground text-sm mt-0.5">{levelDescription}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && <StreakBadge streak={streak} size="sm" />}
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {words.length} words
            </span>
          </div>
        </div>

        {/* Mode toggle */}
        {enableQuizMode && words.length >= 4 && (
          <div className="flex gap-2 mb-8 p-1 bg-muted rounded-xl w-fit">
            <button
              onClick={() => setMode("flashcard")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === "flashcard"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setMode("quiz")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === "quiz"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quiz Mode
            </button>
          </div>
        )}

        {/* Session progress for flashcard mode */}
        {mode === "flashcard" && words.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Card {cardIndex + 1} of {words.length}</span>
              <span>{sessionLearned.length} learned this session</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((cardIndex) / words.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        {words.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📚</p>
            <h2 className="text-xl font-bold text-foreground mb-2">No words yet</h2>
            <p className="text-muted-foreground">
              This level's vocabulary is being prepared. Check back soon!
            </p>
          </div>
        ) : mode === "flashcard" ? (
          <Flashcard
            word={words[cardIndex]}
            onKnow={handleKnow}
            onSkip={handleSkip}
          />
        ) : (
          <QuizMode
            words={words}
            onRecordAttempt={handleQuizAttempt}
          />
        )}

        {/* Learned words list (collapsible) */}
        {mode === "flashcard" && sessionLearned.length > 0 && (
          <div className="mt-10 rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 text-sm">
              Learned this session ({sessionLearned.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {sessionLearned.map((id) => {
                const w = words.find((x) => x._id === id);
                if (!w) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                  >
                    <span className="text-base">{w.chinese}</span>
                    <span className="text-xs opacity-70">{w.english}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
