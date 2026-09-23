"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

type Mode = "signin" | "signup";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-[14px] text-zinc-950 outline-none transition duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[#0E5C58] focus:ring-4 focus:ring-[#0E5C58]/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:hover:border-zinc-600";

const signupInputClass =
  "w-full rounded-xl border border-zinc-200 bg-white py-2 pl-11 pr-4 text-[14px] text-zinc-950 outline-none transition duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[#0E5C58] focus:ring-4 focus:ring-[#0E5C58]/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600";

export default function SignInPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode: Mode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  async function handleCredentialsSignIn(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
  
    setError("");
    setLoading(true);
  
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  
    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password.");
      return;
    }
  
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data: { error?: string } = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? "Could not create account.");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created, but sign-in failed. Try signing in.");
      setMode("signin");
      return;
    }

    router.push("/dashboard?welcome=1");
    router.refresh();
  }

  function switchToSignUp() {
    setMode("signup");
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  function switchToSignIn() {
    setMode("signin");
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div
      className={`
        min-w-0 w-full max-w-[450px]
        rounded-[20px] sm:rounded-[24px]
        border border-zinc-200/80
        bg-white/95
        shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)]
        backdrop-blur-xl
        dark:border-zinc-800
        dark:bg-zinc-900/95
        ${
          mode === "signup"
            ? "px-4 py-3.5 sm:px-6"
            : "p-4 sm:p-7"
        }
      `}
    >
      {/* Header */}
      <div>
        <div
          className={`flex items-center gap-2 ${
            mode === "signup" ? "mb-1.5" : "mb-2"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#0E5C58]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            WebAIgen Academy
          </span>
        </div>

        <h2
          className={`font-semibold leading-tight tracking-[-0.03em] text-zinc-950 dark:text-white ${
            mode === "signup" ? "text-[25px]" : "text-[27px]"
          }`}
        >
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h2>

        <p
          className={`text-zinc-500 dark:text-zinc-400 ${
            mode === "signup"
              ? "mt-1 text-[13px] leading-5"
              : "mt-2 text-[14px] leading-6"
          }`}
        >
          {mode === "signin"
            ? "Sign in to continue your learning journey."
            : "Create your account and start learning."}
        </p>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`
          ${mode === "signup" ? "mt-2.5" : "mt-6"}
          inline-flex w-full items-center justify-center gap-3
          rounded-xl border border-zinc-200
          bg-white px-4
          ${mode === "signup" ? "py-2" : "py-2.5"}
          text-[14px] font-semibold text-zinc-800
          transition duration-200
          hover:border-zinc-300 hover:bg-zinc-50
          focus:outline-none focus:ring-4 focus:ring-[#0E5C58]/10
          active:scale-[0.995]
          disabled:cursor-not-allowed disabled:opacity-60
          dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100
        `}
      >
        <GoogleIcon />
        {loading ? "Please wait..." : "Continue with Google"}
      </button>

      {/* Divider */}
      <div
        className={`flex items-center gap-4 ${
          mode === "signup" ? "my-2" : "my-5"
        }`}
      >
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          or
        </span>

        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Error */}
      {error ? (
        <div
          role="alert"
          className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm leading-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <ErrorIcon />
          <span>{error}</span>
        </div>
      ) : null}

      {/* SIGN IN */}
      {mode === "signin" ? (
        <form onSubmit={handleCredentialsSignIn}>
          {/* Email */}
          <div>
            <label
              htmlFor="signin-email"
              className="mb-2 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400">
                <EmailIcon />
              </div>

              <input
                id="signin-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="signin-password"
                className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>

              <Link
                href={
                  email
                    ? `/forgot-password?email=${encodeURIComponent(email)}`
                    : "/forgot-password"
                }
                className="text-[13px] font-semibold text-[#0E5C58] transition hover:text-[#074844] hover:underline dark:text-[#85D7CE]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400">
                <LockIcon />
              </div>

              <input
                id="signin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-5 inline-flex w-full items-center justify-center gap-2
              rounded-xl bg-[#0E5C58]
              px-4 py-3
              text-sm font-semibold text-white
              shadow-[0_8px_22px_-10px_rgba(14,92,88,0.65)]
              transition duration-200
              hover:bg-[#084A47]
              hover:shadow-[0_10px_28px_-10px_rgba(14,92,88,0.75)]
              focus:outline-none focus:ring-4 focus:ring-[#0E5C58]/15
              active:scale-[0.995]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowIcon />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={switchToSignUp}
              className="font-semibold text-[#0E5C58] transition hover:text-[#074844] hover:underline dark:text-[#85D7CE]"
            >
              Create one
            </button>
          </p>
        </form>
      ) : (
        /* SIGN UP */
        <form onSubmit={handleSignUp}>
          {/* Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="mb-1 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Name
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400">
                <UserIcon />
              </div>

              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={signupInputClass}
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-1.5">
            <label
              htmlFor="signup-email"
              className="mb-1 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400">
                <EmailIcon />
              </div>

              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={signupInputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-1.5">
            <label
              htmlFor="signup-password"
              className="mb-1 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400">
                <LockIcon />
              </div>

              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={signupInputClass}
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mt-1.5">
            <label
              htmlFor="signup-confirm-password"
              className="mb-1 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Confirm password
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400">
                <LockIcon />
              </div>

              <input
                id="signup-confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={signupInputClass}
                placeholder="Enter your password again"
              />
            </div>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-2 inline-flex w-full items-center justify-center gap-2
              rounded-xl bg-[#0E5C58]
              px-4 py-2
              text-[14px] font-semibold text-white
              shadow-[0_8px_20px_-10px_rgba(14,92,88,0.70)]
              transition duration-200
              hover:bg-[#084A47]
              hover:shadow-[0_10px_24px_-10px_rgba(14,92,88,0.75)]
              focus:outline-none focus:ring-4 focus:ring-[#0E5C58]/15
              active:scale-[0.995]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Spinner />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowIcon />
              </>
            )}
          </button>

          <p className="mt-[18px] text-center text-[12px] leading-4 text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToSignIn}
              className="font-semibold text-[#0E5C58] transition hover:text-[#074844] hover:underline dark:text-[#85D7CE]"
            >
              Sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.55l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.95 14.7 2 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 7 8 6 8-6"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10V7a4 4 0 0 1 8 0v3"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 20c.8-4 3.4-6 7.5-6s6.7 2 7.5 6"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M14 7l5 5-5 5"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-0.5 h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8v5" />
      <circle cx="12" cy="16.5" r=".6" fill="currentColor" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        className="opacity-90"
        fill="currentColor"
        d="M21 12a9 9 0 0 0-9-9v3a6 6 0 0 1 6 6h3Z"
      />
    </svg>
  );
}