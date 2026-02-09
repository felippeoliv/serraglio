"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeSerroglioProps {
  number?: string | number;
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BadgeSerraglio({
  number,
  text,
  className,
  size = "md"
}: BadgeSerroglioProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const numberSizeClasses = {
    sm: "w-7 h-7 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-14 h-14 text-2xl",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "inline-flex items-center gap-3 rounded-full backdrop-blur-sm",
        "bg-gradient-to-r from-serraglio-orange/15 via-serraglio-orangeLight/15 to-serraglio-orangeDark/15",
        "border-2 border-serraglio-orange/30",
        "shadow-lg shadow-serraglio-orange/10",
        "hover:border-serraglio-orange/50 hover:shadow-xl hover:shadow-serraglio-orange/20",
        "transition-all duration-300",
        sizeClasses[size],
        className
      )}
    >
      {number && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            "bg-gradient-to-br from-serraglio-orange to-serraglio-orangeDark",
            "font-display font-black text-white",
            "shadow-md shadow-serraglio-orange/40",
            numberSizeClasses[size]
          )}
        >
          {number}
        </div>
      )}
      <span className="font-display font-bold text-white uppercase tracking-[0.15em]">
        {text}
      </span>
    </motion.div>
  );
}

export function BadgeSerroglioSimple({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5",
        "rounded-full backdrop-blur-sm",
        "bg-gradient-to-r from-serraglio-orange/15 to-serraglio-orangeDark/15",
        "border-2 border-serraglio-orange/30",
        "shadow-md shadow-serraglio-orange/10",
        "font-display text-xs font-bold text-white uppercase tracking-[0.15em]",
        className
      )}
    >
      {text}
    </span>
  );
}
