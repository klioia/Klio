# Deploy seguro da Klio

Stack recomendado para lancamento rapido e mais seguro:

- `Vercel` para o app Next.js
- `Neon` para PostgreSQL
- `Railway` para o worker da fila
- `Cloudflare` no dominio, se quiser camada extra de DNS e protecao

## 1. Banco em producao

Crie um banco PostgreSQL no Neon e copie a connection string.

Variavel obrigatoria:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`

Depois, no projeto:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```

## 2. App no Vercel

No Vercel:

1. Importar o repositorio/projeto
2. Definir framework `Next.js`
3. Adicionar as variaveis de ambiente
4. Fazer deploy

Variaveis recomendadas no Vercel:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `META_VERIFY_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `MERCADO_PAGO_ACCESS_TOKEN` ou `ASAAS_API_KEY`
- `ASAAS_BASE_URL`
- `ASAAS_DEFAULT_CUSTOMER_ID`
- `PIX_RECEIVER_NAME`
- `PIX_RECEIVER_KEY`

## 3. Worker no Railway

O worker deve rodar separado do app.

Arquivos ja preparados:

- [railway.json](C:\Users\DELL\Documents\New project\railway.json)
- [scripts/queue-worker.mjs](C:\Users\DELL\Documents\New project\scripts\queue-worker.mjs)

No Railway:

1. Criar novo projeto
2. Apontar para o mesmo codigo
3. Subir com o comando `npm.cmd run worker`
4. Repetir as mesmas envs essenciais do app

Variaveis minimas do worker:

- `DATABASE_URL`
- `WORKER_POLL_MS`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`

## 4. URLs de producao

Depois do deploy:

- defina `NEXT_PUBLIC_APP_URL` com a URL publica do app
- use essa URL para webhook da Meta
- valide o healthcheck em `/api/health`

Observacao importante sobre Neon:

- `DATABASE_URL`: use a conexao `pooled` no app
- `DIRECT_DATABASE_URL`: use a `direct connection` para o Prisma

## 5. Checklist de seguranca

- usar credenciais de producao separadas das de desenvolvimento
- nunca expor tokens no frontend
- manter `NODE_ENV=production`
- usar dominio com `HTTPS`
- revisar `verify token` da Meta
- proteger todas as rotas internas com sessao

## 6. Checklist antes de abrir para cliente

- app publicado no Vercel
- banco publicado no Neon
- worker ativo no Railway
- login funcionando
- automacao salva no banco
- webhook validado
- envio de teste funcionando
- rota [api/health](C:\Users\DELL\Documents\New project\app\api\health\route.ts) respondendo `ok: true`
