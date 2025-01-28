"use client";
import React from "react";
import { motion } from "framer-motion";

// If you don't have a cn function:
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function AuroraText({ className, children, ...props }) {
  return (
    <motion.span
      className={cn("relative inline-flex overflow-hidden", className)}
      {...props}
    >
      {children}
      {/* Our multi-blue swirling overlay */}
      <span className="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
        <span className="pointer-events-none absolute -top-1/2 left-0 h-[30vw] w-[30vw] animate-[spin_6s_linear_infinite] bg-[#0984e3] opacity-40 blur-[1rem]" />
        <span className="pointer-events-none absolute top-0 right-0 h-[30vw] w-[30vw] animate-[spin_8s_linear_infinite_reverse] bg-[#0b94e7] opacity-40 blur-[1rem]" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[spin_10s_linear_infinite] bg-[#074291] opacity-40 blur-[1rem]" />
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[spin_12s_linear_infinite_reverse] bg-[#4ea1f3] opacity-40 blur-[1rem]" />
      </span>
    </motion.span>
  );
}
