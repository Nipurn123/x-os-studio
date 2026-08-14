# Product Requirements Document (PRD)

## Project: Dynamic iOS Mobile System UI Architecture for X-OS Studio

**Status**: Ready for Specification  
**Version**: 1.0.0  
**Date**: August 14, 2026  
**Primary Target Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion  
**Deployment**: Google Cloud Run (`https://x.100xprompt.com`)  
**Design Direction**: Desktop runs macOS Sonoma Glass Studio; Mobile (< 768px) runs an authentic **iOS 18 / Apple Intelligence Phone System UI** (Dynamic Island, iOS Status Bar, Native iOS Tab Bar, Fluid Touch Navigation).

---

## 1. Executive Summary & Objective

Provide a seamless, unified Apple dual-platform experience:
- **On Desktop / Laptop (`≥ 768px`)**: The full **macOS Sonoma** desktop window, menu bar, and dock.
- **On Mobile (`< 768px`)**: Transforms into an **authentic Apple iOS Phone experience** — complete with an interactive Dynamic Island, native iOS status bar, segmented pill navigators, native iOS bottom tab navigation bar, and full-bleed fluid touch screens.

---

## 2. Core iOS System Architecture

### 2.1 iOS Status Bar & Dynamic Island (`IOSStatusBar.tsx`)
- **Top Status Bar**: Authentic iOS typography, live carrier/WiFi/battery level, and an interactive **Dynamic Island** with glowing pill states.
- **Dynamic Island Interaction**: Tapping the Dynamic Island toggles the AI Copilot status or expands to show active algorithm computation state.

### 2.2 iOS Native Bottom Tab Bar (`IOSTabBar.tsx`)
- Replaces desktop floating dock on mobile with an authentic **iOS Tab Bar**:
  - `[ 🔍 Decompiler | 📊 Pipeline | 🩺 Doctor | 🧮 Matrix | ⚡ Copilot ]`
- Authentic iOS icons, active blue tint (`#007AFF`), haptic-style micro-animations, and bottom home indicator safe-area bar.

### 2.3 Mobile-Optimized Screen Views
- **Decompiler App**: Clean iOS Segmented Navigation Header (`[ Files | Code | Meaning ]`) with fluid single-touch scrolling.
- **AI Intelligence**: Full-height native iOS conversation screen with smooth dismiss and floating suggestion pills.
- **Doctor & Matrix**: Native iOS grouped table cards (`bg-white/80` or `bg-white/[0.04]` in dark mode) matching iOS Settings/Health app design aesthetics.

---

## 3. Handoff to Technical Specification

Ready to proceed to `/spec`:
`/spec "Implement Dynamic iOS Mobile System UI for X-OS Studio — PRD: docs/PRD.md"`
