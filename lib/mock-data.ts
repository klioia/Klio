export const dashboardStats = [
  { label: "Conversas ativas", value: "1.284", trend: "+18% esta semana" },
  { label: "Automacoes rodando", value: "42", trend: "8 fluxos multi-canal" },
  { label: "Eventos por webhook", value: "18.420", trend: "92% processados" },
  { label: "Tempo poupado", value: "137h", trend: "operacao de atendimento" }
];

export const automations = [
  {
    id: "auto-01",
    name: "Comentario para DM automatica",
    trigger: "Comentario com palavra-chave na postagem",
    actions: ["Ler evento do webhook", "Responder DM", "Atualizar etapa do lead"],
    status: "Ativa"
  },
  {
    id: "auto-02",
    name: "Chatbot de qualificacao inicial",
    trigger: "Nova mensagem com intencao comercial",
    actions: ["Interpretar intencao", "Responder automaticamente", "Acionar equipe"],
    status: "Ativa"
  },
  {
    id: "auto-03",
    name: "Webhook de reengajamento",
    trigger: "Lead sem resposta ha 48h",
    actions: ["Reativar conversa", "Aplicar novo gatilho", "Mover etapa do lead"],
    status: "Rascunho"
  }
];

export const inbox = [
  {
    id: "msg-01",
    origin: "WhatsApp",
    contact: "Marina Costa",
    text: "Oi, quero saber como funciona para minha clinica.",
    status: "Novo"
  },
  {
    id: "msg-02",
    origin: "Instagram",
    contact: "@studioalma",
    text: "Vi o reels e quero automatizar meu atendimento.",
    status: "Respondido"
  },
  {
    id: "msg-03",
    origin: "WhatsApp",
    contact: "Rafael Lopes",
    text: "Consigo automatizar resposta para primeira triagem?",
    status: "Em fila"
  }
];

export const timeline = [
  "Webhook recebe o evento do Instagram ou WhatsApp",
  "Klio identifica o gatilho e ativa o chatbot certo",
  "Fluxo responde, qualifica e move a conversa de etapa",
  "Equipe assume so quando o handoff realmente faz sentido"
];

export const resultSignals = [
  {
    label: "Tempo de primeira resposta",
    value: "-72%",
    detail: "bots assumem a abertura da conversa sem esperar operador"
  },
  {
    label: "Leads qualificados",
    value: "+41%",
    detail: "gatilhos e perguntas iniciais filtram melhor a intencao"
  },
  {
    label: "Horas recuperadas",
    value: "137h",
    detail: "equipes focam nas conversas que realmente precisam de humano"
  }
];

export const landingProof = [
  "Ative bots por gatilho sem depender de gambiarra visual",
  "Receba eventos por webhook e transforme em acoes reais",
  "Escalone atendimento com handoff humano no momento certo"
];

export const plans = [
  {
    id: "start",
    name: "Start",
    monthlyPrice: 259.9,
    price: "R$ 259,90/mes",
    badge: "Entrada",
    highlight: false,
    billing: "Sem desconto anual",
    audience: "Indicado para iniciantes que estao comecando",
    description: "Base essencial para bot de atendimento com primeiros gatilhos e respostas automaticas.",
    checkoutEnabled: true,
    ctaLabel: "Escolher Start",
    features: [
      "1 canal: WhatsApp ou Instagram",
      "Ate 3 automacoes simples",
      "Respostas automaticas basicas",
      "Templates limitados",
      "Limite baixo de contatos e mensagens",
      "Dashboard simples",
      "Suporte basico"
    ],
    limitations: ["Sem campanhas automatizadas", "Sem segmentacao"]
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 357.9,
    price: "R$ 357,90/mes",
    badge: "Popular",
    highlight: false,
    billing: "15% OFF anual - 10% OFF parcelado",
    audience: "Indicado para pequenos negocios",
    description: "Melhor equilibrio para operar chatbot em dois canais com mais contexto e flexibilidade.",
    checkoutEnabled: true,
    ctaLabel: "Escolher Starter",
    features: [
      "WhatsApp + Instagram",
      "Ate 10 automacoes",
      "Fluxos personalizados",
      "Templates prontos",
      "Respostas inteligentes",
      "Limite medio de mensagens",
      "Dashboard com metricas basicas",
      "Suporte padrao"
    ],
    limitations: []
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 597.9,
    price: "R$ 597,90/mes",
    badge: "Mais recomendado",
    highlight: true,
    billing: "20% OFF anual - 10% OFF parcelado",
    audience: "Indicado para empresas em crescimento",
    description: "Camada premium da Klio para equipes que precisam de automacao conversacional mais profunda.",
    checkoutEnabled: true,
    ctaLabel: "Assinar Scale",
    features: [
      "Todos os canais: WhatsApp, Instagram, Messenger e Telegram",
      "Automacoes avancadas",
      "Segmentacao de leads",
      "Campanhas automaticas",
      "Funil de vendas automatizado",
      "Analytics avancado",
      "Integracao com CRM",
      "Multiusuarios",
      "Suporte prioritario"
    ],
    limitations: []
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    price: "Sob consulta",
    badge: "Custom",
    highlight: false,
    billing: "Projeto sob medida",
    audience: "Indicado para operacoes complexas",
    description: "Formato consultivo para operacoes com API propria, regras complexas e alta volumetria.",
    checkoutEnabled: false,
    ctaLabel: "Falar com vendas",
    features: [
      "Tudo do Scale",
      "Automacoes ilimitadas",
      "API personalizada",
      "Gerente de conta",
      "SLA de suporte",
      "Infraestrutura dedicada",
      "Onboarding personalizado",
      "Estrategia sob medida"
    ],
    limitations: []
  }
];
