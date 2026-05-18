<div align="center">
  <img src="https://via.placeholder.com/150x150/000000/FFFFFF?text=AI+Cutout" alt="AI Cutout Studio Logo" width="120" height="120" />
  <h1>🚀 AI Cutout Studio</h1>
  <p><strong>Next-Generation AI-Powered Background Removal Engine</strong></p>
  
  <p>
    <a href="https://github.com/Hexecutionerr"><img src="https://img.shields.io/badge/Author-Hasnain%20Khan-blue?style=for-the-badge&logo=github" alt="Author" /></a>
    <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  </p>
</div>

---

## ⚡ Overview

**AI Cutout Studio** is an enterprise-grade web application engineered to instantly and flawlessly remove backgrounds from images using advanced AI models. Built with a modern, high-performance tech stack, it provides an ultra-fast, seamless experience for creators, designers, and developers.

By leveraging client-side persistence mechanisms, asynchronous webhook processing, and an optimized rendering pipeline, the application ensures zero data loss, instant feedback loops, and a world-class user interface.

## ✨ Core Features

- 🧠 **AI Background Removal**: Integrates with robust machine learning endpoints via webhooks for pixel-perfect segmentation.
- 💾 **State Persistence Architecture**: Utilizes IndexedDB/Local Storage caching mechanisms (via Dexie.js) to persist workspaces and processing history securely on the client.
- ⚡ **High-Performance RPC**: Re-architected server-side functions into an efficient RPC (Remote Procedure Call) layer, fully decoupling the client from complex backend infrastructure.
- 🎨 **Glassmorphic & Premium UI**: Designed with Tailwind CSS, utilizing modern visual paradigms like glassmorphism, fluid typography, and micro-animations.
- 🛡️ **Type-Safe Routing**: Implements TanStack Router for end-to-end type-safe URL state management and seamless client-side navigation.

## 🛠️ Architecture & Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Routing**: TanStack Router (File-based, Type-safe)
- **Styling**: Tailwind CSS (with arbitrary variants and JIT)
- **Data Persistence**: IndexedDB / Local Storage for robust offline-capable history
- **API & Webhooks**: Custom webhook integrations for asynchronous AI processing and Razorpay payment hooks.

## 💻 Development & Deployment

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Hexecutionerr/ai-cutout-studio.git

# 2. Install dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

### Build for Production

```bash
# Compiles the application and generates static assets
npm run build
```

## 🏗️ Recent Engineering Enhancements

- **Refactored Backend to RPC**: Completely eliminated SSR constraints by migrating traditional `server/*` logic to isolated `rpc/*` modules, optimizing client-side build speed and reliability.
- **Implemented Local Database**: Engineered a resilient `local-db.ts` caching layer that synchronizes UI state across the workspace and history tabs without relying on synchronous database reads.
- **Webhook Integration**: Established stable ingestion endpoints for AI process callbacks and payments.

---

## 👨‍💻 Author

**Hasnain Khan**  
*Lead Developer & Architect*

- [GitHub](https://github.com/Hexecutionerr)
- [LinkedIn](https://www.linkedin.com/in/hasnain-khan-0ab3b2320)
