# Klio

Base inicial de um SaaS para automacao de mensagens com WhatsApp, Instagram e checkout Pix.

## O que ja foi montado

- Landing page com proposta comercial clara
- Login interno com sessao por cookie
- Cadastro via API para onboarding inicial
- Dashboard SaaS com caixa de entrada, KPIs e construtor de fluxo
- Persistencia local de usuarios, leads, automacoes e integracoes em arquivos JSON
- Estrutura Prisma para migracao para PostgreSQL
- Estrutura inicial para tenant/multiempresa no banco
- Checkout Pix com visual premium
- Endpoint para webhook da Meta
- Endpoint para envio de mensagens
- Endpoint para geracao de cobranca Pix
- Estrutura preparada para integrar WhatsApp Business API e Instagram Messaging

## Rotas

- `/` landing page
- `/dashboard` painel interno
- `/login` acesso ao painel
- `/register` onboarding da empresa
- `/leads` gestao de leads
- `/automations` biblioteca de fluxos
- `/executions` historico de disparos
- `/scheduled` fila de 2a etapa
- `/worker` estado do processador backend
- `/integrations` status das integracoes
- `/checkout` checkout Pix
- `/api/auth/login` login
- `/api/auth/register` cadastro
- `/api/auth/logout` logout
- `/api/leads` leitura/cadastro de leads
- `/api/automations` leitura/cadastro de automacoes
- `/api/automations/execute` teste manual de fluxo
- `/api/automations/process` processa etapas agendadas vencidas
- `/api/integrations` leitura de status das integracoes
- `/api/meta/webhook` webhook GET/POST
- `/api/messages` envio de mensagens
- `/api/checkout/pix` geracao de Pix
- `/api/health` healthcheck para deploy e monitoramento basico

## Como rodar

Se o PowerShell bloquear `npm`, rode os comandos com `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

## Banco de dados de producao

Quando quiser sair do modo local em JSON e usar PostgreSQL:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```

O schema Prisma fica em [prisma/schema.prisma](C:\Users\DELL\Documents\New project\prisma\schema.prisma).

No modo banco, a modelagem agora inclui:
- `Tenant`
- `User`
- `Lead`
- `Automation`
- `Execution`
- `ScheduledJob`
- `IntegrationConfig`
- `PixCheckout`

Sempre que alterar o schema Prisma, rode:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `DATABASE_URL`
- `META_APP_ID`
- `META_APP_SECRET`
- `META_VERIFY_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `ASAAS_API_KEY`
- `ASAAS_BASE_URL`
- `ASAAS_DEFAULT_CUSTOMER_ID`
- `PIX_RECEIVER_NAME`
- `PIX_RECEIVER_KEY`
- `NEXT_PUBLIC_APP_URL`
- `WORKER_POLL_MS`

## Acesso inicial

- Email: `admin@klio.local`
- Senha: `123456`

## Observacoes importantes

- WhatsApp para SaaS serio deve usar `WhatsApp Business Cloud API`.
- Instagram exige conta profissional conectada ao ecossistema da Meta.
- O envio de DM do Instagram depende do setup correto do app na Meta e das permissoes aprovadas.
- O modulo Pix usa `mock` por padrao, mas ja esta preparado para Mercado Pago ou Asaas em [lib/pix.ts](C:\Users\DELL\Documents\New project\lib\pix.ts).
- No Asaas, voce precisa de um `customer id` valido para emitir cobrancas Pix.
- Sem `DATABASE_URL`, o projeto continua funcionando com persistencia local em JSON.
- O MVP de automacao agora permite salvar fluxo, testar manualmente e processar webhook por palavra-chave ou nova mensagem.
- O fluxo agora aceita 2a etapa opcional com delay logico e registra historico de execucoes.
- A 2a etapa agora entra em uma fila agendada local e pode ser processada pela rota de processamento.
- O dashboard e a tela de agendados agora permitem processar pendencias direto pela interface.
- O auto-processamento atual roda no navegador enquanto o painel estiver aberto; para producao, o ideal e usar cron/worker no servidor.
- A tela `/integrations` agora permite salvar credenciais reais de WhatsApp, Instagram e Pix pela interface.
- A tela `/integrations` agora funciona como onboarding guiado da Meta, com checklist, webhook URL e verify token para copiar.

## Worker backend da fila

Para processar a fila sem depender do navegador:

```powershell
npm.cmd run worker
```

Para rodar apenas uma rodada:

```powershell
npm.cmd run worker:once
```

Sem `DATABASE_URL`, o worker le a fila local em `data/scheduled-jobs.json`, grava execucoes em `data/executions.json` e atualiza o estado em `data/worker-state.json`.

Com `DATABASE_URL`, o worker passa a ler `ScheduledJob` e gravar `Execution` no PostgreSQL, mantendo `data/worker-state.json` apenas como painel simples de status local.

## Integracao real pela interface

Use [app/integrations/page.tsx](C:\Users\DELL\Documents\New project\app\integrations\page.tsx) para:
- salvar `Phone Number ID`, `Access Token` e `Verify Token` do WhatsApp
- salvar `App ID`, `Access Token` e `Verify Token` do Instagram
- salvar provider e token do Pix
- enviar mensagem de teste pelo proprio painel

Fluxo recomendado:
1. Conectar credenciais na tela `Integracoes`.
2. Testar conexao do canal.
3. Enviar uma mensagem de teste.
4. Criar um fluxo na tela `Dashboard`.
5. Executar teste manual ou receber evento pelo webhook.

## Proximos passos recomendados

1. Instalar dependencias e subir o app localmente.
2. Configurar `DATABASE_URL` e aplicar o schema Prisma.
3. Ligar um provedor real de Pix com suas credenciais.
4. Configurar webhooks reais da Meta para WhatsApp e Instagram.
5. Evoluir o construtor visual de funis com etapas, espera e condicionais.

## Reta final de lancamento

Use o checklist em [LAUNCH_CHECKLIST.md](C:\Users\DELL\Documents\New project\LAUNCH_CHECKLIST.md) para conduzir as proximas duas semanas com foco em:
- conversao comercial
- deploy
- operacao do worker
- integracoes reais

## Deploy seguro

Use [DEPLOY.md](C:\Users\DELL\Documents\New project\DEPLOY.md) para publicar a Klio com:
- `Vercel` no app
- `Neon` no banco
- `Railway` no worker

Use tambem [PRODUCTION_ENV_CHECKLIST.md](C:\Users\DELL\Documents\New project\PRODUCTION_ENV_CHECKLIST.md) para preencher as variaveis sem esquecer nada.
