"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Creative } from "@/types";

interface CreativeCardProps {
  creative: Creative;
  onClick: () => void;
}

export default function CreativeCard({ creative, onClick }: CreativeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        onClick={onClick}
        className="group border-2 border-serraglio-orange/20 hover:border-serraglio-orange/30 bg-gradient-to-br from-black/90 to-serraglio-orange/5 backdrop-blur-xl cursor-pointer rounded-xl overflow-hidden transition-all duration-200 shadow-lg"
      >

        <CardHeader className="pb-4 relative">
          <CardTitle className="font-display text-xl font-bold text-white transition-colors duration-200">
            {creative.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-gradient-to-r from-serraglio-orange/20 to-serraglio-orangeDark/20 text-serraglio-orange text-xs font-bold rounded-lg border border-serraglio-orange/30 font-display uppercase tracking-wider">
              {creative.category}
            </span>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {creative.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {creative.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white/5 text-gray-500 text-xs rounded-lg border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
