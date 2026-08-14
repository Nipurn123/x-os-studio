# Product Requirements Document (PRD)

## Project: X-OS Studio AI Agent Assistant (Powered by Gemini 3.7 Flash)

**Status**: Ready for Specification  
**Version**: 1.0.0  
**Date**: August 14, 2026  
**Primary Target Stack**: Next.js 15 (App Router, API Routes), TypeScript, Tailwind CSS, Framer Motion, Google Generative AI (Gemini 3.7 Flash API)  
**Deployment**: Google Cloud Run (`https://x.100xprompt.com`)  
**Theme & Aesthetic**: Deep Obsidian Acrylic Glass (`#0b0e17`, frosted glass backdrop, glowing emerald/cyan neon accents)  

---

## 1. Executive Summary & Objective

Provide an intelligent, conversational **AI Agent Assistant** directly inside X-OS Studio at `x.100xprompt.com`. 

The agent acts as an authoritative, senior X recommendation systems engineer capable of answering any technical, architectural, or growth question regarding the open-source X recommendation engine (including Phoenix Transformer, Thunder, SimClusters, Visibility Filtering, User-Cred-v2, and ranking multipliers).

---

## 2. Core Capabilities & Architecture

### 2.1 UI Placement & Interaction (macOS AI Drawer / Siri Copilot Style)
- **Dock Icon & Header Button**: Dedicated AI Agent icon in the macOS Sonoma Dock and top navigation bar.
- **Quick Activation**: Accessible via global shortcut (`Cmd+K` / `Ctrl+K`) or floating activation button.
- **Floating Obsidian Drawer**: Slides smoothly from the right side of the screen with frosted glass backdrop (`backdrop-blur-xl`, `bg-black/80`, `border-white/10`), expandable/collapsible, and draggable.
- **Pre-Prompt Quick Chips**:
  - *"Why are outbound links downranked by 80%?"*
  - *"Explain the Phoenix Two-Tower retrieval process."*
  - *"How does the +20.0 mutual conversation boost work?"*
  - *"What happens when a tweet receives a report (-234.0)?"*
  - *"Audit my tweet for maximum reach."*

### 2.2 Model Backend & Context Grounding (Gemini 3.7 Flash)
- **Model**: `gemini-3.7-flash` (or `gemini-2.5-flash` with fallback) via Google Generative AI REST / SDK endpoint.
- **Full Algorithm Knowledge Base Injected**:
  - Exact production ranking weights (`ShareViaCopyLink +20.0`, `BidirectionalFollowReplyBoost +15.0`, `Reply +5.0`, `Favorite +0.5`, `Report -234.0`).
  - Subsystem architectures: `phoenix`, `thunder`, `simclusters`, `visibility-filtering`, `user-cred-v2`, `media-model-proxy`, `agatha`, `bdsm`.
  - The 5-Stage Recommendation Pipeline: Sourcing (500M) $\to$ Hydration $\to$ Filtering $\to$ Phoenix Scoring $\to$ DPP Diversity (Top 20).
  - Selected file context: Dynamically sends the currently inspected file in the decompiler if the user is browsing code.
- **Real-Time Streaming Responses**: Chunked server-sent streaming (`ReadableStream`) for instant typing feedback.

### 2.3 User Experience & Tooling
- **Interactive Markdown & Code Blocks**: Syntax-highlighted code snippets, clickable file links that jump directly to the file in the Decompiler app.
- **Copy & Share Responses**: 1-click copy for explanations and recommendations.
- **Context Clear / Reset**: Quick session reset button with token/message management.

---

## 3. Scope Boundaries

### In Scope
- Streaming API route `/api/agent/chat` communicating securely with Gemini 3.7 Flash using `GEMINI_API_KEY`.
- Built-in fallback knowledge base so the agent continues answering even if offline or without an API key provided.
- `AIAgentDrawer.tsx` component with full macOS Sonoma animations, theme synchronization (Dark Obsidian / Light Aluminum).
- Dock integration and TopBar quick-launch toggle.
- Citation links that open files directly in the Decompiler.

### Out of Scope
- Voice input / TTS (can be added in future milestone).
- Direct write access to user's real Twitter account (this is a read-only decompiler & simulation suite).

---

## 4. Handoff to Technical Specification

Ready to proceed to `/spec`:
`/spec "Implement Gemini 3.7 Flash AI Agent Assistant in X-OS Studio — PRD: docs/PRD.md"`
