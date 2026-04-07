# Checklist de env de producao da Klio

Use esta lista quando for preencher as plataformas.

## Vercel

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `META_VERIFY_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `MERCADO_PAGO_ACCESS_TOKEN` se usar Mercado Pago
- `ASAAS_API_KEY` se usar Asaas
- `ASAAS_BASE_URL` se usar Asaas
- `ASAAS_DEFAULT_CUSTOMER_ID` se usar Asaas
- `PIX_RECEIVER_NAME`
- `PIX_RECEIVER_KEY`
- `WORKER_POLL_MS` opcional no app

## Railway

- `DATABASE_URL`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `WORKER_POLL_MS`

## Neon

- gerar a `DATABASE_URL`
- gerar a `DIRECT_DATABASE_URL`
- manter SSL habilitado
- usar database de producao separada de testes

## Depois de preencher

No ambiente local ou CI:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
```
