type StreakBadgeProps = {
  streak: number;
  size?: "sm" | "md" | "lg";
};

export function StreakBadge({ streak, size = "md" }: StreakBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-secondary text-secondary-foreground font-bold ${sizeClasses[size]}`}
    >
      <span>🔥</span>
      <span>{streak}</span>
      {size !== "sm" && <span className="font-normal opacity-70">day streak</span>}
    </span>
  );
}
