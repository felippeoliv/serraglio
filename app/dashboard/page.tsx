"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Creative } from "@/types";
import trelloData from "@/50-formatos-anuncios.json";
import CreativeCardV2 from "@/components/v2/CreativeCardV2";
import CreativeModalV2 from "@/components/v2/CreativeModalV2";

// Mapeamento de exemplos embeddáveis (IDs do Google Drive)
const EXAMPLES_MAP: Record<number, { id: string; name: string; type: "video" | "image" }[]> = {
  1: [
    { id: "1depRw5BrLJSbBLo6i6-AKPiuRAt_hYyO", name: "F1.1.mp4", type: "video" },
    { id: "1a2JaFHx0sWYP2GsHWlR-37Cy8Qh_Oh1-", name: "F1.2.mp4", type: "video" },
    { id: "14n7y5j47TxsaYwVtLtWzYZWAXXW6nL0f", name: "F1.3.mp4", type: "video" },
  ],
  2: [
    { id: "1a6mxXfXrGC1nUc7my8tTYZBgDSpr05JZ", name: "F2.1.mp4", type: "video" },
    { id: "1R3pDJe_cDm56VGTXmVvRQxAiFDHjM1j_", name: "F2.2.mp4", type: "video" },
  ],
  3: [
    { id: "1ZwZByFT0xICaLn_LZK0nTDRlHFzIyRsZ", name: "F3.1.mp4", type: "video" },
    { id: "1SA7A6CVCekjb7YLxL_SQf3KSfbVeO5mq", name: "F3.2.mp4", type: "video" },
    { id: "1p9ij8xAEehSQG2Jttjrz9t52ubhUi3rp", name: "F3.3.mp4", type: "video" },
    { id: "1eixOrAxqV9KQRdrJjvxy21ej9IwiT1r1", name: "F3.4.mp4", type: "video" },
    { id: "1kkAGzWTZz4uInI319w86RZh0LUg-Azn_", name: "F3.5.mp4", type: "video" },
  ],
  4: [
    { id: "1u6qu7yboy5IOawHtDRHjj-VYI6ZO-Ztq", name: "F4.1.mp4", type: "video" },
    { id: "1Tjd2_iQPRONynge2IjH7s0y_gNvaosxK", name: "F4.2.mp4", type: "video" },
  ],
  5: [
    { id: "1U99g7IJL_O-NoSA4WLhFX7c1_PswoeJ-", name: "F5.1.jpg", type: "image" },
    { id: "1zwCkP-1rRNB2VeOxBdyX12tzZlhmN_XT", name: "F5.2.jpg", type: "image" },
  ],
};

const CREATIVES: Creative[] = trelloData.formatos.map((formato) => ({
  id: `creative-${formato.numero}`,
  title: formato.titulo,
  description: formato.descricao,
  category: "Formato de Anúncio",
  tags: [],
  explanation: formato.descricao,
  howToApply: undefined,
  exampleUrl: formato.link_exemplos,
  examples: EXAMPLES_MAP[formato.numero],
}));

const BONUS_LINKS = {
  comunidade: "https://chat.whatsapp.com/LKcvj7nepyhFQVBBI3lC6j",
  swipeFile: "https://drive.google.com/drive/folders/1RhmMHVcjFft9yS-DgZedqzXZE9SXk_Ms?usp=drive_link",
  prompt: "https://drive.google.com/file/d/1kfG7Yi_wtU9d1LUptzSnetR_EYZ7rXX5/view?usp=sharing",
};

