"use client";

import { cn } from "@/lib/utils";

interface Step5CommitmentProps {
  data: {
    commitmentLevel: number;
  };
  onChange: (field: string, value: string | number) => void;
  errors: Record<string, string>;
}

export default function Step5Commitment({ data, onChange, errors }: Step5CommitmentProps) {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          <span className="gradient-text">Comprometimento</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Se você for selecionado para a consultoria, o quanto você se compromete a participar?
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-muted-foreground">Vou nada</span>
          <span className="text-primary">Pode contar comigo!</span>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange("commitmentLevel", level)}
              className={cn(
                "aspect-square rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all duration-300",
                data.commitmentLevel === level
                  ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/50 glow-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:scale-105 hover:text-foreground"
              )}
            >
              {level}
            </button>
          ))}
        </div>

        {data.commitmentLevel > 0 && (
          <div className={cn(
            "p-5 rounded-lg border transition-all duration-500 animate-slide-up",
            data.commitmentLevel >= 8
              ? "bg-primary/10 border-primary/30"
              : "bg-card border-border"
          )}>
            <div className="mb-2">
              <span className={cn(
                "font-semibold",
                data.commitmentLevel >= 8 ? "text-primary" : "text-foreground"
              )}>
                Nível de comprometimento: {data.commitmentLevel}/10
              </span>
            </div>
            {data.commitmentLevel >= 8 && (
              <div className="mt-3 p-3 rounded-md bg-primary/5">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-primary">Excelente!</span> Seu comprometimento aumenta suas chances de ser selecionado.
                </p>
              </div>
            )}
          </div>
        )}

        {errors.commitmentLevel && (
          <p className="text-sm text-destructive font-medium">{errors.commitmentLevel}</p>
        )}
      </div>
    </div>
  );
}
