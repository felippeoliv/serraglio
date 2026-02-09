"use client";

import { cn } from "@/lib/utils";

interface Step4MetricsProps {
  data: {
    adsPerMonth: string;
    monthlyRevenue: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const adsOptions = [
  { value: "none", label: "Nenhum" },
  { value: "1-5", label: "De 1 a 5" },
  { value: "5-10", label: "De 5 a 10" },
  { value: "10-20", label: "De 10 a 20" },
  { value: "20+", label: "Mais de 20" },
];

const revenueOptions = [
  { value: "less-5k", label: "Menos de R$5k" },
  { value: "5k-10k", label: "Entre 5k e 10k" },
  { value: "10k-25k", label: "Entre 10k e 25k" },
  { value: "25k-50k", label: "Entre 25k e 50k" },
  { value: "50k-100k", label: "Entre 50k e 100k" },
  { value: "100k+", label: "Mais de 100k" },
];

export default function Step4Metrics({ data, onChange, errors }: Step4MetricsProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Métricas e <span className="gradient-text">Performance</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Entenda melhor seu volume de testes e resultados
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Quantos anúncios novos você testa por mês? <span className="text-primary">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {adsOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 group",
                data.adsPerMonth === option.value
                  ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
                  : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
              )}
            >
              <input
                type="radio"
                name="adsPerMonth"
                value={option.value}
                checked={data.adsPerMonth === option.value}
                onChange={(e) => onChange("adsPerMonth", e.target.value)}
                className="sr-only"
              />
              <span className={cn(
                "text-sm font-semibold transition-colors",
                data.adsPerMonth === option.value ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.adsPerMonth && (
          <p className="text-sm text-destructive font-medium">{errors.adsPerMonth}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Quanto você fatura mensalmente? <span className="text-primary">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {revenueOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 group",
                data.monthlyRevenue === option.value
                  ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
                  : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
              )}
            >
              <input
                type="radio"
                name="monthlyRevenue"
                value={option.value}
                checked={data.monthlyRevenue === option.value}
                onChange={(e) => onChange("monthlyRevenue", e.target.value)}
                className="sr-only"
              />
              <span className={cn(
                "text-sm font-semibold transition-colors text-center",
                data.monthlyRevenue === option.value ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.monthlyRevenue && (
          <p className="text-sm text-destructive font-medium">{errors.monthlyRevenue}</p>
        )}
      </div>
    </div>
  );
}
