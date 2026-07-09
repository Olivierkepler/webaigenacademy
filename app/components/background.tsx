export default function Background() {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        {/* Base */}
        <div className="absolute inset-0 bg-[#003334]" />
  
        {/* Soft teal glow */}
        <div className="absolute right-[8%] top-[-10%] h-[620px] w-[520px] rotate-12 bg-[#0E5C58]/70 blur-3xl" />
        <div className="absolute left-[8%] top-[35%] h-[360px] w-[360px] rounded-full bg-[#0B4A4B]/40 blur-3xl" />
  
        {/* Angled panels */}
        <div
          className="absolute -right-20 top-0 h-[720px] w-[760px] bg-[#0E5C58]/70"
          style={{
            clipPath: "polygon(22% 0%, 100% 0%, 84% 100%, 0% 100%)",
          }}
        />
  
        <div
          className="absolute right-[3%] top-0 h-[760px] w-[300px] bg-[#0B3F40]/80"
          style={{
            clipPath: "polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)",
          }}
        />
  
        {/* Light streaks */}
        <div className="absolute right-[20%] top-[5%] h-[640px] w-[2px] rotate-[18deg] bg-white/20 blur-[1px]" />
        <div className="absolute right-[24%] top-[10%] h-[560px] w-[2px] rotate-[18deg] bg-white/10 blur-[1px]" />
        <div className="absolute right-[30%] top-[8%] h-[560px] w-[1px] rotate-[18deg] bg-white/15 blur-[1px]" />
  
        {/* Thin geometric frame */}
        <div className="absolute right-[14%] top-[18%] h-[280px] w-[520px] border border-white/20" />
  
        {/* Subtle orange accent */}
        <div className="absolute left-[8%] top-[58%] h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />
  
        {/* Deep overlay so content stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003334] via-[#003334]/95 to-[#003334]/70" />
  
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#003334] to-transparent" />
      </div>
    );
  }