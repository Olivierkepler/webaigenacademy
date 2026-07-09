import Link from "next/link";

export default function RoadmapComingSoon() {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden  bg-white px-8 py-14 text-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
    >
     

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-[#0F766E]/20 bg-[#0F766E]/10 px-4 py-2 text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
          Roadmap coming soon
        </span>

        <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          A clearer learning path is on the way.
        </h2>

        <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          We’re building a guided roadmap to help you move from beginner AI
          concepts to practical machine learning projects, labs, and quizzes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Foundations", "Practice labs", "Projects", "Quizzes"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {item}
              </span>
            )
          )}
        </div>

        <div className="mt-9">
          <Link
            href="/learn/machine-learning"
            className="inline-flex rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Start learning now
          </Link>
        </div>
      </div>
    </section>
  );
}