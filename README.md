<div align="center">

<img src="public/banner.png" alt="Cutly AI — Delete Distractions. Perfected by AI." width="100%" />

<br />
<br />

<a href="https://github.com/Hexecutionerr/ai-cutout-engine">
  <img src="https://img.shields.io/badge/GitHub-ai--cutout--engine-181717?style=for-the-badge&logo=github" />
</a>
<a href="https://github.com/Hexecutionerr/ai-cutout-engine/commits/main">
  <img src="https://img.shields.io/github/last-commit/Hexecutionerr/ai-cutout-engine?style=for-the-badge&logo=git&color=6e3af4" />
</a>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite" />
<img src="https://img.shields.io/badge/TanStack-Router-FF4154?style=for-the-badge&logo=react-query" />
<img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase" />
<img src="https://img.shields.io/badge/Razorpay-Payments-072654?style=for-the-badge&logo=razorpay" />
<img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel" />

<br />
<br />

> **Commercial-grade AI background removal in milliseconds.**  
> Edge-aware refining, hair-strand precision, a credit system, Razorpay payments, and a developer-first REST API — all in one cohesive product.

<br />

[![Live Demo →](https://img.shields.io/badge/🚀%20Live%20Demo-cutly.ai-6e3af4?style=for-the-badge)](https://ai-cutout-engine.vercel.app)

</div>

---

## 📸 Screenshots

| Landing Page | Workspace | History | Pricing |
|---|---|---|---|
| Glassmorphic hero with pricing preview, testimonials, FAQ | Drag-and-drop uploader, real-time AI processing, side-by-side comparison | Full upload history with analytics, download counts, credit usage | Free / Pro / Credits / Enterprise tiers with Razorpay checkout |

---

## ✨ Features

### 🧠 AI Core
- **Gemini 2.5 Flash Image API** — Google's latest multimodal model for pixel-perfect background segmentation
- Sub-pixel **feathering** and **edge-aware** hair-strand preservation
- Processes images up to **20 MB** (PNG, JPG, HEIC)

### 💳 Payments & Credits
- **Razorpay Standard Checkout** — Full UPI, Card, NetBanking, Wallet support
- Credit-based system with atomic deduction — credits only consumed on successful processing
- Plans: **Free (2 credits)**, **Pro ₹99/mo (10 credits)**, **Starter Credits Pack ₹29 (50 credits)**
- Razorpay webhook verification for payment confirmation

### 🔐 Authentication
- **Supabase Auth** — Email/password with magic link support
- JWT middleware for all server functions (`requireSupabaseAuth`)
- Auth callback route for OAuth flows
- Per-user Row Level Security (RLS) on all database tables

### 📊 Dashboard & History
- Real-time upload history with `processing_duration_ms`, `download_count`, and status tracking
- Credit analytics: credits used, remaining, and allocated
- Rename uploads, track downloads, view processing time

### 🛠️ Developer REST API
- Public endpoint: `POST /api/public/v1/remove-bg`
- API key management per user
- n8n webhook integration for async batch processing pipelines
- Auto-cleanup of expired processed images

### 🎨 Premium UI
- **Glassmorphism** design system with TailwindCSS v4
- Fully dark-mode, gradient text, animated glow buttons
- Responsive across mobile, tablet, desktop
- Page-level SEO meta tags + Open Graph

---

## 🏗️ Architecture

<img src="public/architecture.png" alt="Cutly AI System Architecture" width="100%" />

```
Browser (React 19 + TanStack Router)
        │
        ├─── /api/* routes ──────────────────> Vercel Edge Functions
        │         │
        │         ├── POST /rpc/processBackgroundRemoval ──> Gemini 2.5 Flash API
        │         ├── POST /rpc/saveUpload ──────────────── Supabase PostgreSQL
        │         ├── POST /rpc/createRazorpayOrder ───────> Razorpay Orders API
        │         └── POST /api/public/webhooks/razorpay ──> Payment confirmation
        │
        └─── Supabase (Auth + DB + RLS)
                  │
                  ├── auth.users
                  ├── uploads (RLS per user)
                  ├── credits (RLS per user)
                  ├── subscriptions
                  └── api_keys
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript 5.8 | Core UI framework |
| **Build Tool** | Vite 7 | Lightning-fast HMR dev server + production bundler |
| **Routing** | TanStack Router (File-based) | Type-safe URL state management, SSR-capable routing |
| **Styling** | Tailwind CSS v4 + tw-animate-css | Utility-first design system with JIT compilation |
| **UI Components** | Radix UI (shadcn/ui) | Accessible, headless component primitives |
| **Auth** | Supabase Auth | JWT authentication, RLS, OAuth support |
| **Database** | Supabase PostgreSQL | Uploads, credits, subscriptions, API keys |
| **Client Cache** | IndexedDB / localStorage (local-db.ts) | Offline-capable workspace + history persistence |
| **AI Engine** | Gemini 2.5 Flash Image via Lovable Gateway | Background removal inference |
| **Payments** | Razorpay Standard Checkout | INR payments, UPI, cards, wallets |
| **Webhooks** | n8n (self-hosted) + Razorpay | Async processing callbacks & payment confirmation |
| **Deployment** | Vercel Edge Functions | Serverless deployment with global CDN |
| **Server Layer** | TanStack Start RPC (`.server.ts` / `.functions.ts`) | Type-safe server functions with auth middleware |
| **Validation** | Zod | Runtime schema validation on all RPC inputs |
| **State** | TanStack Query | Server state management, caching, refetch |

---

## 📁 Project Structure

```
ai-cutout-studio/
├── src/
│   ├── components/
│   │   ├── app/            # AppSidebar, navigation
│   │   ├── auth/           # AuthGate component
│   │   ├── history/        # HistoryUploadCard
│   │   ├── marketing/      # MarketingHeader, MarketingFooter
│   │   └── ui/             # Radix UI / shadcn components
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx         # Supabase auth state hook
│   │   └── useAuthServerFn.ts  # Server-side auth helper
│   │
│   ├── integrations/supabase/
│   │   ├── auth-middleware.ts  # requireSupabaseAuth middleware
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── client.server.ts    # Server-side Supabase client (service role)
│   │   └── types.ts            # Auto-generated DB types
│   │
│   ├── lib/
│   │   ├── credits.ts          # Credit constants and plan defaults
│   │   ├── format-duration.ts  # Processing time formatter
│   │   ├── local-db.ts         # IndexedDB client cache (Dexie-like)
│   │   ├── razorpay-checkout.ts# Razorpay SDK integration
│   │   └── upload-history.ts   # Upload history utilities
│   │
│   ├── rpc/                    # Server-side RPC layer
│   │   ├── uploads.functions.ts    # processBackgroundRemoval, saveUpload, recordDownload
│   │   ├── razorpay.server.ts      # createRazorpayOrder server fn
│   │   ├── billing.functions.ts    # Subscription management
│   │   ├── api-keys.functions.ts   # API key CRUD
│   │   ├── admin.functions.ts      # Admin dashboard data
│   │   ├── ai-bg.server.ts         # AI background removal helper
│   │   └── cloudinary.server.ts    # Cloudinary upload (optional CDN)
│   │
│   └── routes/
│       ├── index.tsx           # Landing page (Hero, Features, FAQ, CTA)
│       ├── app.workspace.tsx   # Main upload + processing workspace
│       ├── app.history.tsx     # Upload history + analytics dashboard
│       ├── app.billing.tsx     # Subscription + credit management
│       ├── app.admin.tsx       # Admin panel
│       ├── app.api-keys.tsx    # API key management
│       ├── pricing.tsx         # Pricing page with Razorpay checkout
│       ├── login.tsx           # Auth pages
│       ├── register.tsx
│       ├── auth.callback.tsx   # OAuth callback handler
│       ├── api-docs.tsx        # Public API documentation
│       └── api/public/         # Public REST API endpoints
│           ├── v1/remove-bg.ts
│           ├── webhooks/n8n.ts
│           ├── webhooks/razorpay.ts
│           └── hooks/cleanup-expired.ts
│
├── supabase/
│   ├── config.toml
│   └── migrations/             # PostgreSQL migration files
│
├── vercel-build.mjs            # Custom Vercel build script
├── vercel.json                 # Vercel rewrite rules
├── vite.config.ts              # Vite + TanStack plugin config
└── .env                        # Local environment (git-ignored ✅)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ / Bun
- A [Supabase](https://supabase.com) project
- A [Razorpay](https://razorpay.com) account (test mode works)

### 1. Clone & Install

```bash
git clone https://github.com/Hexecutionerr/ai-cutout-engine.git
cd ai-cutout-engine
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
# Supabase
SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"   # Server only — never expose!
VITE_SUPABASE_PROJECT_ID="your-project-id"

# Razorpay
VITE_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

> ⚠️ **Never commit `.env` to git.** It is already listed in `.gitignore`.

### 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Apply Database Migrations

```bash
npx supabase db push
```

---

## ☁️ Deployment (Vercel)

This project is configured for **Vercel** with TanStack Start's serverless adapter.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hexecutionerr/ai-cutout-engine)

### Manual Deploy

```bash
npm run vercel-build   # Custom build script
vercel --prod
```

### Required Vercel Environment Variables

Set all variables from `.env` in your **Vercel Project → Settings → Environment Variables**. The most critical ones are:

| Variable | Required | Notes |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only, never expose to browser |
| `RAZORPAY_KEY_SECRET` | ✅ | For order creation server-side |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | For webhook signature verification |
| `VITE_RAZORPAY_KEY_ID` | ✅ | Exposed to browser for checkout SDK |
| `SUPABASE_URL` + `VITE_SUPABASE_URL` | ✅ | Both needed for client + server |

---

## 🔌 Public REST API

```http
POST /api/public/v1/remove-bg
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "imageUrl": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "ok": true,
  "resultUrl": "data:image/png;base64,..."
}
```

Full API documentation is available at `/api-docs` in the app.

---

## 🗄️ Database Schema (Supabase)

```sql
-- Core tables
uploads       -- id, user_id, filename, original_url, result_url, status, credits_used, download_count
credits       -- id, user_id, delta, reason, reference
subscriptions -- id, user_id, plan, status, monthly_credits, current_period_end
api_keys      -- id, user_id, key_hash, name, last_used_at, requests_count

-- RPC functions
credit_balance(_user_id uuid) → integer
```

All tables are protected by **Row Level Security (RLS)** — users can only access their own data.

---

## 🧰 n8n Webhook Integration

The app supports async processing via n8n:

1. Client uploads image → `POST /api/public/webhooks/n8n`
2. n8n processes the image asynchronously
3. n8n POSTs result back to the callback URL
4. Result URL is stored in `uploads` table

Workflow JSON is in `n8n/workflows/cutly-batch.json`.

---

## 🔒 Security

- ✅ `.env` is git-ignored — no secrets in the repository
- ✅ `SUPABASE_SERVICE_ROLE_KEY` is server-only (never in `VITE_` prefix)
- ✅ Razorpay webhook signature verified with HMAC-SHA256
- ✅ All RPC mutations go through `requireSupabaseAuth` middleware
- ✅ API keys are stored as hashed values
- ✅ RLS enforced on all database tables

---

## 📦 Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run vercel-build # Vercel-specific build (with adapter)
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm run format       # Prettier format
```

---

## 🗺️ Roadmap

- [ ] Cloudflare R2 storage for processed images (no data URL size limits)
- [ ] Batch upload UI (drag multiple files)
- [ ] Figma plugin integration
- [ ] White-label API reseller tier
- [ ] Stripe payments (international cards)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 Legal

- [Terms of Service](/terms)
- [Privacy Policy](/privacy)
- [Refund Policy](/refund)
- [Shipping Policy](/shipping)

---

<div align="center">

## 👨‍💻 Author

<img src="https://avatars.githubusercontent.com/Hexecutionerr" width="80" style="border-radius:50%" />

**Hasnain Khan**  
*Full-Stack Developer & AI Integrations*

[![GitHub](https://img.shields.io/badge/GitHub-Hexecutionerr-181717?style=for-the-badge&logo=github)](https://github.com/Hexecutionerr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hasnain%20Khan-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/hasnain-khan-0ab3b2320)

<br />

*Built end-to-end with React 19, TanStack, Supabase, Razorpay, and Gemini AI.*

*If you find this project helpful, please ⭐ star the repository!*

</div>
