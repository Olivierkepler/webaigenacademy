import Image from "next/image";
import Link from "next/link";

type CareerGoalBannerProps = {
  imageSrc?: string;
  href?: string;
};

export default function CareerGoalBanner({
  imageSrc = "/images/Subject(1).png",
  href = "/learn/machine-learning",
}: CareerGoalBannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#003334] text-white">
      <div className="relative mx-auto grid min-h-[460px] max-w-[1600px] grid-cols-1 lg:grid-cols-[52%_48%]">
        <div className="relative z-20 flex items-center px-8 py-16 sm:px-16 lg:px-[140px]">
          <div>
            <h2 className="max-w-[560px] text-[52px] font-black italic leading-[0.9] tracking-tight sm:text-[70px]">
              Score your next
              <br />
              career goal
            </h2>

            <p className="mt-8 max-w-[660px] text-[22px] leading-[1.35] text-white/95">
              Big wins don&apos;t come from standing still. Build career-ready
              skills and{" "}
              <span className="font-extrabold text-white">save up to 15%</span>{" "}
              with code{" "}
              <span className="font-extrabold text-[#F0A0B6]">GOALS2026.</span>{" "}
              <span className="italic">Limited-time offer.</span>
            </p>

            <Link
              href={href}
              className="mt-7 inline-flex rounded-full bg-[#E94700] px-7 py-3.5 text-lg font-semibold text-white transition hover:bg-[#ff5a12]"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="relative min-h-[460px] overflow-hidden">
          <div
            className="absolute inset-y-0 -left-28 w-[78%] bg-[#0E6A63]"
            style={{
              clipPath: "polygon(18% 0%, 100% 0%, 78% 100%, 0% 100%)",
            }}
          />

          <div
            className="absolute inset-y-0 right-10 w-[38%] bg-[#064042]"
            style={{
              clipPath: "polygon(35% 0%, 100% 0%, 78% 100%, 0% 100%)",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(169,255,235,0.5),transparent_25%),linear-gradient(110deg,transparent_15%,rgba(255,255,255,0.18)_45%,transparent_70%)] opacity-80" />

          <div className="absolute left-[15%] top-[18%] h-[310px] w-[78%] border border-white/60" />

          <div className="absolute right-[6%] top-0 h-full w-[34%] -skew-x-12 bg-[#003334]" />

          <Image
            src={imageSrc}
            alt="Career learner"
            fill
            priority
            className="relative z-10 object-contain object-bottom"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}