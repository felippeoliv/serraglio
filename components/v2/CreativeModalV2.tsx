"use client";

import { useState, useEffect } from "react";
import { Creative } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CreativeModalV2Props {
  creative: Creative | null;
  open: boolean;
  onClose: () => void;
}

export default function CreativeModalV2({ creative, open, onClose }: CreativeModalV2Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, creative?.id]);

  if (!creative) return null;

  const num = creative.id.replace("creative-", "").padStart(2, "0");
  const title = creative.title.replace(/^\d+\s*-\s*/, "");
  const examples = creative.examples || [];
  const hasEmbeds = examples.length > 0;
  const activeExample = examples[activeIndex];

  const openVideo = (id: string) => {
    window.open(`https://drive.google.com/file/d/${id}/view`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-2xl !p-0 bg-[#160800] sm:border-[3px] sm:border-[#ff4d00] sm:!rounded-2xl overflow-hidden !gap-0">
        <div className="overflow-y-auto h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:flex sm:flex-col">
          {/* Header */}
          <div className="px-4 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 11 L60.2 5.2 L66.9 14.9 L78.7 14 L80.5 25.6 L91.5 30.1 L88 41.3 L96 50 L88 58.7 L91.5 69.9 L80.5 74.4 L78.7 86 L66.9 85.1 L60.2 94.8 L50 89 L39.8 94.8 L33.1 85.1 L21.3 86 L19.5 74.4 L8.5 69.9 L12 58.7 L4 50 L12 41.3 L8.5 30.1 L19.5 25.6 L21.3 14 L33.1 14.9 L39.8 5.2 Z"
                    fill="#ff4d00"
                  />
                  <text x="50" y="54" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="34">
                    {num}
                  </text>
                </svg>
              </div>
              <DialogTitle className="font-display text-xl sm:text-3xl font-black text-white leading-tight flex-1 pr-8 !text-white">
                {title}
              </DialogTitle>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 sm:px-7 pb-4 sm:pb-5">
            <p className="font-sans text-sm text-white/80 leading-relaxed">
              {creative.explanation || creative.description}
            </p>
          </div>

          {/* Exemplos */}
          {hasEmbeds ? (
            <div className="px-4 sm:px-7 pb-5 sm:pb-7 sm:flex-1 sm:min-h-0 sm:flex sm:flex-col">
              <h3 className="font-display text-lg font-black text-[#ff4d00] mb-3 sm:shrink-0">
                Exemplos:
              </h3>

              <div className="border-2 border-[#ff4d00] rounded-xl overflow-hidden bg-[#0e0400] sm:flex-1 sm:min-h-0 sm:flex sm:flex-col">
                {/* Thumbnail com play button */}
                <div
                  className="relative w-full aspect-[9/16] sm:aspect-auto sm:flex-1 sm:min-h-0 bg-black cursor-pointer group"
                  onClick={() => activeExample && openVideo(activeExample.id)}
                >
                  {activeExample && (
                    <img
                      key={activeExample.id}
                      src={`https://drive.google.com/thumbnail?id=${activeExample.id}&sz=w600`}
                      alt={activeExample.name}
                      className="w-full h-full object-cover sm:object-contain"
                      loading="lazy"
                    />
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ff4d00]/90 group-hover:bg-[#ff4d00] flex items-center justify-center transition-all group-hover:scale-110 shadow-xl shadow-black/40">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Badge "Toque para assistir" */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <span className="bg-black/60 backdrop-blur-sm text-white/90 text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Toque para assistir
                    </span>
                  </div>
                </div>

                {/* Navigation tabs - scroll horizontal */}
                {examples.length > 1 && (
                  <div className="bg-[#0e0400] p-2 sm:p-3 sm:shrink-0">
                    {/* Dots */}
                    <div className="flex justify-center gap-1.5 pb-2">
                      {examples.map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full transition-all duration-200 ${
                            i === activeIndex
                              ? "w-5 h-1.5 bg-[#ff4d00]"
                              : "w-1.5 h-1.5 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                    {/* Buttons - scroll horizontal no mobile */}
                    <div className="flex justify-center gap-1.5 overflow-x-auto no-scrollbar">
                      {examples.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`shrink-0 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                            i === activeIndex
                              ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30"
                              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                          }`}
                        >
                          Exemplo {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : creative.exampleUrl ? (
            <div className="px-4 sm:px-7 pb-5 sm:pb-7">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
