import Image from "next/image";
import { accent } from "@/app/lib/typography";

export default function CommunitySection() {
  const points = [
    <>
      Learn{" "}
      <span className={`font-semibold ${accent.text}`}>Machine Learning</span>,
      <span className={`font-semibold ${accent.text}`}>
        {" "}
        Artificial Intelligence
      </span>
      , and modern data science through interactive, browser-based lessons.
    </>,

    <>
      Build real-world skills with hands-on labs, guided coding exercises, and
      practical projects that reinforce every concept.
    </>,

    <>
      Follow structured learning paths designed to take you from beginner
      fundamentals to production-ready AI workflows.
    </>,

    <>
      Practice with quizzes, visual explanations, and interactive notebooks that
      help you understand—not just memorize—the material.
    </>,

    <>
      Join a growing community of developers, students, and AI enthusiasts
      building the next generation of intelligent applications.
    </>,
  ];

  return (
    <section className="relative overflow-hidden bg-white font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto grid min-h-[760px] max-w-[1800px] grid-cols-1 items-center lg:grid-cols-[52%_48%]">
        <div className="px-8 py-20 sm:px-16 lg:pl-[160px] lg:pr-20">
          <h2 className="max-w-[720px] text-[48px] font-black italic leading-[0.92] tracking-[-0.04em] text-zinc-950 dark:text-white">
            Discover more than
            <br />
            a classroom — join a
            <br />
            global community.
          </h2>

          <ul className="mt-9 max-w-[700px] space-y-6 text-[22px] leading-[1.35] text-zinc-700 dark:text-zinc-300">
            {points.map((point, index) => (
              <li key={index} className="grid grid-cols-[10px_1fr] gap-6">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-zinc-700 dark:bg-zinc-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative min-h-[520px] overflow-hidden lg:min-h-[760px]"
          style={{
            clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <Image
            src="/images/programer2.jpg"
            alt="Student learning online"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 48vw"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/20 via-transparent to-transparent dark:from-zinc-950/40" />
        </div>
      </div>
    </section>
  );
}
