import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar formulários:", error);
      return NextResponse.json(
        { error: "Erro ao buscar formulários" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      forms: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    );
  }
}
