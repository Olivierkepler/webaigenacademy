"use client";

import { Bell, Menu, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden w-[300px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:flex">
            <Search className="h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search users, courses..."
              className="h-9 w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
          </button>

          <div className="ml-1 h-6 w-px bg-slate-200" />

          <button
            type="button"
            className="ml-1 flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
              BT
            </div>

            <div className="hidden text-left md:block">
              <p className="text-[12px] font-semibold leading-4 text-slate-900">
                Admin
              </p>

              <p className="text-[10px] leading-4 text-slate-500">
                Administrator
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}