import { z } from "zod";

// Schema do formulário
export const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone com DDD é obrigatório"),
  instagram: z.string().min(2, "Instagram é obrigatório"),
  occupation: z.enum([
    "infoprodutor",
    "dr_owner",
    "coproducer",
    "agency_owner",
    "copywriter",
    "other",
  ]),
  occupationOther: z.string().optional(),
  biggestChallenge: z.string().min(10, "Por favor, descreva seu maior desafio"),
  mainGoal: z.string().min(10, "Por favor, descreva seu objetivo"),
  adsPerMonth: z.enum(["none", "1-5", "5-10", "10-20", "20+"]),
  monthlyRevenue: z.enum([
    "less-5k",
    "5k-10k",
    "10k-25k",
    "25k-50k",
    "50k-100k",
    "100k+",
  ]),
  commitmentLevel: z.number().min(1).max(10),
});

export type FormData = z.infer<typeof formSchema>;

// Tipo para criativos
export interface Creative {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  tags: string[];
  metrics?: {
    clickRate?: number;
    conversionRate?: number;
  };
  explanation?: string;
  howToApply?: string;
  exampleUrl?: string; // URL do vídeo/imagem exemplo
  examples?: { id: string; name: string; type: "video" | "image" }[];
}

// Tipo para usuário
export interface User {
  email: string;
  hasAccess: boolean;
  completedForm: boolean;
}
