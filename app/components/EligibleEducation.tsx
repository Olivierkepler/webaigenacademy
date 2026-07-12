import Image from "next/image";
import Link from "next/link";
import { accent } from "@/app/lib/typography";

const offerings = [
    {
      category: "Machine Learning",
      title: "Machine Learning Foundations",
      provider: "WebAiGen Academy",
      duration: "6 weeks • Beginner",
      image: "/images/programmers.jpg",
    },
    {
      category: "Machine Learning",
      title: "Medical Machine Learning",
      provider: "WebAiGen Academy",
      duration: "8 weeks • Intermediate",
      image: "/images/programming2.webp",
    },
    {
      category: "Machine Learning",
      title: "Computer Vision with Deep Learning",
      provider: "WebAiGen Academy",
      duration: "10 weeks • Intermediate",
      image: "/images/programmers5.jpg",
    },
    {
      category: "Machine Learning",
      title: "Natural Language Processing",
      provider: "WebAiGen Academy",
      duration: "9 weeks • Advanced",
      image: "/images/programers4.webp",
    },
  ];

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EligibleEducation() {
  return (
    <section className="bg-white px-20 py-20 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-[1500px]">
        
      <h2 className="max-w-[560px] text-[52px] font-black italic leading-[0.9] tracking-tight sm:text-[60px]">
      Eligible Executive Education
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {offerings.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30"
            >
              <div className="bg-zinc-200/80 px-5 py-3 dark:bg-zinc-800">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {item.category}
                </p>
              </div>

              <div className="relative h-[118px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                <div className="absolute left-6 top-6 rounded bg-white px-6 py-4 shadow-sm dark:bg-zinc-900">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    WebAiGen
                  </span>
                </div>
              </div>

              <div className="flex min-h-[330px] flex-col px-5 pb-6 pt-7">
                <h3 className="text-[27px] font-bold leading-[1.55] text-zinc-800 dark:text-zinc-100">
                  {item.title}
                </h3>

                <p className="mt-1 text-[23px] text-zinc-700 dark:text-zinc-400">
                  {item.provider}
                </p>

                <div className="mt-auto flex items-center gap-3 text-[19px] text-zinc-700 dark:text-zinc-400">
                  <ClockIcon />
                  <span>{item.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
        <Link
  href="/learn/machine-learning"
  className={`rounded-full px-7 py-3 text-[23px] font-medium text-white shadow-md transition ${accent.bg} ${accent.hoverBg}`}
>
  Explore All Machine Learning Courses
</Link>
        </div>
      </div>
    </section>
  );
}
