import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

async function sendToGoogleSheets(data: Record<string, string | null>) {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("GOOGLE_SHEETS_WEBHOOK_URL não configurada, pulando envio para Sheets");
    return;
  }

  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("Erro ao enviar para Google Sheets:", err);
  }
}

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

    const submissionData = {
      email: emailLower,
      full_name: formData.fullName,
      phone: formData.phone,
      instagram: formData.instagram,
      occupation: formData.occupation,
      occupation_other: formData.occupationOther || null,
      biggest_challenge: formData.biggestChallenge,
      main_goal: formData.mainGoal,
      ads_per_month: formData.adsPerMonth,
      monthly_revenue: formData.monthlyRevenue,
      commitment_level: formData.commitmentLevel,
    };

    const { error } = await supabase.from("form_submissions").insert(submissionData);

    if (error) {
      console.error("Erro ao inserir no Supabase:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Este e-mail já foi cadastrado" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Erro ao processar formulário" },
        { status: 500 }
      );
    }

    // Envia para Google Sheets em background (não bloqueia a resposta)
    // No Sheets, occupation_other fica dentro de occupation
    const sheetsData = {
      ...submissionData,
      occupation: submissionData.occupation_other || submissionData.occupation,
    };
    sendToGoogleSheets(sheetsData);

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 });
  }

  const emailLower = email.toLowerCase().trim();

  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .eq("email", emailLower)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar formulário:", error);
    return NextResponse.json({ error: "Erro ao buscar formulário" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Formulário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}
