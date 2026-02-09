"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Step1PersonalProps {
  data: {
    fullName: string;
    phone: string;
    instagram: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function Step1Personal({ data, onChange, errors }: Step1PersonalProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Informações <span className="gradient-text">Pessoais</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Vamos começar com algumas informações básicas sobre você
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-foreground">
            Seu nome completo? <span className="text-primary">*</span>
          </label>
          <Input
            type="text"
            id="fullName"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={cn(
              errors.fullName && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="João da Silva"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive font-medium">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
            Seu telefone (com DDD)? <span className="text-primary">*</span>
          </label>
          <Input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={cn(
              errors.phone && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="(11) 99999-9999"
          />
          {errors.phone && (
            <p className="text-sm text-destructive font-medium">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="instagram" className="block text-sm font-semibold text-foreground">
            Seu @ do Instagram? <span className="text-primary">*</span>
          </label>
          <Input
            type="text"
            id="instagram"
            value={data.instagram}
            onChange={(e) => onChange("instagram", e.target.value)}
            className={cn(
              errors.instagram && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="@seuperfil"
          />
          {errors.instagram && (
            <p className="text-sm text-destructive font-medium">{errors.instagram}</p>
          )}
        </div>
      </div>
    </div>
  );
}
