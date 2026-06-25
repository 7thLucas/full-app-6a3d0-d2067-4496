import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { LearnNavbar } from "~/hsk/components/navbar";
import { LevelCard } from "~/hsk/components/level-card";
import { StreakBadge } from "~/hsk/components/streak-badge";
import { useUserProgress, useLevelStats } from "~/hsk/hooks/use-hsk";
import { Link } from "react-router";

export default function DashboardPage() {
  const { config, loading } = useConfigurables();
  const { user, isAuthenticated } = useAuth();
  const { progress } = useUserProgress();
  const { stats } = useLevelStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hskLevels = config?.hskLevels ?? [];
  const enableStreaks = config?.enableStreaks !== false;
  const dailyGoal = config?.dailyGoalWords ?? 20;
  const appName = config?.appName ?? "learnHSK";
  const motivationImageUrl = config?.dashboardMotivationImageUrl ?? "";
  const motivationQuote = config?.dashboardMotivationQuote ?? "";

  const maxStreak = progress.reduce((max, p) => Math.max(max, p.streak || 0), 0);
  const totalLearned = progress.reduce((sum, p) => sum + (p.learnedWordIds?.length ?? 0), 0);
  const totalWords = stats.reduce((sum, s) => sum + s.total, 0);

  // Calculate today's words (approximate via today's streak check)
  const today = new Date().toISOString().split("T")[0];
  const studiedToday = progress.filter((p) => p.lastStudiedAt === today);
  const todayWords = studiedToday.reduce((sum, p) => sum + Math.min(p.totalAttempted ?? 0, dailyGoal), 0);
  const goalPct = Math.min(100, Math.round((todayWords / dailyGoal) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LearnNavbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {isAuthenticated ? `Welcome back, ${user?.username ?? "Learner"}!` : `Welcome to ${appName}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAuthenticated ? "Pick a level and keep studying." : "Log in to track your progress across all HSK levels."}
          </p>
        </div>

        {/* Stats row */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Streak */}
            {enableStreaks && (
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Streak</p>
                <StreakBadge streak={maxStreak} size="lg" />
              </div>
            )}

            {/* Total learned */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Words Learned</p>
              <p className="text-3xl font-black text-foreground">
                {totalLearned}
                <span className="text-base font-normal text-muted-foreground ml-1">/ {totalWords}</span>
              </p>
            </div>

            {/* Daily goal */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Daily Goal</p>
                <span className="text-xs text-muted-foreground">{goalPct}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{todayWords} / {dailyGoal} words today</p>
            </div>
          </div>
        )}

        {/* Motivation Banner */}
        {motivationImageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
            <div className="relative">
              <img
                src={motivationImageUrl}
                alt="Motivation"
                className="w-full object-cover max-h-[280px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
              {motivationQuote && (
                <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
                  <p className="text-foreground font-semibold text-base leading-snug drop-shadow-sm">
                    {motivationQuote}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HSK Level grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Choose Your Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hskLevels.map((lvl, i) => {
              const levelNum = i + 1;
              const levelProgress = progress.find((p) => p.hskLevel === levelNum);
              const stat = stats.find((s) => s.level === levelNum);
              return (
                <LevelCard
                  key={levelNum}
                  level={levelNum}
                  label={lvl.level}
                  description={lvl.description}
                  totalWords={stat?.total ?? lvl.wordCount}
                  progress={levelProgress}
                />
              );
            })}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center mt-8">
            <p className="text-foreground font-semibold mb-2">Log in to track your progress</p>
            <p className="text-muted-foreground text-sm mb-4">Save your streak, see learned words, and unlock quiz mode.</p>
            <div className="flex justify-center gap-3">
              <Link to="/auth/login" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Log In
              </Link>
              <Link to="/auth/register" className="px-5 py-2 rounded-lg border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
