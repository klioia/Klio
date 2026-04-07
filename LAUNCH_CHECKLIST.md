# Launch Checklist Klio

Checklist objetivo para deixar a Klio pronta para lancar em ate 2 semanas.

## Bloco 1. Produto que vende

- Revisar a landing e garantir que os planos `Start`, `Starter`, `Scale` e `Enterprise` estejam coerentes.
- Validar o checkout em [app/checkout/page.tsx](C:\Users\DELL\Documents\New project\app\checkout\page.tsx) para todos os planos com compra ativa.
- Definir o canal comercial oficial do plano `Enterprise`.
- Trocar o link placeholder de atendimento comercial por WhatsApp real ou pagina de vendas real.

## Bloco 2. Operacao real

- Configurar `.env.local` a partir de [.env.example](C:\Users\DELL\Documents\New project\.env.example).
- Ativar `DATABASE_URL`.
- Rodar:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```

- Configurar o provider de Pix real.
- Configurar credenciais reais de WhatsApp e Instagram na tela [app/integrations/page.tsx](C:\Users\DELL\Documents\New project\app\integrations\page.tsx).
- Validar o webhook Meta em [app/api/meta/webhook/route.ts](C:\Users\DELL\Documents\New project\app\api\meta\webhook\route.ts).

## Bloco 3. Deploy

- Rodar build de producao:

```powershell
npm.cmd run build
```

- Subir o app com:

```powershell
npm.cmd run start
```

- Validar o endpoint de saude em [app/api/health/route.ts](C:\Users\DELL\Documents\New project\app\api\health\route.ts).
- Validar login, dashboard, integracoes, checkout e worker.
- Confirmar que o worker esta rodando com:

```powershell
npm.cmd run worker
```

## Bloco 4. Go-live

- Fazer um teste ponta a ponta:
  - gerar Pix
  - enviar mensagem de teste
  - criar automacao
  - disparar automacao
  - processar 2a etapa
- Preparar suporte inicial e respostas padrao para primeiros clientes.
- Registrar bugs encontrados nos primeiros 3 dias.

## Pos-lancamento

- RBAC e equipe
- funil visual com multiplas etapas
- analytics avancado
- CRM mais robusto
- billing recorrente mais completo
