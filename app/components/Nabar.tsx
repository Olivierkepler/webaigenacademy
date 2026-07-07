import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 lg:px-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="group">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            WebAiGen
          </p>
          <h1 className="text-xl font-bold tracking-tight text-white transition group-hover:text-emerald-400 lg:text-2xl">
            WebAIGenAcademy
          </h1>
        </Link>
      </div>
    </nav>
  );
}
