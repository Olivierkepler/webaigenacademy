export default function Background() {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Base */}
        <div className="grid h-full w-full grid-cols-[45%_55%] bg-gradient-to-br from-white via-[#FCFCFC] to-[#F7F7F8]">
  
          {/* LEFT DECORATION */}
          <div className="flex items-center justify-center overflow-hidden">
  
            <div className="grid -rotate-12 gap-6">
  
              <div className="h-48 w-72 rounded-[2.5rem] bg-[#EEF7F6]" />
  
              <div className="flex gap-6">
                <div className="h-72 w-44 rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]" />
  
                <div className="h-72 w-52 rounded-[2rem] bg-[#F5FAF9]" />
              </div>
  
              <div className="flex gap-6">
                <div className="h-40 w-64 rounded-[2rem] bg-[#FFF6EE]" />
  
                <div className="h-40 w-40 rounded-full border border-[#D8E7E5] bg-white shadow-[0_20px_60px_rgba(14,92,88,.08)]" />
              </div>
  
            </div>
  
          </div>
  
          {/* RIGHT SIDE */}
          <div />
        </div>
  
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
  
        {/* Large teal glow */}
        <div className="absolute left-[-10%] top-[5%] h-[550px] w-[550px] rounded-full bg-[#0E5C58]/5 blur-[120px]" />
  
        {/* Orange glow */}
        <div className="absolute left-[18%] bottom-[8%] h-[180px] w-[180px] rounded-full bg-orange-400/8 blur-[80px]" />
      </div>
    );
  }