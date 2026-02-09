"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="mb-16">
      {/* Apple-style step indicator - perfeitamente centralizado */}
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={false}
                animate={{
                  scale: step === currentStep ? 1 : 1,
                }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 font-display relative",
                  step < currentStep && "bg-serraglio-orange border-serraglio-orange",
                  step === currentStep && "bg-serraglio-orange border-serraglio-orange ring-4 ring-serraglio-orange/20",
                  step > currentStep && "bg-transparent border-white/20"
                )}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <span className={cn(
                    "text-base font-bold",
                    step <= currentStep ? "text-white" : "text-gray-600"
                  )}>
                    {step}
                  </span>
                )}
              </motion.div>

              {/* Step label */}
              <span className={cn(
                "text-xs font-medium tracking-wide absolute -bottom-6 whitespace-nowrap",
                step === currentStep && "text-white font-semibold",
                step < currentStep && "text-gray-500",
                step > currentStep && "text-gray-600"
              )}>
                {stepTitles[step - 1]}
              </span>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div className="w-16 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: step < currentStep ? "100%" : "0%"
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-serraglio-orange"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
