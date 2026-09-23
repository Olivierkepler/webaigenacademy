"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

const inputClass =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#0E5C58] focus:ring-2 focus:ring-[#0E5C58]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

export default function ResetPasswordPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Unable to reset password.");
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(
        data.message ?? "Your password has been reset successfully."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#0E5C58] dark:text-[#85D7CE]">
          WEBAIGEN ACADEMY
        </p>

        <h1 className="mt-4 text-2xl font-semibold">
          Create a new password
        </h1>

        <p className="mt-2 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
          Enter a new password for your WebAIgen Academy account.
        </p>
      </div>

      {!token ? (
        <div className="mt-7">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            This password reset link is invalid.
          </div>

          <Link
            href="/forgot-password"
            className="mt-6 block text-center text-sm font-medium text-[#0E5C58] hover:underline dark:text-[#85D7CE]"
          >
            Request a new reset link
          </Link>
        </div>
      ) : success ? (
        <div className="mt-7">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {success}
          </div>

          <Link
            href="/signin"
            className="mt-6 block w-full rounded-xl bg-[#0E5C58] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0B4B48]"
          >
            Sign in with new password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            New password

            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              placeholder="At least 8 characters"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Confirm new password

            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClass}
              placeholder="Enter password again"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0E5C58] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </button>

          <Link
            href="/signin"
            className="block text-center text-sm font-medium text-[#0E5C58] hover:underline dark:text-[#85D7CE]"
          >
            ← Back to sign in
          </Link>
        </form>
      )}
    </section>
  );
}