"use client";

import Image from "next/image";
import { motion, Transition } from "framer-motion";

type BlinkingRobotProps = {
  image?: string;
  size?: number;
  className?: string;
};

export default function BlinkingRobot({
  image = "/images/robot.png",
  size = 400,
  className = "",
}: BlinkingRobotProps) {
  const eyeClass =
    "absolute rounded-full bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.65)]";

  const blinkAnimation = {
    scaleY: [1, 1, 1, 0.06, 1],
  };

  const blinkTransition = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.84, 0.9, 0.95, 1],
  };

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={image}
        alt="Robot"
        fill
        sizes={`${size}px`}
        className="pointer-events-none select-none object-contain"
      />

      <motion.div
        className={eyeClass}
        style={{
          left: "30%",
          top: "41%",
          width: "12.5%",
          height: "12.5%",
          transformOrigin: "center",
        }}
        animate={blinkAnimation}
        transition={blinkTransition as Transition<any>}
      />

      <motion.div
        className={eyeClass}
        style={{
          left: "51%",
          top: "42%",
          width: "12.5%",
          height: "12.5%",
          transformOrigin: "center",
        }}
        animate={blinkAnimation}
        transition={blinkTransition as Transition<any>}
      />
    </div>
  );
}