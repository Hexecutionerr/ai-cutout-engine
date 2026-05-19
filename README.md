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

> **High-performance AI background removal in milliseconds.**  
> Built with React 19, TanStack Start, Supabase Auth/DB, native IndexedDB caching, Razorpay Payments, and Gemini 2.5 Flash.

<br />

[![Live Link →](https://img.shields.io/badge/🚀%20Live%20Link-ai--cutout--engine.vercel.app-6e3af4?style=for-the-badge&logo=vercel)](https://ai-cutout-engine.vercel.app)

</div>

---

## 📺 Project Walkthrough

<div align="center">
  <img src="public/demo.webp" alt="Cutly AI App Walkthrough Demo" width="90%" style="border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);" />
</div>

---

## ✨ Verified Features

### 🧠 Multimodal AI core
* **Gemini 2.5 Flash Image Model** (`google/gemini-2.5-flash-image-preview` via Lovable API gateway) for background extraction.
* Preserves complex image edges (hair strands, fur, semi-transparency) using customized prompting.
* Accepts drag-and-drop images (PNG, JPG, HEIC) up to 20MB.

### 💳 Credit Billing & Razorpay Integration
* **Razorpay Checkout SDK** loaded on client for payments supporting UPI, Cards, NetBanking, and Wallets.
* **Credit-based usage**: 1 credit consumed per successful background removal.
* **Tiers & catalog**:
  * Free Pack: 2 credits (guest / registration default)
  * Pro Subscription: ₹99/mo (10 credits, recurring)
  * Starter Credits Pack: ₹29 (50 credits, one-time)
* **Razorpay webhook** endpoint (`/api/public/webhooks/razorpay`) with HMAC-SHA256 signature verification to process credit allocations.

### 🔐 Double-Sided Authentication & RLS
* **Supabase Auth** integration for user signup, login, session validation, and logout.
* **Type-Safe Auth Middleware** (`requireSupabaseAuth`) built with TanStack Start to protect all server RPC actions.
* Database security enforced with strict **Row Level Security (RLS)** in PostgreSQL (users can only access their own uploads and billing logs).

### 💾 Hybrid Client & Server State
* **Native IndexedDB Wrapper** (`local-db.ts`) handles offline caching and guest mode uploads.
* Guest users can process backgrounds locally and retrieve historical logs from local storage without logging in.
* Authenticated users get database persistence and real-time syncing between their online dashboard and local state.
* **Dashboard Analytics**: Tracks total processed files, credits remaining, average processing speed, and total downloads.

### 🔌 Developer REST API & n8n webhook
* **Public endpoint**: `POST /api/public/v1/remove-bg` with `Authorization: Bearer <api-key>`.
* **API Key CRUD**: Generate, view, and revoke API keys via the workspace settings dashboard.
* **n8n Async Webhook**: Integrates with custom self-hosted n8n workflows (`n8n/workflows/cutly-batch.json`) for handling asynchronous batch image cutouts.

---

## 🏗️ Architecture

<img src="public/architecture.png" alt="Cutly AI System Architecture" width="100%" />

---

## 🛠️ Verified Tech Stack

| Component | Library/Service | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript 5.8 | UI development with strict typing |
| **Framework** | TanStack Start | SSR & Type-Safe Server Functions (RPC) |
| **Routing** | TanStack Router | File-based, type-safe navigation and head meta |
| **Bundler** | Vite 7 | Fast build server and HMR pipeline |
| **Database & Auth** | Supabase | PostgreSQL storage, User Auth, RLS Policies |
| **AI Inference** | Gemini 2.5 Flash | Image-to-image foreground segmentations |
| **Payments** | Razorpay SDK | Payment gateway and order routing |
| **Local Cache** | Native IndexedDB API | Offline state database |
| **Validation** | Zod | Server Function schema and payload validations |
| **Styling** | Tailwind CSS v4 + Radix UI | Dark-mode, glassmorphic layout, fluid animations |

---

## 📁 Key File Map

```
ai-cutout-studio/
├── src/
│   ├── components/
│   │   ├── auth/AuthGate.tsx           # Protects routes requiring user authentication
│   │   ├── history/HistoryUploadCard.tsx# History layout with analytics card
│   │   └── app/AppSidebar.tsx          # Sidebar layout configuration
│   │
│   ├── lib/
│   │   ├── local-db.ts                 # Native IndexedDB wrapper for guest mode
│   │   ├── razorpay-checkout.ts        # Client Razorpay checkout invocation logic
│   │   └── credits.ts                  # Billing tier default constants
│   │
│   ├── integrations/supabase/
│   │   ├── auth-middleware.ts          # requireSupabaseAuth check middleware
│   │   └── client.server.ts            # Server-side Supabase client initialization
│   │
│   ├── rpc/                            # Server RPC Function Layer
│   │   ├── uploads.functions.ts        # Gemini processing, db save, download tracking
│   │   └── razorpay.server.ts          # Razorpay order creator + verification logic
│   │
│   └── routes/
│       ├── index.tsx                   # Marketing landing page
│       ├── app.workspace.tsx           # Main workspace UI (drag-drop, slider, processing)
│       ├── app.history.tsx             # History tab UI (offline/online mode switcher)
│       ├── app.billing.tsx             # Plans and credits configuration
│       ├── app.api-keys.tsx            # API key generation panel
│       ├── pricing.tsx                 # Pricing overview & checkout trigger
│       ├── api-docs.tsx                # REST API interactive documentation
│       └── api/public/                 # Public webhooks and REST endpoints
│           ├── v1/remove-bg.ts         # User API endpoints
│           └── webhooks/razorpay.ts    # Razorpay payment listener
```

---

## 🚀 Deployed on Vercel

The application is deployed live using **Vercel Serverless Functions**:

🔗 **Production URL**: [https://ai-cutout-engine.vercel.app](https://ai-cutout-engine.vercel.app)

### Environment Variables required in Vercel
Set these in your Vercel Dashboard (**Project Settings > Environment Variables**):

```env
# Supabase Configuration
SUPABASE_URL="https://your-supabase.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Gateway Configuration
LOVABLE_API_KEY="your-lovable-gateway-api-key"
```

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
