"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type LandingRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function LandingReveal({ children, className, delay = 0 }: LandingRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
