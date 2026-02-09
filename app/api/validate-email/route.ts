import { NextResponse } from "next/server";
import { completedForms } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Verifica se já completou o formulário
    const completedForm = completedForms.has(emailLower);

    return NextResponse.json({
      hasAccess: true, // Qualquer um pode acessar
      completedForm,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao validar e-mail" },
      { status: 500 }
    );
  }
}
