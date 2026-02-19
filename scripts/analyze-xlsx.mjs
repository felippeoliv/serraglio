import XLSX from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "..", "docs", "Form - 50 Formatos (Responses).xlsx");
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

const noEmail = data.filter(r => !r["Email Address"]);
const withEmail = data.filter(r => r["Email Address"]);
const emailCounts = {};
withEmail.forEach(r => {
  const e = r["Email Address"].toLowerCase().trim();
  emailCounts[e] = (emailCounts[e] || 0) + 1;
});
const dupes = Object.entries(emailCounts).filter(([, c]) => c > 1);

console.log("=== RESUMO ===");
console.log("Total rows:", data.length);
console.log("Com email:", withEmail.length);
console.log("Sem email:", noEmail.length);
console.log("Emails únicos:", Object.keys(emailCounts).length);
console.log("Emails duplicados:", dupes.length, "emails que aparecem mais de 1x");
console.log("Rows extras (duplicatas):", dupes.reduce((s, [, c]) => s + c - 1, 0));
console.log("");

console.log("=== ROWS SEM EMAIL ===");
noEmail.forEach((r, i) => {
  console.log(
    `${i + 1} | Nome: ${r["Seu nome completo?"] || "(vazio)"} | Tel: ${r["Seu telefone (com DDD)?"] || "(vazio)"} | IG: ${r["Seu @ do Instagram?"] || "(vazio)"} | Ocupação: ${r["Com o que você trabalha hoje?"] || "(vazio)"}`
  );
});
console.log("");

console.log("=== TOP EMAILS DUPLICADOS ===");
dupes.sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([e, c]) => console.log(`${c}x ${e}`));
