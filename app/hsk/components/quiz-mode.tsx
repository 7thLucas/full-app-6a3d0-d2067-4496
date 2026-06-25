import { useState, useCallback, useEffect } from "react";
import type { HskWord } from "../hooks/use-hsk";
import { useConfigurables } from "~/modules/configurables";

type QuizModeProps = {
  words: HskWord[];
  onComplete?: (correct: number, total: number) => void;
  onRecordAttempt?: (correct: boolean) => void;
};

type QuizQuestion = {
  word: HskWord;
  options: string[];
  correctIndex: number;
};

function buildQuestions(words: HskWord[], optionsCount: number): QuizQuestion[] {
  if (words.length < optionsCount) return [];
  return words.map((word) => {
    const distractors = words
      .filter((w) => w._id !== word._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, optionsCount - 1)
      .map((w) => w.english);
    const options = [...distractors, word.english].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(word.english);
    return { word, options, correctIndex };
  });
}

export function QuizMode({ words, onComplete, onRecordAttempt }: QuizModeProps) {
  const { config } = useConfigurables();
  const optionsCount = config?.quizOptionsCount ?? 4;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const qs = buildQuestions(words.slice(0, 10), Math.min(optionsCount, words.length));
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [words, optionsCount]);

  const current = questions[currentIdx];

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === current.correctIndex;
    if (correct) setScore((s) => s + 1);
    onRecordAttempt?.(correct);
    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        setDone(true);
        onComplete?.(score + (correct ? 1 : 0), questions.length);
      } else {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
      }
    }, 1000);
  }, [selected, current, currentIdx, questions, score, onComplete, onRecordAttempt]);

  const handleRestart = () => {
    const qs = buildQuestions(words.slice(0, 10), Math.min(optionsCount, words.length));
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (!questions.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Need at least {optionsCount} words to start quiz mode.
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-6xl">{pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📖"}</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
          <p className="text-muted-foreground mt-1">
            {score} / {questions.length} correct — {pct}%
          </p>
        </div>
        <div className="w-48 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct >= 70 ? "bg-primary" : "bg-destructive"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <button
          onClick={handleRestart}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span className="font-semibold text-foreground">{score} correct</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      {current && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">What does this mean?</p>
          <p className="text-5xl font-bold text-foreground mb-2">{current.word.chinese}</p>
          <p className="text-lg text-muted-foreground">{current.word.pinyin}</p>
        </div>
      )}

      {/* Options */}
      {current && (
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt, idx) => {
            let cls = "w-full text-left py-4 px-5 rounded-xl border transition-all font-medium text-sm ";
            if (selected === null) {
              cls += "border-border bg-card text-foreground hover:border-primary hover:bg-primary/5 cursor-pointer";
            } else if (idx === current.correctIndex) {
              cls += "border-green-500 bg-green-50 text-green-800";
            } else if (selected === idx) {
              cls += "border-destructive bg-destructive/10 text-destructive";
            } else {
              cls += "border-border bg-muted text-muted-foreground opacity-60";
            }
            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={selected !== null}>
                <span className="inline-block w-6 h-6 rounded-full border border-current mr-3 text-center leading-5 text-xs font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
