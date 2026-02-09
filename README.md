# 50 Formatos de Criativos - Plataforma Serraglio

Plataforma exclusiva para acesso a 50 formatos de criativos validados e testados, com identidade visual moderna e ousada.

## ✨ Design System Serraglio

Este projeto implementa a identidade visual completa da marca Serraglio, com:

- 🎨 **Paleta laranja vibrante** (#ff4d00) com degradês
- 🔤 **Tipografia premium**: League Spartan + Inter
- 🎭 **Animações fluidas** com Framer Motion
- 💎 **Glass morphism** e efeitos modernos
- 🌊 **Orbs flutuantes** animados no background

## Funcionalidades

### 1. Sistema de Autenticação
- Validação de e-mail contra base de clientes autorizados
- Acesso restrito apenas para compradores do produto
- Persistência de sessão

### 2. Wizard Multi-Step
Formulário dividido em 5 etapas:
- **Passo 1**: Informações Pessoais (nome, telefone, Instagram)
- **Passo 2**: Ocupação Profissional
- **Passo 3**: Desafios e Objetivos
- **Passo 4**: Métricas (anúncios/mês, faturamento)
- **Passo 5**: Nível de Comprometimento (escala 1-10)

### 3. Dashboard de Criativos
- Galeria com 50 criativos validados
- Filtros por categoria (Vídeo, Carrossel, Imagem, UGC, Animação)
- Busca por texto
- Visualização em Grid ou Lista
- Métricas de performance (CTR, Taxa de Conversão)
- Tags para organização
- Design dark mode moderno

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zod** - Validação de dados
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Ícones
- **Framer Motion** - Animações

## Como Executar

```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

Acesse: http://localhost:3000

## Configuração

### E-mails Autorizados

Edite o arquivo `app/api/validate-email/route.ts` para adicionar e-mails autorizados:

```typescript
const authorizedEmails = new Set([
  "cliente1@email.com",
  "cliente2@email.com",
  // ... adicione mais e-mails
]);
```

### Dados dos Criativos

Para personalizar os 50 criativos, edite `app/dashboard/page.tsx`:

```typescript
const MOCK_CREATIVES: Creative[] = [
  {
    id: "1",
    title: "Título do Criativo",
    description: "Descrição detalhada...",
    category: "Vídeo",
    tags: ["alta conversão", "urgência"],
    imageUrl: "/path/to/image.jpg", // opcional
    metrics: {
      clickRate: 5.2,
      conversionRate: 3.1,
    },
  },
  // ... mais criativos
];
```

## Estrutura de Pastas

```
serraglio/
├── app/
│   ├── api/
│   │   ├── validate-email/    # Validação de acesso
│   │   └── submit-form/        # Processamento do formulário
│   ├── dashboard/              # Galeria de criativos
│   ├── wizard/                 # Formulário multi-step
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Tela de login
├── components/
│   ├── dashboard/
│   │   └── CreativeCard.tsx    # Card de criativo
│   └── wizard/
│       ├── StepIndicator.tsx   # Indicador de progresso
│       ├── Step1Personal.tsx
│       ├── Step2Occupation.tsx
│       ├── Step3Goals.tsx
│       ├── Step4Metrics.tsx
│       └── Step5Commitment.tsx
├── types/
│   └── index.ts                # Tipos TypeScript
└── package.json
```

## Fluxo do Usuário

1. **Login** → Usuário digita e-mail
2. **Validação** → Sistema verifica se e-mail está autorizado
3. **Wizard** → Se não completou formulário, passa pelo wizard
4. **Dashboard** → Acessa galeria de 50 criativos
5. **Navegação** → Filtra, busca e visualiza criativos

## Próximos Passos

- [ ] Integrar com banco de dados real (PostgreSQL/MongoDB)
- [ ] Adicionar sistema de upload de imagens para criativos
- [ ] Implementar favoritos/salvos
- [ ] Sistema de comentários/avaliações
- [ ] Integração com IA para sugestões personalizadas
- [ ] Analytics de uso
- [ ] Exportação de criativos
- [ ] Sistema de notificações

## Estimativa de Projeto

### Mockup/MVP (Entregável inicial)
- Desenvolvimento da estrutura base: R$ 2.500 - R$ 3.500
- Design e UX: R$ 1.500 - R$ 2.000
- **Total MVP**: R$ 4.000 - R$ 5.500

### Implementação Completa (Pós-aprovação)
- Integração com banco de dados: R$ 1.500 - R$ 2.000
- Upload e gerenciamento de imagens: R$ 1.000 - R$ 1.500
- Sistema de admin para gerenciar criativos: R$ 2.000 - R$ 3.000
- Testes e refinamentos: R$ 1.500 - R$ 2.000
- Deploy e configuração: R$ 500 - R$ 1.000
- **Total Completo**: R$ 6.500 - R$ 9.500

### Investimento Total
**R$ 10.500 - R$ 15.000**

*Valores sujeitos a ajustes conforme escopo e requisitos adicionais identificados na reunião de vendas.*
