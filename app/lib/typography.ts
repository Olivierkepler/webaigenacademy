const textPrimary = "text-zinc-900 dark:text-white";
const textSecondary = "text-zinc-600 dark:text-zinc-400";
const textMuted = "text-zinc-500 dark:text-zinc-400";

const headingFont = "font-heading";
const bodyFont = "font-body";

/** TensorFlow-inspired orange accent (not copied from TensorFlow CSS). */
export const accent = {
  text: "text-[#FF6F00] dark:text-[#FFB74D]",
  bg: "bg-[#FF6F00]",
  bgSubtle: "bg-[#FF6F00]/10",
  bgQuiz: "bg-green-100 dark:bg-green-900",
  borderQuiz: "border-green-300 dark:border-green-700",
  border: "border-[#FF6F00]",
  borderSubtle: "border-[#FF6F00]/30",
  borderMedium: "border-[#FF6F00]/50",
  hoverBg: "hover:bg-[#e65f00]",
  hoverBorder: "hover:border-[#FF6F00]",
  hoverText: "hover:text-[#FF6F00] dark:hover:text-[#FFB74D]",
  groupHoverText: "group-hover:text-[#FF6F00] dark:group-hover:text-[#FFB74D]",
  focusBorder: "focus:border-[#FF6F00]",
  focusRing: "focus:ring-[#FF6F00]/20",
  progress: "bg-[#FFE0B2]",
} as const;

export const typography = {
  hero: `${headingFont} text-[40px] font-medium leading-[1.12] tracking-tight ${textPrimary} lg:text-5xl`,
  pageTitle: `${headingFont} text-[32px] font-medium leading-[1.2] ${textPrimary} lg:text-[40px] lg:font-medium`,
  lessonTitle: `${headingFont} text-[32px] font-medium leading-[1.2] ${textPrimary} lg:text-[40px] lg:font-medium`,
  sectionTitle: `${headingFont} text-2xl font-medium leading-[1.25] ${textPrimary} lg:text-[28px]`,
  cardTitle: `${headingFont} text-xl font-medium leading-[1.3] ${textPrimary} lg:text-[22px]`,
  body: `${bodyFont} text-base font-normal leading-[1.6] ${textSecondary}`,
  reading: `${bodyFont} text-base font-normal leading-[1.75] ${textSecondary}`,
  small: `${bodyFont} text-sm font-normal leading-6 ${textSecondary}`,
  caption: `${bodyFont} text-xs leading-5 ${textMuted}`,
  label: `${bodyFont} text-xs font-medium uppercase tracking-[0.12em] ${accent.text}`,
  button: `${bodyFont} text-sm font-medium lg:text-base`,
  navbarBrand: `${bodyFont} text-2xl font-medium leading-[1.2] ${textPrimary} lg:text-3xl`,
  navbarSmall: `${bodyFont} text-xs font-medium uppercase tracking-[0.12em] ${accent.text}`,
  sidebarTitle: `${bodyFont} text-lg font-medium leading-[1.3] ${textPrimary} lg:text-xl`,
  sidebarSection: `${bodyFont} text-sm font-medium leading-5 ${textPrimary}`,
  sidebarItem: `${bodyFont} text-sm font-normal leading-5 ${textSecondary}`,
  code: `font-mono text-sm leading-6 ${textPrimary}`,

  // Shared aliases used across lessons, quizzes, and demos
  subtitle: `${bodyFont} text-lg font-normal leading-[1.6] ${textSecondary} lg:text-xl`,
  readingStrong: `${bodyFont} font-medium ${textPrimary}`,
  accentSubtitle: `${bodyFont} text-lg font-medium leading-[1.6] ${accent.text}`,
  badge: `${bodyFont} text-xs font-medium leading-5 ${textMuted}`,
  quizQuestion: `${bodyFont} text-base font-medium leading-[1.6] ${textPrimary}`,
  feedbackCorrect: `${bodyFont} text-sm font-medium leading-6 ${accent.text} lg:text-base`,
 feedbackCorrectQuiz: `${bodyFont} text-sm font-medium leading-6 text-green-700 dark:text-green-400 lg:text-base`,
  feedbackWrong: `${bodyFont} text-sm font-medium leading-6 text-red-700 dark:text-red-400 lg:text-base`,
  modalTitle: `${headingFont} text-xl font-medium leading-[1.3] ${textPrimary} lg:text-[22px]`,
  codeBlock: `font-mono text-sm leading-7 ${textPrimary}`,
} as const;

export const primaryButtonClass = `inline-flex items-center justify-center rounded-lg ${accent.bg} px-6 py-3 text-white shadow-sm transition ${accent.hoverBg} ${typography.button}`;

export const secondaryButtonClass = `inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 text-zinc-800 transition ${accent.hoverBorder} ${accent.hoverText} dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-[#FF6F00] dark:hover:text-[#FFB74D] ${typography.button}`;

export const accentBadgeClass = `rounded-full border ${accent.borderSubtle} ${accent.bgSubtle} px-3 py-1 ${accent.text}`;

export const cardPadding = "p-8 lg:p-10";

export const sectionStack = "space-y-8";

export const codeFont = "font-mono";
