import Image from "next/image";

const partners = [
  { name: "MIT", src: "/images/partners/mit.png" },
  { name: "Harvard", src: "/images/partners/harvard.png" },
  { name: "Berkeley", src: "/images/partners/berkeley.png" },
  { name: "Google Cloud", src: "/images/partners/google-cloud.png" },
  { name: "Cambridge", src: "/images/partners/cambridge.png" },
  { name: "Columbia University", src: "/images/partners/columbia.png" },
];

export default function PartnerLogos() {
  return (
    <section className="border-y border-[#003334]/10 bg-white py-16 font-[Inter,Helvetica_Neue,Arial,sans-serif]">
      <div className="mx-auto flex max-w-7xl items-center gap-10 px-6 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-10 overflow-hidden">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative h-12 w-[170px] shrink-0 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                className="object-contain"
                sizes="170px"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="View more partners"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[#003334] transition hover:bg-[#003334] hover:text-white"
        >
          →
        </button>
      </div>
    </section>
  );
}