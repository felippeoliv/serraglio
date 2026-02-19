import XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabase = createClient(
  "https://dhvedtlywtovvzaboeht.supabase.co",
  "sb_publishable_r_a8b0HuHGSDXpwDm1cXtw_hzIv6cEi"
);

const filePath = join(__dirname, "..", "docs", "Form - 50 Formatos (Responses).xlsx");
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log(`Total de linhas na planilha: ${rows.length}`);

// Mapear colunas do Sheets para campos do Supabase
function mapRow(row) {
  const occupation = row["Com o que você trabalha hoje?"] || null;
  return {
    email: (row["Email Address"] || "").toLowerCase().trim(),
    full_name: row["Seu nome completo?"] || null,
    phone: row["Seu telefone (com DDD)?"]?.toString() || null,
    instagram: row["Seu @ do Instagram?"] || null,
    occupation: occupation,
    occupation_other: null,
    biggest_challenge:
      row["Qual é o seu maior desafio quando o assunto é vender através de anúncios?"] || null,
    main_goal: row["Qual é o seu maior objetivo para os próximos meses?"] || null,
    ads_per_month: row["Quantos anúncios novos você testa por mês?"] || null,
    monthly_revenue: row["Quanto você fatura mensalmente?"] || null,
    commitment_level:
      parseInt(row["Se você for selecionado para a consultoria, o quando você se compromete a participar?"]) || 0,
    submitted_at: parseTimestamp(row["Timestamp"]),
  };
}

function parseTimestamp(ts) {
  if (!ts) return new Date().toISOString();
  // Formato: "1/15/2026 9:45:32" (M/D/YYYY H:mm:ss)
  if (typeof ts === "number") {
    // Excel serial date
    const date = new Date((ts - 25569) * 86400 * 1000);
    return date.toISOString();
  }
  const parts = ts.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+):(\d+)/);
  if (parts) {
    const [, month, day, year, hour, min, sec] = parts;
    return new Date(year, month - 1, day, hour, min, sec).toISOString();
  }
  return new Date().toISOString();
}

// Filtrar linhas sem email
const validRows = rows
  .map(mapRow)
  .filter((r) => r.email && r.email.length > 0);

console.log(`Linhas válidas (com email): ${validRows.length}`);

// Inserir em batches de 50, usando upsert para ignorar duplicatas
const BATCH_SIZE = 50;
let inserted = 0;
let skipped = 0;
let errors = 0;

for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
  const batch = validRows.slice(i, i + BATCH_SIZE);

  const { data, error } = await supabase
    .from("form_submissions")
    .upsert(batch, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error(`Erro no batch ${i / BATCH_SIZE + 1}:`, error.message);
    errors += batch.length;
  } else {
    inserted += batch.length;
  }

  process.stdout.write(`\rProgresso: ${Math.min(i + BATCH_SIZE, validRows.length)}/${validRows.length}`);
}

console.log(`\n\nImportação concluída!`);
console.log(`  Processados: ${inserted}`);
console.log(`  Erros: ${errors}`);
