const textPrimary = "text-zinc-950 dark:text-zinc-50";
const textSecondary = "text-zinc-600 dark:text-zinc-400";
const textMuted = "text-zinc-500 dark:text-zinc-500";

const headingFont = "font-heading";
const bodyFont = "font-body";

/**
 * Brand colors
 * Professional + understated.
 */
export const accent = {
  text: "text-[#0F766E] dark:text-[#5EEAD4]",

  bg: "bg-[#0F766E]",
  bgDark: "bg-[#0B5F59]",
  bgSubtle: "bg-[#0F766E]/8",

  border: "border-[#0F766E]",
  borderSubtle: "border-[#0F766E]/15",
  borderMedium: "border-[#0F766E]/30",

  hoverBg: "hover:bg-[#0B5F59]",
  hoverBorder: "hover:border-[#0F766E]",
  hoverText: "hover:text-[#0F766E] dark:hover:text-[#5EEAD4]",

  groupHoverText:
    "group-hover:text-[#0F766E] dark:group-hover:text-[#5EEAD4]",

  focusBorder: "focus:border-[#0F766E]",
  focusRing: "focus:ring-[#0F766E]/15",

  progress: "bg-[#0F766E]",

  success: "text-green-700 dark:text-green-400",
  danger: "text-red-700 dark:text-red-400",
} as const;

export const typography = {
  /*
  |--------------------------------------------------------------------------
  | HERO
  |--------------------------------------------------------------------------
  */

  hero: `
    ${headingFont}
    text-[44px]
    lg:text-[68px]
    font-black
    tracking-[-0.04em]
    leading-[0.92]
    ${textPrimary}
  `,

  pageTitle: `
    ${headingFont}
    text-[38px]
    lg:text-[52px]
    font-bold
    tracking-[-0.03em]
    leading-[1.02]
    ${textPrimary}
  `,

  lessonTitle: `
    ${headingFont}
    text-[26px]
    lg:text-[26px]
    font-bold
    tracking-[-0.03em]
    leading-[1.05]
    ${textPrimary}
  `,

  sectionTitle: `
    ${headingFont}
    text-[26px]
    lg:text-[26px]
    font-bold
    tracking-[-0.03em]
    leading-tight
    ${textPrimary}
  `,

  cardTitle: `
    ${headingFont}
    text-[22px]
    lg:text-[24px]
    font-semibold
    tracking-[-0.02em]
    leading-snug
    ${textPrimary}
  `,

  /*
  |--------------------------------------------------------------------------
  | BODY
  |--------------------------------------------------------------------------
  */

  body: `
    ${bodyFont}
    text-[17px]
    leading-8
    font-normal
    ${textSecondary}
  `,

  reading: `
    ${bodyFont}
    text-[18px]
    leading-9
    font-normal
    ${textSecondary}
  `,

  subtitle: `
    ${bodyFont}
    text-[20px]
    leading-8
    font-normal
    ${textSecondary}
  `,

  small: `
    ${bodyFont}
    text-sm
    leading-7
    ${textSecondary}
  `,

  caption: `
    ${bodyFont}
    text-[13px]
    leading-6
    ${textMuted}
  `,

  /*
  |--------------------------------------------------------------------------
  | LABELS
  |--------------------------------------------------------------------------
  */

  label: `
    ${bodyFont}
    text-xs
    font-semibold
    uppercase
    tracking-[0.22em]
    ${accent.text}
  `,

  badge: `
    ${bodyFont}
    text-xs
    font-semibold
    uppercase
    tracking-[0.08em]
    ${textMuted}
  `,

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  navbarBrand: `
    ${headingFont}
    text-[28px]
    lg:text-[30px]
    font-bold
    tracking-tight
    ${textPrimary}
  `,

  navbarSmall: `
    ${bodyFont}
    text-[11px]
    font-semibold
    uppercase
    tracking-[0.22em]
    ${textMuted}
  `,

  /*
  |--------------------------------------------------------------------------
  | SIDEBAR
  |--------------------------------------------------------------------------
  */

  sidebarTitle: `
    ${headingFont}
    text-2xl
    font-bold
    tracking-tight
    ${textPrimary}
  `,

  sidebarSection: `
    ${bodyFont}
    text-base
    font-semibold
    ${textPrimary}
  `,

  sidebarItem: `
    ${bodyFont}
    text-[15px]
    leading-7
    ${textSecondary}
  `,

  /*
  |--------------------------------------------------------------------------
  | BUTTONS
  |--------------------------------------------------------------------------
  */

  button: `
    ${bodyFont}
    text-[15px]
    font-semibold
  `,

  /*
  |--------------------------------------------------------------------------
  | QUIZ
  |--------------------------------------------------------------------------
  */

  quizQuestion: `
    ${bodyFont}
    text-lg
    font-medium
    leading-8
    ${textPrimary}
  `,

  feedbackCorrect: `
    ${bodyFont}
    text-sm
    font-semibold
    ${accent.success}
  `,

  feedbackCorrectQuiz: `
    ${bodyFont}
    text-sm
    font-semibold
    ${accent.success}
  `,

  feedbackWrong: `
    ${bodyFont}
    text-sm
    font-semibold
    ${accent.danger}
  `,

  /*
  |--------------------------------------------------------------------------
  | MODALS
  |--------------------------------------------------------------------------
  */

  modalTitle: `
    ${headingFont}
    text-[28px]
    font-bold
    tracking-tight
    ${textPrimary}
  `,

  /*
  |--------------------------------------------------------------------------
  | CODE
  |--------------------------------------------------------------------------
  */

  code: `font-mono text-sm ${textPrimary}`,
  codeBlock: `font-mono text-sm leading-7 ${textPrimary}`,

  readingStrong: `${bodyFont} font-semibold ${textPrimary}`,

  accentSubtitle: `
    ${bodyFont}
    text-lg
    font-medium
    ${accent.text}
  `,
} as const;

export const primaryButtonClass = `
inline-flex
items-center
justify-center
rounded-full
${accent.bg}
px-7
py-3.5
text-white
shadow-lg
shadow-[#0F766E]/15
transition-all
duration-300
hover:-translate-y-0.5
${accent.hoverBg}
${typography.button}
`;

export const secondaryButtonClass = `
inline-flex
items-center
justify-center
rounded-full
border
border-zinc-300
bg-white
px-7
py-3.5
text-zinc-900
transition-all
duration-300
hover:border-[#0F766E]
hover:bg-zinc-50
dark:border-zinc-700
dark:bg-zinc-950
dark:text-white
dark:hover:border-[#0F766E]
${typography.button}
`;

export const accentBadgeClass = `
rounded-full
border
${accent.borderSubtle}
${accent.bgSubtle}
px-3.5
py-1
${accent.text}
`;

export const cardPadding = "p-8 lg:p-10";

export const sectionStack = "space-y-10";

export const codeFont = "font-mono";