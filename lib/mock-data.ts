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
    trigger: "Comentário com palavra-chave na postagem",
    actions: ["Abre conversa na hora", "Responde com contexto", "Leva para o próximo passo"],
    status: "Ativa"
  },
  {
    id: "auto-02",
    name: "Qualificação comercial inicial",
    trigger: "Nova mensagem com intenção de compra",
    actions: ["Faz as primeiras perguntas", "Organiza o lead", "Entrega para a equipe certa"],
    status: "Ativa"
  },
  {
    id: "auto-03",
    name: "Reengajamento automático",
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
    label: "Primeira resposta",
    value: "-72%",
    detail: "A conversa começa mais rápido e o lead esfria menos."
  },
  {
    label: "Leads aproveitados",
    value: "+41%",
    detail: "Mais contatos avançam porque a resposta chega na hora certa."
  },
  {
    label: "Tempo liberado",
    value: "137h",
    detail: "A equipe para de repetir tarefas e foca no que realmente converte."
  }
];

export const landingProof = [
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
  }
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
    audience: "Para quem está começando",
    description: "Estrutura essencial para sair do atendimento manual e ativar os primeiros fluxos.",
    checkoutEnabled: true,
    ctaLabel: "Escolher Start",
    features: ["1 canal: WhatsApp ou Instagram", "Até 3 automações simples", "Respostas automáticas básicas", "Dashboard simples"],
    limitations: ["Sem campanhas automáticas"]
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 357.9,
    price: "R$ 357,90/mês",
    badge: "Escolha segura",
    highlight: false,
    billing: "15% OFF anual · 10% OFF parcelado",
    audience: "Para pequenos negócios",
    description: "Melhor ponto para operar em dois canais com mais contexto e mais consistência.",
    checkoutEnabled: true,
    ctaLabel: "Escolher Starter",
    features: ["WhatsApp + Instagram", "Até 10 automações", "Fluxos personalizados", "Métricas básicas"],
    limitations: []
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 597.9,
    price: "R$ 597,90/mês",
    badge: "Melhor custo-benefício",
    highlight: true,
    billing: "20% OFF anual · 10% OFF parcelado",
    audience: "Para empresas em crescimento",
    description: "O plano mais forte para equipes que querem escala, campanhas e visão real da operação.",
    checkoutEnabled: true,
    ctaLabel: "Assinar Scale",
    features: ["Todos os canais principais", "Automações avançadas", "Segmentação de leads", "Analytics e CRM"],
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
    audience: "Para operações complexas",
    description: "Formato consultivo com infraestrutura dedicada, estratégia personalizada e suporte prioritário.",
    checkoutEnabled: false,
    ctaLabel: "Falar com vendas",
    features: ["Tudo do Scale", "Automações ilimitadas", "Infraestrutura dedicada", "Gerente de conta"],
    limitations: []
  }
];

