const textPrimary = "text-zinc-900 dark:text-white";
const textSecondary = "text-zinc-600 dark:text-zinc-400";
const textMuted = "text-zinc-500 dark:text-zinc-400";

export const typography = {
  hero: `text-4xl font-bold tracking-tight leading-tight ${textPrimary} sm:text-5xl`,
  pageTitle: `text-3xl font-bold tracking-tight ${textPrimary} sm:text-4xl`,
  sectionTitle: `text-2xl font-bold tracking-tight ${textPrimary} sm:text-3xl`,
  cardTitle: `text-xl font-semibold tracking-tight ${textPrimary} sm:text-2xl`,
  subtitle: `text-lg font-medium ${textSecondary}`,
  body: `text-base leading-7 ${textSecondary}`,
  reading: `text-[1.15rem] font-normal leading-8 ${textSecondary}`,
  readingStrong: `font-semibold ${textPrimary}`,
  caption: `text-sm leading-6 ${textMuted}`,
  label: `text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-500`,
  button: "text-base font-semibold",
  sidebarTitle: `text-lg font-bold ${textPrimary} sm:text-xl`,
  sidebarItem: `text-[15px] font-medium leading-6 ${textSecondary}`,
  sidebarSection: `text-xs font-semibold uppercase tracking-[0.18em] ${textMuted}`,
  navbarBrand: `text-2xl font-bold tracking-tight ${textPrimary} sm:text-3xl`,
  badge: "text-xs font-medium",
  accentSubtitle: `text-lg font-medium text-emerald-700 dark:text-emerald-400`,
  quizQuestion: `text-base font-medium leading-7 ${textPrimary}`,
  feedbackCorrect: "text-base font-semibold text-emerald-700 dark:text-emerald-400",
  feedbackWrong: "text-base font-semibold text-red-700 dark:text-red-400",
  code: `font-mono text-sm leading-6 ${textPrimary}`,
  codeBlock: `font-mono text-sm leading-7 ${textPrimary}`,
  modalTitle: `text-base font-semibold ${textPrimary}`,
} as const;

export const cardPadding = "p-8 lg:p-10";

export const sectionStack = "space-y-8";

export const codeFont = "font-mono";
