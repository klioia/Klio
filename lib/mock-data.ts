export const dashboardStats = [
  { label: "Conversas ativas", value: "1.284", trend: "+18% esta semana" },
  { label: "Automações rodando", value: "42", trend: "8 fluxos multicanal" },
  { label: "Eventos por webhook", value: "18.420", trend: "92% processados" },
  { label: "Tempo poupado", value: "137h", trend: "operação de atendimento" }
];

export const automations = [
  {
    id: "auto-01",
    name: "Comentário para DM automática",
    trigger: "Comentário com palavra-chave na postagem",
    actions: ["Ler evento de entrada", "Responder na DM", "Atualizar etapa do lead"],
    status: "Ativa"
  },
  {
    id: "auto-02",
    name: "Chatbot de qualificação inicial",
    trigger: "Nova mensagem com intenção comercial",
    actions: ["Interpretar intenção", "Responder automaticamente", "Acionar equipe"],
    status: "Ativa"
  },
  {
    id: "auto-03",
    name: "Reengajamento automático",
    trigger: "Lead sem resposta há 48h",
    actions: ["Reativar conversa", "Aplicar novo gatilho", "Mover etapa do lead"],
    status: "Rascunho"
  }
];

export const inbox = [
  {
    id: "msg-01",
    origin: "WhatsApp",
    contact: "Marina Costa",
    text: "Oi, quero saber como funciona para minha clínica.",
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
    text: "Consigo automatizar a resposta da primeira triagem?",
    status: "Em fila"
  }
];

export const timeline = [
  "A mensagem entra no canal certo",
  "A Klio identifica o gatilho e ativa o bot certo",
  "O fluxo responde, qualifica e organiza a conversa",
  "A equipe assume só quando realmente faz sentido"
];

export const resultSignals = [
  {
    label: "Tempo de primeira resposta",
    value: "-72%",
    detail: "o bot assume a abertura da conversa sem esperar operador"
  },
  {
    label: "Leads qualificados",
    value: "+41%",
    detail: "gatilhos e perguntas iniciais filtram melhor a intenção"
  },
  {
    label: "Horas recuperadas",
    value: "137h",
    detail: "a equipe foca nas conversas que realmente precisam de atenção humana"
  }
];

export const landingProof = [
  "Ative bots por gatilho sem depender de soluções improvisadas",
  "Transforme mensagens em ações reais",
  "Escalone o atendimento com repasse humano no momento certo"
];

export const plans = [
  {
    id: "start",
    name: "Start",
    monthlyPrice: 259.9,
    price: "R$ 259,90/mês",
    badge: "Entrada",
    highlight: false,
    billing: "Sem desconto anual",
    audience: "Indicado para quem está começando",
    description: "Base essencial para iniciar o atendimento automatizado com os primeiros gatilhos e respostas.",
    checkoutEnabled: true,
    ctaLabel: "Escolher Start",
    features: [
      "1 canal: WhatsApp ou Instagram",
      "Até 3 automações simples",
      "Respostas automáticas básicas",
      "Templates limitados",
      "Limite menor de contatos e mensagens",
      "Dashboard simples",
      "Suporte básico"
    ],
    limitations: ["Sem campanhas automatizadas", "Sem segmentação"]
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 357.9,
    price: "R$ 357,90/mês",
    badge: "Popular",
    highlight: false,
    billing: "15% OFF anual - 10% OFF parcelado",
    audience: "Indicado para pequenos negócios",
    description: "Melhor equilíbrio para operar em dois canais com mais contexto e flexibilidade.",
    checkoutEnabled: true,
    ctaLabel: "Escolher Starter",
    features: [
      "WhatsApp + Instagram",
      "Até 10 automações",
      "Fluxos personalizados",
      "Templates prontos",
      "Respostas inteligentes",
      "Limite médio de mensagens",
      "Dashboard com métricas básicas",
      "Suporte padrão"
    ],
    limitations: []
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 597.9,
    price: "R$ 597,90/mês",
    badge: "Mais recomendado",
    highlight: true,
    billing: "20% OFF anual - 10% OFF parcelado",
    audience: "Indicado para empresas em crescimento",
    description: "Camada premium da Klio para equipes que precisam de automação conversacional mais profunda.",
    checkoutEnabled: true,
    ctaLabel: "Assinar Scale",
    features: [
      "Todos os canais: WhatsApp, Instagram, Messenger e Telegram",
      "Automações avançadas",
      "Segmentação de leads",
      "Campanhas automáticas",
      "Funil de vendas automatizado",
      "Analytics avançado",
      "Integração com CRM",
      "Multiusuários",
      "Suporte prioritário"
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
    audience: "Indicado para operações complexas",
    description: "Formato consultivo para operações com API própria, regras complexas e alta volumetria.",
    checkoutEnabled: false,
    ctaLabel: "Falar com vendas",
    features: [
      "Tudo do Scale",
      "Automações ilimitadas",
      "API personalizada",
      "Gerente de conta",
      "SLA de suporte",
      "Infraestrutura dedicada",
      "Onboarding personalizado",
      "Estratégia sob medida"
    ],
    limitations: []
  }
];
