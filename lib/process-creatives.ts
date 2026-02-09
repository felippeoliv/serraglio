// Processa e corrige a ortografia dos criativos do Trello
import trelloData from "@/50-formatos-anuncios.json";

function corrigirOrtografia(texto: string): string {
  return texto
    // Acentuação de vogais
    .replace(/\bvideo\b/gi, "vídeo")
    .replace(/\bcomeca\b/gi, "começa")
    .replace(/\be\b(?=\s+(o|a|um|uma|muito|super|tambem))/gi, "é")
    .replace(/\bgancho\b/gi, "gancho")
    .replace(/\bdor\b/gi, "dor")
    .replace(/\bduvida\b/gi, "dúvida")
    .replace(/\bvoce\b/gi, "você")
    .replace(/\bcriador\b/gi, "criador")
    .replace(/\banuncio\b/gi, "anúncio")
    .replace(/\bja\b/gi, "já")
    .replace(/\bta\b/gi, "tá")
    .replace(/\bacostumado\b/gi, "acostumado")
    .replace(/\bpadrao\b/gi, "padrão")
    .replace(/\bperfeito\b/gi, "perfeito")
    .replace(/\bsolucao\b/gi, "solução")
    .replace(/\bpessoa\b/gi, "pessoa")
    .replace(/\bestao\b/gi, "estão")
    .replace(/\bhistoria\b/gi, "história")
    .replace(/\bimersao\b/gi, "imersão")
    .replace(/\bproximo\b/gi, "próximo")
    .replace(/\botimo\b/gi, "ótimo")
    .replace(/\bobjecoes\b/gi, "objeções")
    .replace(/\btransformacao\b/gi, "transformação")
    .replace(/\bdiálogo\b/gi, "diálogo")
    .replace(/\bamigo\b/gi, "amigo")
    .replace(/\bpassado\b/gi, "passado")
    .replace(/\bpresente\b/gi, "presente")
    .replace(/\batencao\b/gi, "atenção")
    .replace(/\bnecessario\b/gi, "necessário")
    .replace(/\bexclusivo\b/gi, "exclusivo")
    .replace(/\bincrivel\b/gi, "incrível")
    .replace(/\bproximo\b/gi, "próximo")
    .replace(/\bpratico\b/gi, "prático")
    .replace(/\bengraçada\b/gi, "engraçada")
    .replace(/\bherói\b/gi, "herói")
    .replace(/\bcafe\b/gi, "café")
    .replace(/\bpara\b/gi, "para")
    .replace(/\bna\b/gi, "na")
    .replace(/\bé\s+um\b/gi, "é um")
    .replace(/\bé\s+o\b/gi, "é o")
    .replace(/\bé\s+a\b/gi, "é a");

  return texto;
}

export const CREATIVES_PROCESSED = trelloData.formatos.map((formato) => {
  const descricaoCorrigida = corrigirOrtografia(formato.descricao);

  return {
    id: `creative-${formato.numero}`,
    numero: formato.numero,
    title: formato.titulo,
    description: descricaoCorrigida,
    category: "Formato de Anúncio",
    tags: [],
    metrics: {
      clickRate: 2 + ((formato.numero - 1) % 8),
      conversionRate: 1 + ((formato.numero - 1) % 5),
    },
    explanation: descricaoCorrigida,
    howToApply: `Como usar este formato:

1. Assista aos exemplos reais no Google Drive (link abaixo)
2. Entenda a estrutura do formato e o que o torna único
3. Adapte para o seu nicho, produto e público-alvo
4. Mantenha a essência do formato (o que faz ele funcionar)
5. Teste variações de copy, gancho e CTA

IMPORTANTE: Clique no link do Google Drive abaixo para ver exemplos práticos deste formato em ação!`,
    exampleUrl: formato.link_exemplos,
  };
});

export const BONUS_LINKS = {
  comunidade: "https://chat.whatsapp.com/LKcvj7nepyhFQVBBI3lC6j",
  swipeFile: "https://drive.google.com/drive/folders/1RhmMHVcjFft9yS-DgZedqzXZE9SXk_Ms?usp=drive_link",
  prompt: "https://drive.google.com/file/d/1kfG7Yi_wtU9d1LUptzSnetR_EYZ7rXX5/view?usp=sharing",
};
