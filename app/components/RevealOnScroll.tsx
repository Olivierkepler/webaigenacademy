"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

const hidden = { opacity: 0, y: 32, scale: 0.98 };
const visible = { opacity: 1, y: 0, scale: 1 };

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function RevealOnScroll({
  children,
  delay = 0,
  className,
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
