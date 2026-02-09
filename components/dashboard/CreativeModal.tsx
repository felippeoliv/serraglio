"use client";

import { Creative } from "@/types";
import { Play, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreativeModalProps {
  creative: Creative | null;
  open: boolean;
  onClose: () => void;
}

export default function CreativeModal({
  creative,
  open,
  onClose,
}: CreativeModalProps) {
  if (!creative) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl gradient-text pr-8">
            {creative.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Explicação */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              O Que É Este Formato?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {creative.explanation || creative.description}
            </p>
          </div>

          {/* Vídeos de Exemplo */}
          {creative.exampleUrl && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-0.5">
                      Vídeos de Exemplo
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Veja exemplos reais deste formato
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(creative.exampleUrl, "_blank")}
                  className="gap-2 flex-shrink-0"
                  size="sm"
                  variant="outline"
                >
                  <FolderOpen className="w-4 h-4" />
                  Abrir Drive
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
