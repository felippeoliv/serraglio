"use client";

import { motion } from "framer-motion";
import { Creative } from "@/types";
import { ExternalLink } from "lucide-react";

interface CreativeCardV2Props {
  creative: Creative;
  onClick: () => void;
  index: number;
}

export default function CreativeCardV2({ creative, onClick, index }: CreativeCardV2Props) {
  const num = creative.id.replace("creative-", "").padStart(2, "0");
  const title = creative.title.replace(/^\d+\s*-\s*/, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative border-2 border-[#ff4d00]/80 rounded-lg overflow-hidden shadow-[0_2px_16px_rgba(255,77,0,0.1)] hover:shadow-[0_4px_24px_rgba(255,77,0,0.25)] hover:border-[#ff4d00] transition-all duration-300">
        {/* Card body */}
        <div className="bg-gradient-to-b from-[#1a0a00] to-[#120600] px-3 py-3 flex items-center gap-2.5">
          {/* Seal badge */}
          <div className="flex-shrink-0 w-12 h-12">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_4px_rgba(255,77,0,0.5)]">
              <path
                d="M50 11 L60.2 5.2 L66.9 14.9 L78.7 14 L80.5 25.6 L91.5 30.1 L88 41.3 L96 50 L88 58.7 L91.5 69.9 L80.5 74.4 L78.7 86 L66.9 85.1 L60.2 94.8 L50 89 L39.8 94.8 L33.1 85.1 L21.3 86 L19.5 74.4 L8.5 69.9 L12 58.7 L4 50 L12 41.3 L8.5 30.1 L19.5 25.6 L21.3 14 L33.1 14.9 L39.8 5.2 Z"
                fill="#ff4d00"
              />
              <text x="50" y="54" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="34">
                {num}
              </text>
            </svg>
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-white text-sm leading-snug flex-1 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Bottom CTA bar - gradient matching mockup */}
        <div className="bg-gradient-to-r from-[#fc4900] via-[#ffab8c] to-[#ed3a1d] px-4 py-3 flex items-center justify-center gap-2 group-hover:brightness-110 transition-all duration-200">
          <span className="font-sans font-black text-black text-xs tracking-[0.15em] uppercase">
            Clique para ver
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-black" />
        </div>
      </div>
    </motion.div>
  );
}
