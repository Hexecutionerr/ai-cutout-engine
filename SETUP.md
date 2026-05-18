# Cutly AI — Setup Guide

Production-ready SaaS for AI background removal. The frontend, backend (Lovable Cloud / Supabase), and integration layer are fully built. To go live you only need to insert credentials.

## 1. Environment Variables

These are auto-managed by Lovable Cloud and don't need to be set:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Add these via Lovable Cloud → Secrets:

| Secret | Purpose |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account |
| `CLOUDINARY_API_KEY` | Signed uploads (server) |
| `CLOUDINARY_API_SECRET` | Signed uploads (server) |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset (fallback) |
| `AI_BG_PROVIDER` | `remove_bg` \| `clipdrop` \| `photoroom` (default `remove_bg`) |
| `REMOVE_BG_API_KEY` | https://www.remove.bg/api |
| `CLIPDROP_API_KEY` | https://clipdrop.co/apis |
| `PHOTOROOM_API_KEY` | https://www.photoroom.com/api |
| `RAZORPAY_KEY_ID` | Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Set when creating webhook |
| `N8N_WEBHOOK_SECRET` | Shared secret for n8n callbacks |
| `CRON_SECRET` | Shared secret for cleanup cron |

## 2. Razorpay Webhook

In Razorpay → Webhooks, add:
- URL: `https://project--224d401b-23d7-48f3-96b0-485512dbe08d.lovable.app/api/public/webhooks/razorpay`
- Events: `payment.captured`, `payment.failed`, `subscription.activated`, `subscription.charged`
- Secret: same value as `RAZORPAY_WEBHOOK_SECRET`

## 3. Public REST API

`POST /api/public/v1/remove-bg` — auth via `Authorization: Bearer ck_live_xxx`

```bash
curl https://project--224d401b-23d7-48f3-96b0-485512dbe08d.lovable.app/api/public/v1/remove-bg \
  -H "Authorization: Bearer $CUTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://example.com/photo.jpg"}'
```

API keys are created in Workspace → API Keys (full key shown once, only sha256 hash is stored).

## 4. n8n Integration

Importable workflow JSON: `n8n/workflows/cutly-batch.json`. Configure these credentials in n8n:
- Cutly API key (HTTP header `Authorization: Bearer <key>`)
- Webhook callback secret = `N8N_WEBHOOK_SECRET`

Callback URL: `/api/public/webhooks/n8n`

## 5. 24h Asset Cleanup (pg_cron)

Already scheduled by the migration. To install/refresh:

```sql
select cron.schedule(
  'cutly-cleanup-expired',
  '15 * * * *',
  $$ select net.http_post(
       url:='https://project--224d401b-23d7-48f3-96b0-485512dbe08d.lovable.app/api/public/hooks/cleanup-expired',
       headers:='{"Content-Type":"application/json","x-cron-secret":"<CRON_SECRET>"}'::jsonb,
       body:='{}'::jsonb
     ); $$
);
```

## 6. Promoting a User to Admin

```sql
insert into public.user_roles (user_id, role)
values ('<auth-user-uuid>', 'admin');
```

## 7. Architecture

- **Frontend:** TanStack Start + React 19 + Tailwind v4
- **DB / Auth / Storage:** Lovable Cloud (Supabase)
- **Server fns:** `src/server/*.functions.ts` (RPC) + `src/routes/api/public/**` (HTTP)
- **AI provider abstraction:** swap via `AI_BG_PROVIDER`
- **Asset CDN:** Cloudinary (originals + results)
- **Payments:** Razorpay Orders + signed webhook
- **Automation:** n8n via REST API + signed callback webhook
- **Cleanup:** pg_cron → `/api/public/hooks/cleanup-expired` every hour
