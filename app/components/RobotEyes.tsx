"use client";

import { motion } from "framer-motion";

export default function RobotEyes() {
  return (
    <div className="relative flex items-center justify-center gap-12">
      <BlinkingEye />
      <BlinkingEye />
    </div>
  );
}

function BlinkingEye() {
  return (
    <motion.div
      className="w-20 h-20 rounded-full bg-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.6)]"
      animate={{
        scaleY: [1, 1, 1, 0.05, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        times: [0, 0.85, 0.9, 0.95, 1],
      }}
      style={{
        transformOrigin: "center center",
      }}
    />
  );
}
``