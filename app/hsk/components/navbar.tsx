import { Link, Form } from "react-router";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { useUserProgress } from "../hooks/use-hsk";
import { StreakBadge } from "./streak-badge";

export function LearnNavbar() {
  const { user, isAuthenticated } = useAuth();
  const { config, loading } = useConfigurables();
  const { progress } = useUserProgress();

  const appName = loading ? "learnHSK" : (config?.appName ?? "learnHSK");
  const enableStreaks = config?.enableStreaks !== false;

  const maxStreak = progress.reduce((max, p) => Math.max(max, p.streak || 0), 0);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border"
      style={{ backgroundColor: "var(--navbar-background, #1A1A1A)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt={appName} className="h-7 w-auto" />
          ) : null}
          <span className="text-lg font-bold text-primary-foreground">{appName}</span>
        </Link>

        <div className="flex items-center gap-4">
          {enableStreaks && isAuthenticated && maxStreak > 0 && (
            <StreakBadge streak={maxStreak} size="sm" />
          )}

          <Link
            to="/dashboard"
            className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            Dashboard
          </Link>

          {isAuthenticated ? (
            <Form action="/auth/logout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Logout
              </button>
            </Form>
          ) : (
            <Link
              to="/auth/login"
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
