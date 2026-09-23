import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import SignInPanel from "./SignInPanel";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  let session = null;

  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main
      className="
        relative
        min-h-[calc(100dvh-var(--navbar-height))]
        overflow-x-hidden
        bg-[#F8FBFB]
        dark:bg-zinc-950

        lg:h-[calc(100vh-var(--navbar-height))]
        lg:min-h-0
        lg:overflow-hidden
      "
    >
      {/* Top-right background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-40 -top-40
          h-[560px] w-[560px]
          rounded-full
          bg-[#BFE9E4]/35
          blur-[110px]
          dark:bg-[#0E5C58]/10
        "
      />

      {/* Bottom-left background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-52 -left-52
          h-[520px] w-[520px]
          rounded-full
          bg-[#DDF3F0]/50
          blur-[120px]
          dark:bg-[#0E5C58]/10
        "
      />

      {/* Decorative dots */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-[4%] top-[12%]
          hidden grid-cols-4 gap-3
          opacity-40
          xl:grid
        "
      >
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-[#0E5C58]/35"
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className="
          relative z-10
          mx-auto grid
          min-w-0
          w-full max-w-[1280px]
          grid-cols-1
          items-start
          gap-10

          px-3 py-3 pb-8
          sm:px-6
          sm:py-4
          sm:pb-8

          lg:h-full
          lg:min-h-0
          lg:grid-cols-[minmax(0,1fr)_450px]
          lg:items-start
          lg:gap-16
          lg:px-12
          lg:py-4

          xl:gap-20
          xl:px-16
        "
      >
        {/* LEFT SIDE */}
        <section className="hidden lg:block">
          <div className="w-full max-w-[610px]">
            {/* Badge */}
            <div
              className="
                mb-6 inline-flex
                items-center gap-2.5
                rounded-full
                border border-[#0E5C58]/15
                bg-[#0E5C58]/[0.055]
                px-4 py-2
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#0E5C58]" />

              <span
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#0E5C58]
                  dark:text-[#85D7CE]
                "
              >
                AI &amp; Machine Learning Education
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                max-w-[640px]
                text-[44px]
                font-semibold
                leading-[1.08]
                tracking-[-0.04em]
                text-zinc-950
                dark:text-white
                xl:text-[52px]
              "
            >
              Learn AI.
              <br />
              Build real systems.
              <br />
              <span className="text-[#0E5C58] dark:text-[#85D7CE]">
                Advance your career.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-[590px]
                text-[16px]
                leading-7
                text-zinc-600
                dark:text-zinc-400
              "
            >
              Develop practical AI and machine learning skills through
              structured lessons, hands-on projects, and industry-focused
              learning.
            </p>

            {/* Features */}
            <div
              className="
                mt-5
                grid
                max-w-[610px]
                grid-cols-3
                gap-6
                border-t
                border-zinc-200/80
                pt-5
                dark:border-zinc-800
              "
            >
              {/* Structured */}
              <div>
                <div
                  className="
                    mb-4
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-[#0E5C58]/10
                    bg-[#EAF6F4]
                    text-[#0E5C58]
                    dark:border-[#85D7CE]/10
                    dark:bg-[#0E5C58]/15
                    dark:text-[#85D7CE]
                  "
                >
                  <BookIcon />
                </div>

                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Structured
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Guided learning paths
                </p>
              </div>

              {/* Practical */}
              <div>
                <div
                  className="
                    mb-4
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-[#0E5C58]/10
                    bg-[#EAF6F4]
                    text-[#0E5C58]
                    dark:border-[#85D7CE]/10
                    dark:bg-[#0E5C58]/15
                    dark:text-[#85D7CE]
                  "
                >
                  <CodeIcon />
                </div>

                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Practical
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Real-world projects
                </p>
              </div>

              {/* Career */}
              <div>
                <div
                  className="
                    mb-4
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-[#0E5C58]/10
                    bg-[#EAF6F4]
                    text-[#0E5C58]
                    dark:border-[#85D7CE]/10
                    dark:bg-[#0E5C58]/15
                    dark:text-[#85D7CE]
                  "
                >
                  <ChartIcon />
                </div>

                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Career-focused
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Industry-ready skills
                </p>
              </div>
            </div>

            {/* Quote */}
            <div
              className="
                mt-4
                max-w-[610px]
                rounded-2xl
                border border-[#0E5C58]/10
                bg-white/55
                px-5 py-3
                backdrop-blur-sm
                dark:border-zinc-800
                dark:bg-zinc-900/40
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-[#EAF6F4]
                    text-[#0E5C58]
                    dark:bg-[#0E5C58]/20
                    dark:text-[#85D7CE]
                  "
                >
                  <QuoteIcon />
                </div>

                <div>
                  <p className="text-sm italic leading-6 text-zinc-700 dark:text-zinc-300">
                    &ldquo;Turning curiosity into real-world skills.&rdquo;
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                    WebAIgen Academy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-panel-position flex min-w-0 w-full justify-center lg:justify-end">
          <Suspense
            fallback={
              <div
                className="
                  h-[610px]
                  w-full
                  max-w-[450px]
                  animate-pulse
                  rounded-[24px]
                  border border-zinc-200/80
                  bg-white/80
                  shadow-sm
                  dark:border-zinc-800
                  dark:bg-zinc-900
                "
              />
            }
          >
            <SignInPanel />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 5.75A2.75 2.75 0 0 1 7.25 3H11v16H7.25A2.75 2.75 0 0 0 4.5 21.75v-16Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 5.75A2.75 2.75 0 0 0 16.75 3H13v16h3.75a2.75 2.75 0 0 1 2.75 2.75v-16Z"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4l-3 16"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 20V11M12 20V4M19 20v-7"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7.4 6C4.4 7.5 3 9.8 3 13.1 3 16.2 4.6 18 7 18c2 0 3.5-1.5 3.5-3.5S9 11 7 11c-.4 0-.8.1-1.1.2.3-1.4 1.2-2.6 2.7-3.5L7.4 6Zm9 0C13.4 7.5 12 9.8 12 13.1c0 3.1 1.6 4.9 4 4.9 2 0 3.5-1.5 3.5-3.5S18 11 16 11c-.4 0-.8.1-1.1.2.3-1.4 1.2-2.6 2.7-3.5L16.4 6Z" />
    </svg>
  );
}