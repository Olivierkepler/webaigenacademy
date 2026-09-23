"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

  function ForgotPasswordContent() {
    const searchParams = useSearchParams();

    const [email, setEmail] = useState(
        searchParams.get("email") ?? ""
    );
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data: {
        error?: string;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Could not process your request."
        );
        return;
      }

      setMessage(
        data.message ??
          "If an account exists for that email, a reset link has been sent."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center bg-zinc-50 px-6 py-12 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
            WebAIGen Academy
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
            {message}
          </div>
        )}

        {!message && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email address

              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#0E5C58] focus:ring-2 focus:ring-[#0E5C58]/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#0E5C58] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003334] disabled:opacity-60"
            >
              {loading
                ? "Sending reset link..."
                : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="text-sm font-medium text-[#0E5C58] hover:underline dark:text-[#85D7CE]"
          >
            ← Back to sign in
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}