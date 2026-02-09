import { NextResponse } from "next/server";
import { completedForms } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    if (!formData.email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório" },
        { status: 400 }
      );
    }

    const emailLower = formData.email.toLowerCase().trim();

    // Salva os dados do formulário
    // Em produção, isso seria salvo em um banco de dados
    completedForms.set(emailLower, {
      ...formData,
      email: emailLower,
      submittedAt: new Date().toISOString(),
    });

    console.log("Formulário recebido:", formData);

    return NextResponse.json({
      success: true,
      message: "Formulário enviado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao processar formulário:", error);
    return NextResponse.json(
      { error: "Erro ao processar formulário" },
      { status: 500 }
    );
  }
}

// Endpoint para recuperar dados de um formulário (usado internamente)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 });
  }

  const emailLower = email.toLowerCase().trim();
  const formData = completedForms.get(emailLower);

  if (!formData) {
    return NextResponse.json({ error: "Formulário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(formData);
}
