import { useState, useCallback } from "react";
import type { HskWord } from "../hooks/use-hsk";
import { useConfigurables } from "~/modules/configurables";

type FlashcardProps = {
  word: HskWord;
  onKnow?: () => void;
  onSkip?: () => void;
  showControls?: boolean;
};

export function Flashcard({ word, onKnow, onSkip, showControls = true }: FlashcardProps) {
  const { config } = useConfigurables();
  const [flipped, setFlipped] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const enableAudio = config?.enableAudio !== false;

  const handleAudio = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!enableAudio || speaking) return;
    setSpeaking(true);
    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(word.chinese);
        utterance.lang = "zh-CN";
        utterance.rate = 0.8;
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeaking(false);
      }
    } catch {
      setSpeaking(false);
    }
  }, [word.chinese, enableAudio, speaking]);

  const handleFlip = () => setFlipped((f) => !f);

  const handleKnow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(false);
    onKnow?.();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(false);
    onSkip?.();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
      {/* Card flip container */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
        aria-label="Click to flip flashcard"
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "260px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl border border-border bg-card shadow-lg flex flex-col items-center justify-center gap-3 p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {config?.flashcardFrontLabel ?? "Chinese + Pinyin"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-6xl font-bold text-foreground leading-none">
                {word.chinese}
              </span>
              {enableAudio && (
                <button
                  onClick={handleAudio}
                  disabled={speaking}
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                  aria-label="Play pronunciation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {speaking ? (
                      <path d="M10 8v8l-5-4 5-4zm4-2a1 1 0 011 1v10a1 1 0 01-2 0V7a1 1 0 011-1zm4 2a1 1 0 011 1v6a1 1 0 01-2 0V9a1 1 0 011-1z" />
                    ) : (
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    )}
                  </svg>
                </button>
              )}
            </div>
            <span className="text-xl text-muted-foreground font-medium">{word.pinyin}</span>
            <span className="text-xs text-muted-foreground mt-4">Tap to reveal meaning</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-border bg-card shadow-lg flex flex-col items-center justify-center gap-4 p-8"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {config?.flashcardBackLabel ?? "English + Example"}
            </span>
            <span className="text-3xl font-bold text-foreground text-center">{word.english}</span>
            {word.exampleSentence && (
              <div className="mt-2 text-center space-y-1 border-t border-border pt-4 w-full">
                <p className="text-base text-foreground font-medium">{word.exampleSentence}</p>
                {word.examplePinyin && (
                  <p className="text-sm text-muted-foreground">{word.examplePinyin}</p>
                )}
                {word.exampleEnglish && (
                  <p className="text-sm text-muted-foreground italic">{word.exampleEnglish}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors font-semibold text-sm"
          >
            Skip
          </button>
          <button
            onClick={handleKnow}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-sm"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
}
