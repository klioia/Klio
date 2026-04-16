export const dashboardStats = [
  { label: "Conversas ativas", value: "1.284", trend: "+18% esta semana" },
  { label: "Automações rodando", value: "42", trend: "8 fluxos multicanal" },
  { label: "Eventos processados", value: "18.420", trend: "92% tratados sem fila manual" },
  { label: "Tempo poupado", value: "137h", trend: "operação mais leve para o time" }
];

export const automations = [
  {
    id: "auto-01",
    name: "Comentário para DM automática",
    icon: "💬",
    trigger: "Comentário com palavra-chave na postagem",
    actions: ["Abre conversa na hora", "Responde com contexto", "Leva para o próximo passo"],
    status: "Ativa"
  },
  {
    id: "auto-02",
    name: "Qualificação comercial inicial",
    icon: "🤖",
    trigger: "Nova mensagem com intenção de compra",
    actions: ["Faz as primeiras perguntas", "Organiza o lead", "Entrega para a equipe certa"],
    status: "Ativa"
  },
  {
    id: "auto-03",
    name: "Reengajamento automático",
    icon: "🔁",
    trigger: "Contato sem resposta há 48h",
    actions: ["Retoma a conversa", "Reaquece o interesse", "Reposiciona no funil"],
    status: "Rascunho"
  }
];

export const inbox = [
  {
    id: "msg-01",
    origin: "WhatsApp",
    contact: "Marina Costa",
    text: "Oi, quero entender como automatizar o atendimento da minha clínica.",
    status: "Novo"
  },
  {
    id: "msg-02",
    origin: "Instagram",
    contact: "@studioalma",
    text: "Vi o vídeo e quero colocar isso no meu time comercial.",
    status: "Respondido"
  },
  {
    id: "msg-03",
    origin: "WhatsApp",
    contact: "Rafael Lopes",
    text: "Consigo automatizar a primeira triagem do atendimento?",
    status: "Em fila"
  }
];

export const timeline = [
  {
    title: "A mensagem chega",
    description: "O contato entra no canal certo e a conversa já começa organizada."
  },
  {
    title: "A Klio responde",
    description: "O bot faz a abertura, entende o interesse e conduz sem demora."
  },
  {
    title: "O lead é qualificado",
    description: "As informações principais ficam prontas para a próxima decisão."
  },
  {
    title: "Sua equipe assume no momento certo",
    description: "O repasse acontece só quando vale a pena entrar para fechar."
  }
];

export const resultSignals = [
  {
    icon: "⚡",
    label: "Primeira resposta",
    value: 72,
    prefix: "-",
    suffix: "%",
    detail: "A conversa começa mais rápido e o lead esfria menos."
  },
  {
    icon: "📈",
    label: "Leads aproveitados",
    value: 41,
    prefix: "+",
    suffix: "%",
    detail: "Mais contatos avançam porque a resposta chega na hora certa."
  },
  {
    icon: "⏱",
    label: "Tempo liberado",
    value: 137,
    suffix: "h",
    suffixAfterSpace: "mês",
    detail: "A equipe para de repetir tarefas e foca no que realmente converte."
  },
  {
    icon: "⭐",
    label: "Satisfação dos clientes",
    value: 98,
    suffix: "%",
    detail: "Atendimento consistente, humano e com respostas na medida certa."
  }
];

export const features = [
  {
    title: "Resposta mais rápida",
    description: "A Klio entra primeiro, responde na hora e tira o atendimento do modo manual."
  },
  {
    title: "Mais controle da operação",
    description: "Toda conversa avança com contexto, status e próximo passo bem definidos."
  },
  {
    title: "Escala sem inflar equipe",
    description: "Você cresce o volume do atendimento sem aumentar o time no mesmo ritmo."
  },
  {
    title: "IA com Claude integrada",
    description: "Modelos inteligentes para entender intenção e sugerir respostas certeiras."
  },
  {
    title: "Relatórios em tempo real",
    description: "Veja métricas de resposta, conversão e gargalos assim que acontecem."
  },
  {
    title: "Repasse inteligente para humanos",
    description: "A equipe entra só quando vale a pena e com toda a conversa organizada."
  }
];

export const plans = [
  {
    id: "start",
    name: "Start",
    monthlyPrice: 259.9,
    annualDiscount: 0,
    price: "R$ 259,90/mês",
    badge: "Entrada",
    highlight: false,
    billing: "Sem desconto anual",
    billingMonthly: "Sem desconto anual",
    audience: "Para quem está começando",
    description: "Estrutura essencial para sair do atendimento manual e ativar os primeiros fluxos.",
    checkoutEnabled: false,
    ctaLabel: "Escolher Start",
    features: [
      "1 canal: WhatsApp ou Instagram",
      "Até 3 automações simples",
      "Respostas automáticas básicas",
      "Templates limitados",
      "Dashboard simples",
      "Suporte básico"
    ],
    freeTrial: true,
    limitations: ["Sem campanhas automáticas"]
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 357.9,
    annualDiscount: 0.15,
    price: "R$ 357,90/mês",
    badge: "Escolha segura",
    highlight: false,
    billing: "15% OFF anual · 10% OFF parcelado",
    billingMonthly: "15% OFF anual · 10% OFF parcelado",
    audience: "Para pequenos negócios",
    description: "Melhor ponto para operar em dois canais com mais contexto e mais consistência.",
    checkoutEnabled: false,
    ctaLabel: "Escolher Starter",
    features: [
      "WhatsApp + Instagram",
      "Até 10 automações",
      "Fluxos personalizados",
      "Respostas inteligentes",
      "Métricas básicas",
      "Suporte padrão"
    ],
    freeTrial: true,
    limitations: []
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 597.9,
    annualDiscount: 0.2,
    price: "R$ 597,90/mês",
    badge: "Melhor custo-benefício",
    highlight: true,
    billing: "20% OFF anual · 10% OFF parcelado",
    billingMonthly: "20% OFF anual · 10% OFF parcelado",
    audience: "Para empresas em crescimento",
    description: "O plano mais forte para equipes que querem escala, campanhas e visão real da operação.",
    checkoutEnabled: false,
    ctaLabel: "Assinar Scale",
    features: [
      "Todos os canais principais",
      "Automações avançadas",
      "Segmentação de leads",
      "Campanhas automáticas",
      "Analytics e CRM",
      "Multiusuários e priorização"
    ],
    limitations: []
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    price: "Sob consulta",
    badge: "Sob medida",
    highlight: false,
    billing: "Projeto personalizado",
    billingMonthly: "Projeto personalizado",
    audience: "Para operações complexas",
    description: "Formato consultivo com infraestrutura dedicada, estratégia personalizada e suporte prioritário.",
    checkoutEnabled: false,
    ctaLabel: "Falar com vendas",
    features: ["Tudo do Scale", "Automações ilimitadas", "Infraestrutura dedicada", "Gerente de conta"],
    limitations: []
  }
];

