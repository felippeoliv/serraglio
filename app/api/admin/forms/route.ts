import { NextResponse } from "next/server";
import { completedForms } from "@/lib/data-store";

// Lista de emails admin autorizados
const ADMIN_EMAILS = new Set([
  "felpsrdz@gmail.com",
  "dvncopy@gmail.com",
]);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !ADMIN_EMAILS.has(email.toLowerCase().trim())) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Converte o Map para array de objetos
    const forms = Array.from(completedForms.entries()).map(([email, data]) => ({
      email,
      ...data,
    }));

    return NextResponse.json({
      success: true,
      forms,
      total: forms.length,
    });
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    );
  }
}
