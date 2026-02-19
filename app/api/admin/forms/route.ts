import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = new Set([
  "felpsrdz@gmail.com",
  "dvncopy@gmail.com",
]);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !ADMIN_EMAILS.has(email.toLowerCase().trim())) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!password || !adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 403 }
      );
    }

    // Supabase limits queries to 1000 rows by default.
    // Fetch all rows by paginating in chunks of 1000.
    let allData: any[] = [];
    let from = 0;
    const pageSize = 1000;

    while (true) {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .order("submitted_at", { ascending: false })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error("Erro ao buscar formulários:", error);
        return NextResponse.json(
          { error: "Erro ao buscar formulários" },
          { status: 500 }
        );
      }

      allData = allData.concat(data || []);

      if (!data || data.length < pageSize) break;
      from += pageSize;
    }

    return NextResponse.json({
      success: true,
      forms: allData,
      total: allData.length,
    });
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    );
  }
}
