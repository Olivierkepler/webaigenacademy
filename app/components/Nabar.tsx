import Link from "next/link";
import { accent, typography } from "@/app/lib/typography";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 lg:px-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="group">
          <p className={typography.navbarSmall}>
            WebAiGen
          </p>
          <h1 className={`text-xl font-medium tracking-tight text-white transition lg:text-2xl ${accent.groupHoverText}`}>
            WebAIGenAcademy.
          </h1>
        </Link>
      </div>
    </nav>
  );
}