const ITEMS_PER_PAGE = 20;

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/");
      return;
    }
    setEmail(userEmail);
  }, [router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < CREATIVES.length) {
          setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, CREATIVES.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [displayedCount]);

  const handleCreativeClick = (creative: Creative) => {
    setSelectedCreative(creative);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCreative(null), 200);
  };

  const displayedCreatives = CREATIVES.slice(0, displayedCount);
  const hasMore = displayedCount < CREATIVES.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* Background warm glow - corners */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(160,60,0,0.3) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(160,60,0,0.25) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 30% at 50% 100%, rgba(140,40,0,0.15) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 w-full px-4 py-8">
        {/* ── HEADER ── */}
        <header className="border border-white/[0.12] rounded-2xl bg-black/60 mb-4 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,77,0,0.4)]">
                  <path
                    d="M50,7 Q63,1 71,13 Q85,13 86,28 Q98,36 92,50 Q98,64 86,72 Q85,87 71,87 Q63,99 50,93 Q37,99 29,87 Q15,87 14,72 Q2,64 8,50 Q2,36 14,28 Q15,13 29,13 Q37,1 50,7 Z"
                    fill="#ff4d00"
                  />
                  <text x="50" y="52" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="40">
                    50
                  </text>
                </svg>
              </div>
              <div>
                <div className="font-display font-black text-white text-2xl leading-none uppercase tracking-tight">
                  FORMATOS
                </div>
                <div className="font-sans text-white/50 text-sm font-light leading-tight">
                  que escalam
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="hidden sm:flex items-center gap-5">
              <span className="font-display font-bold text-white/30 text-sm uppercase tracking-widest cursor-default">
                Suporte
              </span>
              <span className="text-white/20">|</span>
              <button
                onClick={() => window.open(BONUS_LINKS.comunidade, "_blank")}
                className="font-display font-bold text-white/80 text-sm hover:text-[#ff4d00] transition-colors duration-150 uppercase tracking-widest"
              >
                Grupo
              </button>
            </nav>
          </div>
        </header>

        {/* ── GRID CONTAINER ── */}
        <div className="border border-white/[0.12] rounded-2xl bg-black/40 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {displayedCreatives.map((creative, index) => (
              <CreativeCardV2
                key={creative.id}
                creative={creative}
                onClick={() => handleCreativeClick(creative)}
                index={index}
              />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={observerTarget} className="flex justify-center pt-8 pb-2">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#ff4d00] rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BÔNUS ── */}
        <div className="mt-6 border border-white/[0.12] rounded-2xl bg-black/40 p-5">
          <h2 className="font-display font-black text-white text-lg uppercase tracking-tight mb-4 px-1">
            Bônus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Prompts */}
            <div
              onClick={() => window.open(BONUS_LINKS.prompt, "_blank")}
              className="group cursor-pointer"
            >
              <div className="relative border-2 border-[#ff4d00]/80 rounded-lg overflow-hidden shadow-[0_2px_16px_rgba(255,77,0,0.1)] hover:shadow-[0_4px_24px_rgba(255,77,0,0.25)] hover:border-[#ff4d00] transition-all duration-300">
                <div className="bg-gradient-to-b from-[#1a0a00] to-[#120600] px-3 py-3 flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_4px_rgba(255,77,0,0.5)]">
                      <path
                        d="M50,7 Q63,1 71,13 Q85,13 86,28 Q98,36 92,50 Q98,64 86,72 Q85,87 71,87 Q63,99 50,93 Q37,99 29,87 Q15,87 14,72 Q2,64 8,50 Q2,36 14,28 Q15,13 29,13 Q37,1 50,7 Z"
                        fill="#ff4d00"
                      />
                      <text x="50" y="51" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="30">
                        AI
                      </text>
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm leading-snug flex-1 line-clamp-2">
                    Prompts para Criativos com IA
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-[#fc4900] via-[#ffab8c] to-[#ed3a1d] px-4 py-3 flex items-center justify-center gap-2 group-hover:brightness-110 transition-all duration-200">
                  <span className="font-display font-black text-white text-xs tracking-[0.15em] uppercase">
                    Acessar
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Swipe File */}
            <div
              onClick={() => window.open(BONUS_LINKS.swipeFile, "_blank")}
              className="group cursor-pointer"
            >
              <div className="relative border-2 border-[#ff4d00]/80 rounded-lg overflow-hidden shadow-[0_2px_16px_rgba(255,77,0,0.1)] hover:shadow-[0_4px_24px_rgba(255,77,0,0.25)] hover:border-[#ff4d00] transition-all duration-300">
                <div className="bg-gradient-to-b from-[#1a0a00] to-[#120600] px-3 py-3 flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_4px_rgba(255,77,0,0.5)]">
                      <path
                        d="M50,7 Q63,1 71,13 Q85,13 86,28 Q98,36 92,50 Q98,64 86,72 Q85,87 71,87 Q63,99 50,93 Q37,99 29,87 Q15,87 14,72 Q2,64 8,50 Q2,36 14,28 Q15,13 29,13 Q37,1 50,7 Z"
                        fill="#ff4d00"
                      />
                      <text x="50" y="51" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="30">
                        SF
                      </text>
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm leading-snug flex-1 line-clamp-2">
                    Swipe File de Anúncios
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-[#fc4900] via-[#ffab8c] to-[#ed3a1d] px-4 py-3 flex items-center justify-center gap-2 group-hover:brightness-110 transition-all duration-200">
                  <span className="font-display font-black text-white text-xs tracking-[0.15em] uppercase">
                    Acessar
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs font-sans mt-6">
          © 2025 Serraglio — {email}
        </p>
      </div>

      <CreativeModalV2
        creative={selectedCreative}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
