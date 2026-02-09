"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Gift, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CreativeCard from "@/components/dashboard/CreativeCard";
import CreativeModal from "@/components/dashboard/CreativeModal";
import { Creative } from "@/types";
import trelloData from "@/50-formatos-anuncios.json";

// Dados REAIS extraídos do Trello (100% aderente)
const CREATIVES: Creative[] = trelloData.formatos.map((formato) => ({
  id: `creative-${formato.numero}`,
  title: formato.titulo,
  description: formato.descricao,
  category: "Formato de Anúncio",
  tags: [],
  explanation: formato.descricao,
  howToApply: undefined,
  exampleUrl: formato.link_exemplos,
}));

// Links dos bônus extraídos do Trello
const BONUS_LINKS = {
  comunidade: "https://chat.whatsapp.com/LKcvj7nepyhFQVBBI3lC6j",
  swipeFile: "https://drive.google.com/drive/folders/1RhmMHVcjFft9yS-DgZedqzXZE9SXk_Ms?usp=drive_link",
  prompt: "https://drive.google.com/file/d/1kfG7Yi_wtU9d1LUptzSnetR_EYZ7rXX5/view?usp=sharing",
};

const ITEMS_PER_PAGE = 12;

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

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < CREATIVES.length) {
          setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, CREATIVES.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [displayedCount]);

  const handleLogout = () => {
    sessionStorage.removeItem("userEmail");
    router.push("/");
  };

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
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Serraglio background effects */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] max-w-[50vw] bg-gradient-to-br from-serraglio-orange/15 via-serraglio-orangeLight/8 to-transparent rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] max-w-[50vw] bg-gradient-to-tl from-serraglio-orangeDark/12 via-serraglio-orange/6 to-transparent rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-5s' }}></div>

      <div className="relative z-10">
        {/* Header with Serraglio branding */}
        <header className="border-b border-white/10 bg-black/90 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="font-display text-2xl font-black text-white tracking-tight">
                    50 Formatos de <span className="gradient-serraglio-text">Criativos</span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">{email}</p>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 font-display font-bold"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-10">
          {/* Welcome Banner - Apple minimalist */}
          <Card className="border border-serraglio-orange/20 bg-black/40 p-8 mb-10 rounded-2xl backdrop-blur-xl">
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Bem-vindo à sua Biblioteca de <span className="gradient-serraglio-text">Criativos!</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
              Você tem acesso a <span className="text-serraglio-orange font-bold">50 formatos validados</span> e testados que geram resultados.
              Clique em qualquer criativo para ver detalhes, exemplos e como aplicar.
            </p>

            {/* Bonus Buttons - Serraglio style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Button
                variant="outline"
                className="h-auto py-3 px-4 justify-start gap-3 border border-serraglio-orange/30 hover:border-serraglio-orange/35 hover:bg-white/5 rounded-xl backdrop-blur-sm transition-all duration-200"
                onClick={() => window.open(BONUS_LINKS.comunidade, "_blank")}
              >
                <Gift className="w-6 h-6 text-serraglio-orange flex-shrink-0" />
                <div className="text-left">
                  <div className="font-display font-bold text-white">Comunidade ADS</div>
                  <div className="text-xs text-gray-400">WhatsApp Exclusivo</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-3 px-4 justify-start gap-3 border border-serraglio-orange/30 hover:border-serraglio-orange/35 hover:bg-white/5 rounded-xl backdrop-blur-sm transition-all duration-200"
                onClick={() => window.open(BONUS_LINKS.swipeFile, "_blank")}
              >
                <BookOpen className="w-6 h-6 text-serraglio-orange flex-shrink-0" />
                <div className="text-left">
                  <div className="font-display font-bold text-white">Swipe File</div>
                  <div className="text-xs text-gray-400">+100 Ads Validados</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-3 px-4 justify-start gap-3 border border-serraglio-orange/30 hover:border-serraglio-orange/35 hover:bg-white/5 rounded-xl backdrop-blur-sm transition-all duration-200"
                onClick={() => window.open(BONUS_LINKS.prompt, "_blank")}
              >
                <Zap className="w-6 h-6 text-serraglio-orange flex-shrink-0" />
                <div className="text-left">
                  <div className="font-display font-bold text-white">Prompt IA</div>
                  <div className="text-xs text-gray-400">Adapte os Formatos</div>
                </div>
              </Button>
            </div>
          </Card>

          {/* Creatives Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayedCreatives.map((creative) => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                onClick={() => handleCreativeClick(creative)}
              />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div
              ref={observerTarget}
              className="flex justify-center py-10"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-serraglio-orange rounded-full animate-pulse"></div>
                Carregando mais formatos...
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-serraglio-orange/20 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-serraglio-orange/50 to-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 - Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* Modal */}
      <CreativeModal
        creative={selectedCreative}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
