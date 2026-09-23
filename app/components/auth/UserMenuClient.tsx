"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type UserMenuClientProps = {
  name: string | null;
  email: string | null;
  image: string | null;
  role?: "admin" | "learner";
  signOutAction: () => Promise<void>;
};

export default function UserMenuClient({
  name,
  email,
  image,
  role,
  signOutAction,
}: UserMenuClientProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={name ? `Account menu for ${name}` : "Account menu"}
        className="flex cursor-pointer items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0E5C58] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
      >
        {image ? (
          <img
            src={image}
            alt=""
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {initial}
          </span>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <div className="min-w-0 flex-1">
              {name ? (
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {name}
                </p>
              ) : null}
              {email ? (
                <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {email}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close account menu"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-[#0E5C58] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-[#85D7CE]"
          >
            Dashboard
          </Link>

          {role === "admin" ? (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-[#0E5C58] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-[#85D7CE]"
            >
              Admin
            </Link>
          ) : null}

          <form
            action={signOutAction}
            onSubmit={() => setOpen(false)}
          >
            <button
              type="submit"
              role="menuitem"
              className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-[#0E5C58] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-[#85D7CE]"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
