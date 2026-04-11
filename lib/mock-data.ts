export const dashboardStats = [
  { label: "Conversas ativas", value: "1.284", trend: "+18% esta semana" },
  { label: "Automacoes rodando", value: "42", trend: "8 fluxos multi-canal" },
  { label: "Mensagens respondidas", value: "18.420", trend: "92% no primeiro retorno" },
  { label: "Tempo poupado", value: "137h", trend: "operacao de atendimento" }
];

export const automations = [
  {
    id: "auto-01",
    name: "Comentario para DM automatica",
    trigger: "Comentario com palavra-chave na postagem",
    actions: ["Responder na DM", "Qualificar interesse", "Atualizar etapa do lead"],
    status: "Ativa"
  },
  {
    id: "auto-02",
    name: "Chatbot de qualificacao inicial",
    trigger: "Nova mensagem com intencao comercial",
    actions: ["Fazer perguntas iniciais", "Organizar dados", "Avisar equipe"],
    status: "Ativa"
  },
  {
    id: "auto-03",
    name: "Reengajamento automatico",
    trigger: "Lead sem resposta ha 48h",
    actions: ["Retomar conversa", "Mover etapa", "Gerar nova chance de venda"],
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

export const painPoints = [
  {
    title: "Resposta lenta derruba interesse",
    description: "Quando o cliente espera demais, a conversa perde ritmo e a chance de venda cai."
  },
  {
    title: "Leads se perdem no meio do caminho",
    description: "Mensagens entram de varios canais e muita oportunidade some sem acompanhamento."
  },
  {
    title: "Sua equipe gasta energia no repetitivo",
    description: "Atendimento manual consome tempo e deixa pouco espaco para fechar negocio."
  }
];

export const solutionPoints = [
  {
    title: "A Klio responde na hora",
    description: "Seu atendimento funciona mais rapido e o cliente sente que foi ouvido desde o primeiro contato."
  },
  {
    title: "Cada conversa segue um fluxo claro",
    description: "A plataforma organiza os contatos, filtra interesse e conduz a conversa para o proximo passo."
  },
  {
    title: "Seu time entra so onde importa",
    description: "A equipe assume com contexto pronto, focando no que realmente gera venda."
  }
];

export const demoSteps = [
  {
    step: "01",
    badge: "Entrada",
    title: "O cliente envia uma mensagem",
    description: "A Klio recebe a conversa no canal certo e ja coloca tudo em movimento."
  },
  {
    step: "02",
    badge: "Resposta",
    title: "O bot responde imediatamente",
    description: "Seu cliente nao fica esperando e ja recebe orientacao inicial sem depender de operador."
  },
  {
    step: "03",
    badge: "Qualificacao",
    title: "O lead e qualificado",
    description: "A conversa e organizada, as informacoes importantes aparecem e o interesse fica mais claro."
  },
  {
    step: "04",
    badge: "Equipe",
    title: "O humano assume para fechar",
    description: "Quando chega a hora certa, sua equipe entra com contexto e muito mais chance de conversao."
  }
];

export const proofMetrics = [
  {
    label: "Mais conversas aproveitadas",
    value: "+38%",
    detail: "respostas mais rapidas ajudam seu negocio a nao perder interesse logo na primeira mensagem"
  },
  {
    label: "Menos tempo no repetitivo",
    value: "-61%",
    detail: "a equipe deixa de responder sempre a mesma coisa e ganha tempo para vender"
  },
  {
    label: "Velocidade no primeiro retorno",
    value: "3x mais rapido",
    detail: "o cliente recebe retorno imediato e a conversa continua quente"
  }
];

export const socialProof = [
  {
    name: "Marina",
    role: "Clinica de estetica",
    quote: "Antes a gente perdia contato por demora. Hoje a resposta sai na hora e nossa equipe entra so no lead certo."
  },
  {
    name: "Rafael",
    role: "Consultoria comercial",
    quote: "A Klio deixou nosso atendimento muito mais leve. As mensagens pararam de virar bagunca e ficou muito mais facil vender."
  },
  {
    name: "Juliana",
    role: "Infoprodutos",
    quote: "Conseguimos escalar o atendimento sem contratar no mesmo ritmo. Foi o passo que faltava para crescer com controle."
  }
];

export const closingBenefits = [
  "Mais vendas com menos tempo manual",
  "Atendimento mais rapido",
  "Mais clareza para sua equipe",
  "Automacao sem complicacao"
];

export const plans = [
  {
    id: "start",
    name: "Start",
    monthlyPrice: 259.9,
    price: "R$ 259,90/mes",
    badge: "Entrada",
    supportingBadge: null,
    highlight: false,
    billing: "Sem desconto anual",
    audience: "Para quem esta comecando",
    description: "Ideal para sair do atendimento manual e automatizar o basico sem peso na operacao.",
    checkoutEnabled: true,
    ctaLabel: "Comece hoje",
    features: [
      "1 canal: WhatsApp ou Instagram",
      "Ate 3 automacoes simples",
      "Respostas automaticas basicas",
      "Dashboard enxuto"
    ],
    limitations: [],
    urgencyLine: "Bom para iniciar. Limitado para quem quer escalar."
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 357.9,
    price: "R$ 357,90/mes",
    badge: "Mais escolhido",
    supportingBadge: null,
    highlight: false,
    billing: "15% OFF anual - 10% OFF parcelado",
    audience: "Para pequenos negocios",
    description: "Mais equilibrio para responder rapido, organizar melhor os contatos e operar dois canais com clareza.",
    checkoutEnabled: true,
    ctaLabel: "Automatizar meu atendimento",
    features: [
      "WhatsApp + Instagram",
      "Ate 10 automacoes",
      "Fluxos personalizados",
      "Respostas inteligentes"
    ],
    limitations: [],
    urgencyLine: "Para quem quer vender melhor sem crescer na bagunca."
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 597.9,
    price: "R$ 597,90/mes",
    badge: "Mais recomendado",
    supportingBadge: "Melhor custo-beneficio",
    highlight: true,
    billing: "20% OFF anual - 10% OFF parcelado",
    audience: "Para empresas em crescimento",
    description: "O plano certo para escalar atendimento, segmentar leads e ganhar controle real da operacao.",
    checkoutEnabled: true,
    ctaLabel: "Comecar agora sem equipe",
    features: [
      "WhatsApp, Instagram, Messenger e Telegram",
      "Automacoes avancadas",
      "Segmentacao de leads",
      "Campanhas e funis automatizados"
    ],
    limitations: [],
    urgencyLine: "Sem equipe, sem escala. Esse e o plano para crescer com estrutura."
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    price: "Sob consulta",
    badge: "Sob medida",
    supportingBadge: null,
    highlight: false,
    billing: "Projeto sob medida",
    audience: "Para operacoes complexas",
    description: "Formato consultivo para empresas que precisam de alto volume, regras personalizadas e acompanhamento dedicado.",
    checkoutEnabled: false,
    ctaLabel: "Falar com vendas",
    features: [
      "Tudo do Scale",
      "Automacoes ilimitadas",
      "API personalizada",
      "Infraestrutura dedicada"
    ],
    limitations: [],
    urgencyLine: "Para quem precisa de estrutura personalizada e suporte premium."
  }
];
