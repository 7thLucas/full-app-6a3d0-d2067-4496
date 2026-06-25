import { Link } from "react-router";
import type { UserProgress, LevelStat } from "../hooks/use-hsk";

type LevelCardProps = {
  level: number;
  label: string;
  description: string;
  totalWords: number;
  progress?: UserProgress;
  isActive?: boolean;
};

export function LevelCard({ level, label, description, totalWords, progress, isActive }: LevelCardProps) {
  const learned = progress?.learnedWordIds?.length ?? 0;
  const pct = totalWords > 0 ? Math.round((learned / totalWords) * 100) : 0;

  const levelColors: Record<number, string> = {
    1: "bg-primary",
    2: "bg-secondary",
    3: "#22C55E",
    4: "#3B82F6",
    5: "#A855F7",
    6: "#EC4899",
  };
  const barColor = level <= 2 ? (level === 1 ? "bg-primary" : "bg-secondary") : "bg-primary";

  return (
    <Link
      to={`/learn/${level}`}
      className={`group block rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 ${
        isActive ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Level {level}
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">{label}</h3>
        </div>
        <span className="text-2xl font-black text-primary opacity-20 group-hover:opacity-40 transition-opacity">
          {level}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{learned} / {totalWords} words</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-semibold text-primary group-hover:underline">
          {pct >= 100 ? "Review" : pct > 0 ? "Continue" : "Start"} →
        </span>
      </div>
    </Link>
  );
}
