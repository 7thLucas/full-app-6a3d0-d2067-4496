import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { LearnNavbar } from "~/hsk/components/navbar";
import { useLevelStats } from "~/hsk/hooks/use-hsk";

export default function LandingPage() {
  const { config, loading } = useConfigurables();
  const { stats } = useLevelStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const appName = config?.appName ?? "learnHSK";
  const heroTitle = config?.heroTitle ?? "Learn Mandarin the Fun Way";
  const heroSubtitle = config?.heroSubtitle ?? "Study HSK vocabulary with interactive flashcards, track your daily streak, and level up from HSK 1 to HSK 6+.";
  const heroCTA = config?.heroCTA ?? "Start Learning Free";
  const appTagline = config?.appTagline ?? "Master Mandarin, One Card at a Time";
  const features = config?.features ?? [];
  const hskLevels = config?.hskLevels ?? [];
  const footerTagline = config?.footerTagline ?? `${appName} — Built for learners, powered by persistence.`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LearnNavbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
          {appTagline}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground max-w-3xl leading-tight">
          {heroTitle}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            {heroCTA}
          </Link>
          <Link
            to="/auth/login"
            className="px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold text-lg hover:bg-muted transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* HSK Levels preview */}
      {hskLevels.length > 0 && (
        <section className="py-16 px-6 bg-muted/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground">All HSK Levels Covered</h2>
              <p className="text-muted-foreground mt-2">From complete beginner to near-native fluency</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hskLevels.map((lvl, i) => {
                const stat = stats.find((s) => s.level === i + 1);
                return (
                  <Link
                    key={i}
                    to={`/learn/${i + 1}`}
                    className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-primary opacity-30 group-hover:opacity-60 transition-opacity">
                        {i + 1}
                      </span>
                      <span className="font-bold text-foreground">{lvl.level}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{lvl.description}</p>
                    {stat && (
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {stat.total > 0 ? stat.total : lvl.wordCount} words
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground">Why learnHSK?</h2>
              <p className="text-muted-foreground mt-2">Everything you need to master Mandarin vocabulary</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="py-16 px-6 bg-primary text-primary-foreground text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to start learning?</h2>
        <p className="text-primary-foreground/80 mb-6 text-lg">Join thousands of learners mastering Mandarin with {appName}</p>
        <Link
          to="/auth/register"
          className="inline-block px-8 py-4 rounded-xl bg-primary-foreground text-primary font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>{footerTagline}</p>
      </footer>
    </div>
  );
}
