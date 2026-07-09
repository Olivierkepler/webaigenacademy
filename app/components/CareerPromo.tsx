import Image from "next/image";
import Link from "next/link";

type CareerPromoProps = {
  imageSrc?: string;
  href?: string;
};

export default function CareerPromo({
  imageSrc = "/images/career-person.png",
  href = "/learn/machine-learning",
}: CareerPromoProps) {
  return (
    <section className="relative overflow-hidden bg-[#003334] text-white">
      <div className="mx-auto grid min-h-[460px] max-w-7xl items-center lg:grid-cols-[1fr_1.05fr]">
        {/* Left content */}
        <div className="relative z-10 px-8 py-16 sm:px-12 lg:px-20">
          <h2 className="max-w-xl text-5xl font-black italic leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Score your next
            <br />
            career goal
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            Big wins don&apos;t come from standing still. Build career-ready
            skills and{" "}
            <span className="font-bold text-white">save up to 15%</span> with
            code{" "}
            <span className="font-bold text-[#F5A3B7]">GOALS2026.</span>{" "}
            <span className="italic">Limited-time offer.</span>
          </p>

          <Link
            href={href}
            className="mt-8 inline-flex rounded-full bg-[#E94700] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#FF5A12]"
          >
            Learn more
          </Link>
        </div>

        {/* Right image area */}
        <div className="relative min-h-[460px] overflow-hidden">
          {/* angled teal panel */}
          <div className="absolute inset-y-0 left-0 w-full origin-bottom-left -skew-x-12 bg-[#0E5C58]" />

          {/* glow/lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(117,255,226,0.45),transparent_28%),linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.16)_50%,transparent_70%)] opacity-80" />

          <div className="absolute left-[18%] top-[18%] h-64 w-[70%] border border-white/60" />

          <div className="absolute right-0 top-0 h-full w-[35%] -skew-x-12 bg-[#003334]" />

          <Image
            src={imageSrc}
            alt="Career learner"
            fill
            priority
            className="relative z-10 object-contain object-bottom"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      </div>
    </section>
  );
}