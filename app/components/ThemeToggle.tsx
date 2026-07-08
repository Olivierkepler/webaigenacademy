"use client";

import { useTheme } from "./ThemeProvider";
import { accent, typography } from "@/app/lib/typography";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-800 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-[#FF6F00] dark:hover:text-[#FFB74D] ${accent.hoverBorder} ${accent.hoverText} ${typography.button}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
