"use client";

import { useTheme } from "./ThemeProvider";
import { accent, typography } from "@/app/lib/typography";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
      title="Toggle theme"
      className="
        relative
        h-11
        w-11
        shrink-0
        rounded-full
        border
        border-orange-100/30
        cursor-pointer
        bg-surface/80
        backdrop-blur-xl
        shadow-lg
        shadow-black/5
        flex
        items-center
        justify-center
        text-txt
        transition-all
        duration-300
        hover:scale-105
        hover:border-accent
        hover:bg-accent/10
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent
        focus-visible:ring-offset-2
        focus-visible:ring-offset-bg
      "
    >
      {/* Sun */}
      <span
        className={`absolute transition-all duration-300 ease-out ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      >
        <Sun
          size={19}
          strokeWidth={2.2}
          className="text-yellow-400"
        />
      </span>

      {/* Moon */}
      <span
        className={`absolute transition-all duration-300 ease-out ${
          theme === "dark"
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <Moon
          size={18}
          strokeWidth={2.2}
          className="text-slate-500 dark:text-slate-300"
        />
      </span>
    </button>
  );
}
