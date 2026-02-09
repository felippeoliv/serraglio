"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Step3GoalsProps {
  data: {
    biggestChallenge: string;
    mainGoal: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function Step3Goals({ data, onChange, errors }: Step3GoalsProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Desafios e <span className="gradient-text">Objetivos</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Ajude-nos a entender melhor suas necessidades
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="biggestChallenge" className="block text-sm font-semibold text-foreground">
            Qual é o seu maior desafio quando o assunto é vender através de anúncios? <span className="text-primary">*</span>
          </label>
          <Textarea
            id="biggestChallenge"
            value={data.biggestChallenge}
            onChange={(e) => onChange("biggestChallenge", e.target.value)}
            rows={5}
            className={cn(
              errors.biggestChallenge && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="Descreva seu principal desafio com anúncios..."
          />
          {errors.biggestChallenge && (
            <p className="text-sm text-destructive font-medium">{errors.biggestChallenge}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="mainGoal" className="block text-sm font-semibold text-foreground">
            Qual é o seu maior objetivo para os próximos meses? <span className="text-primary">*</span>
          </label>
          <Textarea
            id="mainGoal"
            value={data.mainGoal}
            onChange={(e) => onChange("mainGoal", e.target.value)}
            rows={5}
            className={cn(
              errors.mainGoal && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="Descreva seu objetivo principal..."
          />
          {errors.mainGoal && (
            <p className="text-sm text-destructive font-medium">{errors.mainGoal}</p>
          )}
        </div>
      </div>
    </div>
  );
}
