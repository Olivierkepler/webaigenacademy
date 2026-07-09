import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineering Student",
    image: "/images/testimonials/sarah.jpg",
    quote:
      "WebAiGen Academy made machine learning finally click for me. The interactive lessons and projects helped me build confidence far beyond reading documentation.",
  },
  {
    name: "Michael Chen",
    role: "Frontend Developer",
    image: "/images/testimonials/michael.jpg",
    quote:
      "I love how everything is practical. Instead of memorizing theory, I built real AI projects that I could actually add to my portfolio.",
  },
  {
    name: "Emily Rodriguez",
    role: "Data Analyst",
    image: "/images/testimonials/emily.jpg",
    quote:
      "The visual explanations and quizzes are outstanding. It feels like having a mentor guiding you through every lesson.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-orange-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-current"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.8l-5.2 2.72.99-5.8-4.2-4.1 5.81-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-zinc-50 py-28 font-[Inter,Helvetica_Neue,Arial,sans-serif] dark:bg-zinc-950">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#0F766E]/5 blur-[100px]" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-orange-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
        

          <h2 className="mt-6 text-5xl font-black tracking-[-0.04em] text-zinc-950 dark:text-white">
            Loved by learners
        
            around the world.
          </h2>

        
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_40px_90px_rgba(0,0,0,0.10)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Stars />

              <p className="mt-6 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                "{testimonial.quote}"
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                />

                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white">
                    {testimonial.name}
                  </h3>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
{/* 
        <div className="mt-20 grid gap-8 rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-4">
          <div className="text-center">
            <h3 className="text-5xl font-black text-[#0F766E]">10K+</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Active learners
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-5xl font-black text-[#0F766E]">4.9★</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Average rating
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-5xl font-black text-[#0F766E]">100+</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Interactive lessons
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-5xl font-black text-[#0F766E]">24/7</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Learn at your pace
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}