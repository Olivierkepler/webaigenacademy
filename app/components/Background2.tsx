export default function Background() {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Base Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50 to-blue-100" />
  
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
  
        {/* Large Blue Glow */}
        <div className="absolute left-[-10%] top-[-10%] h-[700px] w-[700px] rounded-full bg-sky-400/20 blur-[180px]" />
  
        {/* Secondary Glow */}
        <div className="absolute right-[-5%] top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-[160px]" />
  
        {/* Accent Glow */}
        <div className="absolute bottom-[-10%] left-[25%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[140px]" />
  
        {/* Floating Shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-w-7xl">
  
            {/* Card 1 */}
            <div className="absolute left-[8%] top-[12%] h-56 w-80 rotate-[-12deg] rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_40px_90px_rgba(37,99,235,0.12)]" />
  
            {/* Card 2 */}
            <div className="absolute left-[18%] top-[35%] h-72 w-52 rotate-[8deg] rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_40px_120px_rgba(0,0,0,0.08)]" />
  
            {/* Card 3 */}
            <div className="absolute left-[35%] top-[25%] h-80 w-60 rotate-[-8deg] rounded-[2.5rem] border border-sky-100 bg-gradient-to-br from-white to-sky-50 shadow-[0_40px_100px_rgba(14,165,233,0.12)]" />
  
            {/* Circle */}
            <div className="absolute left-[25%] bottom-[12%] h-52 w-52 rounded-full border border-sky-200 bg-white/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(14,165,233,0.12)]" />
  
            {/* Soft Rectangle */}
            <div className="absolute left-[45%] bottom-[18%] h-40 w-72 rotate-[10deg] rounded-[2rem] bg-gradient-to-r from-sky-100 to-cyan-100 opacity-80" />
          </div>
        </div>
  
        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(0,0,0,.6) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      </div>
    );
  }