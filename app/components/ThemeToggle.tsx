"use client";

import { useTheme } from "./ThemeProvider";
import { typography } from "@/app/lib/typography";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-800 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400 ${typography.button}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
