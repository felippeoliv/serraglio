"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StepIndicator from "@/components/wizard/StepIndicator";
import Step1Personal from "@/components/wizard/Step1Personal";
import Step2Occupation from "@/components/wizard/Step2Occupation";
import Step3Goals from "@/components/wizard/Step3Goals";
import Step4Metrics from "@/components/wizard/Step4Metrics";
import Step5Commitment from "@/components/wizard/Step5Commitment";

const STEP_TITLES = ["Pessoal", "Ocupação", "Objetivos", "Métricas", "Comprometimento"];

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    instagram: "",
    occupation: "",
    occupationOther: "",
    biggestChallenge: "",
    mainGoal: "",
    adsPerMonth: "",
    monthlyRevenue: "",
    commitmentLevel: 0,
  });

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      router.push("/");
      return;
    }
    setFormData((prev) => ({ ...prev, email }));
  }, [router]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName || formData.fullName.length < 3) {
          newErrors.fullName = "Nome completo é obrigatório";
        }
        if (!formData.phone || formData.phone.length < 10) {
          newErrors.phone = "Telefone com DDD é obrigatório";
        }
        if (!formData.instagram || formData.instagram.length < 2) {
          newErrors.instagram = "Instagram é obrigatório";
        }
        break;

      case 2:
        if (!formData.occupation) {
          newErrors.occupation = "Selecione uma opção";
        }
        if (formData.occupation === "other" && !formData.occupationOther) {
          newErrors.occupationOther = "Especifique sua ocupação";
        }
        break;

      case 3:
        if (!formData.biggestChallenge || formData.biggestChallenge.length < 10) {
          newErrors.biggestChallenge = "Descreva seu desafio (mínimo 10 caracteres)";
        }
        if (!formData.mainGoal || formData.mainGoal.length < 10) {
          newErrors.mainGoal = "Descreva seu objetivo (mínimo 10 caracteres)";
        }
        break;

      case 4:
        if (!formData.adsPerMonth) {
          newErrors.adsPerMonth = "Selecione uma opção";
        }
        if (!formData.monthlyRevenue) {
          newErrors.monthlyRevenue = "Selecione uma opção";
        }
        break;

      case 5:
        if (formData.commitmentLevel === 0) {
          newErrors.commitmentLevel = "Selecione seu nível de comprometimento";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Erro ao enviar formulário. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao enviar formulário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Personal
            data={{
              fullName: formData.fullName,
              phone: formData.phone,
              instagram: formData.instagram,
            }}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2Occupation
            data={{
              occupation: formData.occupation,
              occupationOther: formData.occupationOther,
            }}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3Goals
            data={{
              biggestChallenge: formData.biggestChallenge,
              mainGoal: formData.mainGoal,
            }}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4Metrics
            data={{
              adsPerMonth: formData.adsPerMonth,
              monthlyRevenue: formData.monthlyRevenue,
            }}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5Commitment
            data={{ commitmentLevel: formData.commitmentLevel }}
            onChange={handleChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Sutil gradient background - Apple style */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-serraglio-orange/5"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-12">
        {/* Header - Apple minimalist */}
        <div className="text-center mb-16 space-y-8 animate-fade-in">
          <div className="space-y-6">
            <h1 className="font-display text-5xl md:text-6xl font-black leading-[0.95] tracking-tight">
              <span className="text-white block">Leia e Responda com</span>
              <span className="gradient-serraglio-text block mt-2">Atenção</span>
            </h1>

            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-serraglio-orange font-bold">ATENÇÃO:</span> Toda semana eu escolho 5 novos alunos para fazer uma Consultoria e Auditoria de Criativos Gratuita
              </p>
              <p className="text-gray-400 text-base">
                Para concorrer a uma dessas vagas, responda as perguntas abaixo com atenção e sinceridade (demora menos de 3 minutos).
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Card - Apple minimalist */}
        <Card className="border border-white/10 backdrop-blur-xl bg-black/80 shadow-2xl rounded-2xl overflow-hidden animate-slide-up">
          <CardContent className="relative p-8 md:p-10">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={5}
              stepTitles={STEP_TITLES}
            />

            <div className="min-h-[500px]">{renderStep()}</div>

            <div className="flex justify-between mt-10 pt-8 border-t border-white/10">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                className="gap-2 font-display font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  className="gap-2 font-display font-bold"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="gap-2 font-display font-bold"
                >
                  {loading ? "Enviando..." : "Finalizar"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="mt-8 text-center animate-fade-in-delay">
          <p className="text-sm text-gray-400">
            ATENÇÃO: Ao final você será direcionado para os <span className="text-serraglio-orange font-bold">50 Formatos de Criativos</span> e todos os bônus
          </p>
        </div>
      </div>
    </div>
  );
}
