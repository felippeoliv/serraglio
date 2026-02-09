const fs = require('fs');
const path = require('path');

// Mapa de correções de português
const correcoes = {
  // Palavras comuns
  'video': 'vídeo', 'Video': 'Vídeo',
  'comeca': 'começa', 'Comeca': 'Começa',
  'voce': 'você', 'Voce': 'Você',
  'ja': 'já', 'Ja': 'Já',
  'ta': 'tá', 'Ta': 'Tá',
  'e um': 'é um', 'E um': 'É um',
  'e o': 'é o', 'E o': 'É o',
  'e a': 'é a', 'E a': 'É a',
  'gancho': 'gancho',
  'dor': 'dor',
  'duvida': 'dúvida', 'Duvida': 'Dúvida',
  'galera': 'galera',
  'criador': 'criador',
  'anuncio': 'anúncio', 'Anuncio': 'Anúncio',
  'padrao': 'padrão', 'Padrao': 'Padrão',
  'perfeito': 'perfeito',
  'solucao': 'solução', 'Solucao': 'Solução',
  'pessoa': 'pessoa',
  'historia': 'história', 'Historia': 'História',
  'imersao': 'imersão', 'Imersao': 'Imersão',
  'dialogo': 'diálogo', 'Dialogo': 'Diálogo',
  'objecoes': 'objeções', 'Objecoes': 'Objeções',
  'transformacao': 'transformação', 'Transformacao': 'Transformação',
  'atencao': 'atenção', 'Atencao': 'Atenção',
  'otimo': 'ótimo', 'Otimo': 'Ótimo',
  'heroi': 'herói', 'Heroi': 'Herói',
  'cafe': 'café', 'Cafe': 'Café',
  'urgencia': 'urgência', 'Urgencia': 'Urgência',
  'noticia': 'notícia', 'Noticia': 'Notícia',
  'audio': 'áudio', 'Audio': 'Áudio',
  'audios': 'áudios', 'Audios': 'Áudios',
  'situacao': 'situação', 'Situacao': 'Situação',
  'engraçada': 'engraçada', 'Engracada': 'Engraçada',
  'engracado': 'engraçado', 'Engracado': 'Engraçado',
  'secundaria': 'secundária', 'Secundaria': 'Secundária',
  'estrategia': 'estratégia', 'Estrategia': 'Estratégia',
  'experiencia': 'experiência', 'Experiencia': 'Experiência',
  'pratica': 'prática', 'Pratica': 'Prática',
  'proximo': 'próximo', 'Proximo': 'Próximo',
  'proximos': 'próximos', 'Proximos': 'Próximos',
  'proxima': 'próxima', 'Proxima': 'Próxima',
  'publico': 'público', 'Publico': 'Público',
  'especifico': 'específico', 'Especifico': 'Específico',
  'basico': 'básico', 'Basico': 'Básico',
  'unico': 'único', 'Unico': 'Único',
  'unica': 'única', 'Unica': 'Única',
  'exclusivo': 'exclusivo',
  'necessario': 'necessário', 'Necessario': 'Necessário',
  'varios': 'vários', 'Varios': 'Vários',
  'cenario': 'cenário', 'Cenario': 'Cenário',
  'cenarios': 'cenários', 'Cenarios': 'Cenários',
  'tutorial': 'tutorial',
  'tutoriais': 'tutoriais',
  'facil': 'fácil', 'Facil': 'Fácil',
  'rapido': 'rápido', 'Rapido': 'Rápido',
  'rapida': 'rápida', 'Rapida': 'Rápida',
  'codigo': 'código', 'Codigo': 'Código',
  'metrica': 'métrica', 'Metrica': 'Métrica',
  'metricas': 'métricas', 'Metricas': 'Métricas',
  'conteudo': 'conteúdo', 'Conteudo': 'Conteúdo',
  'serie': 'série', 'Serie': 'Série',
  'episodio': 'episódio', 'Episodio': 'Episódio',
  'estetica': 'estética', 'Estetica': 'Estética',
  'dinamico': 'dinâmico', 'Dinamico': 'Dinâmico',
  'dinamica': 'dinâmica', 'Dinamica': 'Dinâmica',
  'organico': 'orgânico', 'Organico': 'Orgânico',
  'organica': 'orgânica', 'Organica': 'Orgânica',
  'autentico': 'autêntico', 'Autentico': 'Autêntico',
  'autentica': 'autêntica', 'Autentica': 'Autêntica',
  'analise': 'análise', 'Analise': 'Análise',
  'analogia': 'analogia',
  'receita': 'receita',
  'ideia': 'ideia',
  'televisao': 'televisão', 'Televisao': 'Televisão',
  'decisao': 'decisão', 'Decisao': 'Decisão',
  'reflexao': 'reflexão', 'Reflexao': 'Reflexão',
  'reacao': 'reação', 'Reacao': 'Reação',
  'informacao': 'informação', 'Informacao': 'Informação',
  'funcao': 'função', 'Funcao': 'Função',
  'introducao': 'introdução', 'Introducao': 'Introdução',
  'producao': 'produção', 'Producao': 'Produção',
  'conversao': 'conversão', 'Conversao': 'Conversão',
  'atencao': 'atenção', 'Atencao': 'Atenção',
  'descricao': 'descrição', 'Descricao': 'Descrição',
  'inscricao': 'inscrição', 'Inscricao': 'Inscrição',
  'participacao': 'participação', 'Participacao': 'Participação',
};

function corrigirTexto(texto) {
  let resultado = texto;

  // Aplica correções palavra por palavra
  Object.entries(correcoes).forEach(([errado, correto]) => {
    const regex = new RegExp(`\\b${errado}\\b`, 'g');
    resultado = resultado.replace(regex, correto);
  });

  return resultado;
}

// Lê o JSON do Trello
const jsonPath = path.join(__dirname, '..', '50-formatos-anuncios.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Corrige as descrições dos formatos
data.formatos = data.formatos.map(formato => ({
  ...formato,
  titulo: corrigirTexto(formato.titulo),
  descricao: corrigirTexto(formato.descricao),
}));

// Corrige os cards importantes
data.cards_importante = data.cards_importante.map(card => ({
  ...card,
  titulo: corrigirTexto(card.titulo),
  descricao: corrigirTexto(card.descricao),
}));

// Salva o JSON corrigido
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Correção de português concluída!');
console.log(`📝 ${data.formatos.length} formatos corrigidos`);
console.log(`📝 ${data.cards_importante.length} cards importantes corrigidos`);
