"use client";

import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Step2OccupationProps {
  data: {
    occupation: string;
    occupationOther?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const occupations = [
  { value: "infoprodutor", label: "Sou infoprodutor/mentor" },
  { value: "dr_owner", label: "Sou dono de operação de DR" },
  { value: "coproducer", label: "Sou Co-produtor" },
  { value: "agency_owner", label: "Dono de agência" },
  { value: "copywriter", label: "Copywriter" },
  { value: "other", label: "Outro" },
];

export default function Step2Occupation({ data, onChange, errors }: Step2OccupationProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Atividade <span className="gradient-text">Profissional</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Conte-nos sobre sua área de atuação
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Com o que você trabalha hoje? <span className="text-primary">*</span>
        </label>
        <div className="space-y-3">
          {occupations.map((occupation) => (
            <label
              key={occupation.value}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 group",
                data.occupation === occupation.value
                  ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
                  : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  data.occupation === occupation.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground group-hover:border-primary/50"
                )}>
                  {data.occupation === occupation.value && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className={cn(
                  "font-medium transition-colors",
                  data.occupation === occupation.value
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {occupation.label}
                </span>
              </div>
              <input
                type="radio"
                name="occupation"
                value={occupation.value}
                checked={data.occupation === occupation.value}
                onChange={(e) => onChange("occupation", e.target.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
        {errors.occupation && (
          <p className="text-sm text-destructive font-medium">{errors.occupation}</p>
        )}
      </div>

      {data.occupation === "other" && (
        <div className="space-y-2 animate-slide-up">
          <label htmlFor="occupationOther" className="block text-sm font-semibold text-foreground">
            Especifique sua ocupação <span className="text-primary">*</span>
          </label>
          <Input
            type="text"
            id="occupationOther"
            value={data.occupationOther || ""}
            onChange={(e) => onChange("occupationOther", e.target.value)}
            className={cn(
              errors.occupationOther && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="Descreva sua ocupação"
          />
          {errors.occupationOther && (
            <p className="text-sm text-destructive font-medium">{errors.occupationOther}</p>
          )}
        </div>
      )}
    </div>
  );
}
