"use client";

import { useState } from "react";
import { Creative } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CreativeModalV2Props {
  creative: Creative | null;
  open: boolean;
  onClose: () => void;
}

export default function CreativeModalV2({ creative, open, onClose }: CreativeModalV2Props) {
  const [activeVideo, setActiveVideo] = useState(0);

  if (!creative) return null;

  const num = creative.id.replace("creative-", "").padStart(2, "0");
  const title = creative.title.replace(/^\d+\s*-\s*/, "");
  const examples = creative.examples || [];
  const hasEmbeds = examples.length > 0;
  const current = examples[activeVideo];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setActiveVideo(0); onClose(); } }}>
      <DialogContent className="max-w-2xl p-0 bg-[#160800] border-[3px] border-[#ff4d00] rounded-2xl overflow-hidden gap-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-7 pt-7 pb-5">
          <div className="flex items-start gap-4">
            {/* Seal badge */}
            <div className="flex-shrink-0 w-14 h-14 mt-0.5">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M50,7 Q63,1 71,13 Q85,13 86,28 Q98,36 92,50 Q98,64 86,72 Q85,87 71,87 Q63,99 50,93 Q37,99 29,87 Q15,87 14,72 Q2,64 8,50 Q2,36 14,28 Q15,13 29,13 Q37,1 50,7 Z"
                  fill="#ff4d00"
                />
                <text x="50" y="51" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="36">
                  {num}
                </text>
              </svg>
            </div>

            {/* Title */}
            <DialogTitle className="font-display text-2xl sm:text-3xl font-black text-white leading-tight flex-1 pr-8 !text-white">
              {title}
            </DialogTitle>
          </div>
        </div>

        {/* Description */}
        <div className="px-7 pb-5">
          <p className="font-sans text-sm text-white/80 leading-relaxed">
            {creative.explanation || creative.description}
          </p>
        </div>

        {/* Exemplos embedados */}
        {hasEmbeds ? (
          <div className="px-7 pb-7">
            <h3 className="font-display text-lg font-black text-[#ff4d00] mb-3">
              Exemplos:
            </h3>

            {/* Player / Imagem */}
            <div className="border-2 border-[#ff4d00] rounded-xl overflow-hidden bg-[#0e0400]">
              {current?.type === "video" ? (
                <div className="flex justify-center bg-[#0e0400] p-3">
                  <div className="w-[280px] aspect-[9/16]">
                    <iframe
                      key={current.id}
                      src={`https://drive.google.com/file/d/${current.id}/preview`}
                      className="w-full h-full rounded-lg"
                      allow="autoplay"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : current?.type === "image" ? (
                <div className="flex items-center justify-center bg-[#0e0400] p-3">
                  <img
                    key={current.id}
                    src={`https://drive.google.com/thumbnail?id=${current.id}&sz=w800`}
                    alt={current.name}
                    className="max-h-[60vh] w-auto rounded-lg"
                  />
                </div>
              ) : null}
            </div>

            {/* Seletor de exemplos */}
            {examples.length > 1 && (
              <div className="flex gap-2 mt-3">
                {examples.map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveVideo(i)}
                    className={`flex-1 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 ${
                      i === activeVideo
                        ? "bg-[#ff4d00] text-white"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                    }`}
                  >
                    Exemplo {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : creative.exampleUrl ? (
          /* Fallback: link pro Drive pra formatos sem embed ainda */
          <div className="px-7 pb-7">
            <h3 className="font-display text-lg font-black text-[#ff4d00] mb-3">
              Exemplos:
            </h3>
            <div
              onClick={() => window.open(creative.exampleUrl, "_blank")}
              className="border-2 border-[#ff4d00] rounded-xl overflow-hidden cursor-pointer hover:border-[#fc4900] transition-colors duration-200"
            >
              <div className="bg-[#0e0400] grid grid-cols-3 gap-2 p-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[9/16] bg-[#2a0f00] rounded-lg flex items-center justify-center border border-[#ff4d00]/30"
                  >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#ff4d00]/60">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-[#fc4900] via-[#ffab8c] to-[#ed3a1d] py-2.5 flex items-center justify-center gap-2">
                <span className="font-display font-black text-white text-xs tracking-widest uppercase">
                  Abrir no Drive
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
