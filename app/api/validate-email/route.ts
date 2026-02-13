import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { data, error } = await supabase
      .from("form_submissions")
      .select("email")
      .eq("email", emailLower)
      .maybeSingle();

    if (error) {
      console.error("Erro ao consultar Supabase:", error);
      return NextResponse.json(
        { error: "Erro ao validar e-mail" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasAccess: true,
      completedForm: !!data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao validar e-mail" },
      { status: 500 }
    );
  }
}
