export default function Background() {
  return (
    <div>
     
     {/* Background decorations — fixed layer behind all content */}
     <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        {/* Base gradient (painted first so the grid stays visible on top) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafafa] to-[#f4f4f5] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900" />

        {/* Angled panels */}
        <div
          className="absolute -top-40 right-0 h-[500px] w-[900px] bg-[#f2f2f2] dark:bg-zinc-900/70"
          style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 30%)" }}
        />
        {/* <div
          className="absolute left-0 top-80 h-[500px] w-[700px] bg-[#f1f1f1] dark:bg-zinc-900/50"
          style={{ clipPath: "polygon(0 0, 30% 0, 100% 100%, 0 100%)" }}
        /> */}
        <div
          className="absolute bottom-0 left-2/3 h-[300px] w-[900px] bg-[#f3f3f3] dark:bg-zinc-900/60"
          style={{ clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0 100%)" }}
        />
  

        {/* Grid overlay — on top of the panels so it reads across the whole canvas */}
        {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,113,122,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,113,122,0.25)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.28] dark:opacity-[0.14]" /> */}

        {/* Fade the grid out toward the center so text stays clean */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.85),transparent_70%)]" />
      </div>
       </div>
  );
}