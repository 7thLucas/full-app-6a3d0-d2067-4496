/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type THskLevel = {
  level: string;
  description: string;
  wordCount: number;
};

export type TFeatureItem = {
  title: string;
  description: string;
  icon: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  appTagline?: string;
  appDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCTA?: string;
  dailyGoalWords?: number;
  enableStreaks?: boolean;
  enableAudio?: boolean;
  enableQuizMode?: boolean;
  quizOptionsCount?: number;
  flashcardFrontLabel?: string;
  flashcardBackLabel?: string;
  hskLevels?: THskLevel[];
  features?: TFeatureItem[];
  footerTagline?: string;
  dashboardMotivationImageUrl?: string;
  dashboardMotivationQuote?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "learnHSK",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#FAFAFA",
    foreground:        "#1A1A1A",
    // Card
    card:              "#FFFFFF",
    cardForeground:    "#1A1A1A",
    // Popover
    popover:           "#FFFFFF",
    popoverForeground: "#1A1A1A",
    // Primary
    primary:           "#D93025",
    primaryForeground: "#FFFFFF",
    // Secondary
    secondary:           "#F5A623",
    secondaryForeground: "#1A1A1A",
    // Muted
    muted:           "#F3F4F6",
    mutedForeground: "#6B7280",
    // Accent
    accent:           "#FEF3C7",
    accentForeground: "#92400E",
    // Destructive
    destructive:           "#EF4444",
    destructiveForeground: "#FFFFFF",
    // Border / Input / Ring
    border: "#E5E7EB",
    input:  "#E5E7EB",
    ring:   "#D93025",
    // Charts
    chart1: "#D93025",
    chart2: "#F5A623",
    chart3: "#22C55E",
    chart4: "#3B82F6",
    chart5: "#A855F7",
    // Navbar
    navbarBackground: "#1A1A1A",
    // Sidebar
    sidebarBackground:        "#111111",
    sidebarForeground:        "#F9FAFB",
    sidebarPrimary:           "#D93025",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent:            "#F5A623",
    sidebarAccentForeground:  "#1A1A1A",
    sidebarBorder:            "#2D2D2D",
    sidebarRing:              "#D93025",
  },
  font: {
    headingFont: "Poppins",
    textFont: "Nunito",
  },
  appTagline: "Master Mandarin, One Card at a Time",
  appDescription: "A gamified HSK learning app with flashcards, audio, streaks and quizzes for all levels.",
  heroTitle: "Learn Mandarin the Fun Way",
  heroSubtitle: "Study HSK vocabulary with interactive flashcards, track your daily streak, and level up from HSK 1 to HSK 6+.",
  heroCTA: "Start Learning Free",
  dailyGoalWords: 20,
  enableStreaks: true,
  enableAudio: true,
  enableQuizMode: true,
  quizOptionsCount: 4,
  flashcardFrontLabel: "Chinese + Pinyin",
  flashcardBackLabel: "English + Example",
  hskLevels: [
    { level: "HSK 1", description: "150 basic words — greetings, numbers, basic phrases", wordCount: 150 },
    { level: "HSK 2", description: "300 words — daily conversations and simple sentences", wordCount: 300 },
    { level: "HSK 3", description: "600 words — intermediate communication", wordCount: 600 },
    { level: "HSK 4", description: "1200 words — fluent everyday topics", wordCount: 1200 },
    { level: "HSK 5", description: "2500 words — reading newspapers and films", wordCount: 2500 },
    { level: "HSK 6+", description: "5000+ words — near-native proficiency", wordCount: 5000 },
  ],
  features: [
    { title: "Flashcard Study", description: "Flip cards with character, pinyin, meaning and audio on every card.", icon: "🃏" },
    { title: "Daily Streaks", description: "Build a habit with a daily streak counter that keeps you motivated.", icon: "🔥" },
    { title: "Quiz Mode", description: "Test yourself with multiple-choice quizzes after every study session.", icon: "🎯" },
    { title: "Audio Pronunciation", description: "Hear native pronunciation for every word with built-in TTS audio.", icon: "🔊" },
    { title: "Progress Tracking", description: "See how many words you've mastered per HSK level at a glance.", icon: "📊" },
    { title: "All HSK Levels", description: "Covers HSK 1 through HSK 6+ — from beginner to near-native.", icon: "🎓" },
  ],
  footerTagline: "learnHSK — Built for learners, powered by persistence.",
  dashboardMotivationImageUrl: "https://client-api-stag.quantumbyte.ai/uploads/gpe8hhcl/4496/assets/95c77a31-e42a-4a36-bc76-fe3ccff47397_1782410355397_lvjic4.png",
  dashboardMotivationQuote: "每天学一点，坚持就是胜利。 — Every day a little more, persistence is victory.",
};
