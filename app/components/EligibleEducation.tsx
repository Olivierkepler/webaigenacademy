import Image from "next/image";
import Link from "next/link";

const offerings = [
  {
    category: "Executive Education",
    title: "Artificial Intelligence Programme",
    provider: "WebAiGen Academy",
    duration: "6 weeks to complete",
    image: "/images/technician2.jpeg",
  },
  {
    category: "Executive Education",
    title: "AI Business Essentials",
    provider: "WebAiGen Academy",
    duration: "3 months to complete",
    image: "/images/technicians.jpg",
  },
  {
    category: "Executive Education",
    title: "Cybersecurity: Managing Risk in the AI Age",
    provider: "WebAiGen Academy",
    duration: "8 weeks to complete",
    image: "/images/programer2.jpg",
  },
  {
    category: "Executive Education",
    title: "AI Strategy & Automation",
    provider: "WebAiGen Academy",
    duration: "3 months to complete",
    image: "/images/technician2.jpeg",
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
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EligibleEducation() {
  return (
    <section className="bg-white px-20 py-20 font-[Inter,Helvetica_Neue,Arial,sans-serif]">
      <div className="mx-auto max-w-[1500px]">
        <h2 className="text-[44px] font-bold tracking-[-0.03em] text-[#003334] sm:text-[52px]">
          Eligible Executive Education
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {offerings.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
            >
              <div className="bg-[#A8BAB5] px-5 py-3">
                <p className="text-lg font-bold text-[#003334]">
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

                <div className="absolute left-6 top-6 rounded bg-white px-6 py-4 shadow-sm">
                  <span className="text-sm font-bold text-[#003334]">
                    WebAiGen
                  </span>
                </div>
              </div>

              <div className="flex min-h-[330px] flex-col px-5 pb-6 pt-7">
                <h3 className="text-[27px] font-bold leading-[1.55] text-zinc-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-[23px] text-zinc-700">
                  {item.provider}
                </p>

                <div className="mt-auto flex items-center gap-3 text-[19px] text-zinc-700">
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
            className="rounded-full bg-[#E94700] px-7 py-3 text-[23px] font-medium text-white shadow-md transition hover:bg-[#cf3f00]"
          >
            View all eligible offerings
          </Link>
        </div>
      </div>
    </section>
  );
}