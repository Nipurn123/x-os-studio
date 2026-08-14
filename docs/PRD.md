# Product Requirements Document (PRD)

## Project: X-OS Studio — Complete Mobile Responsive Overhaul

**Status**: Ready for Specification  
**Version**: 1.0.0  
**Date**: August 14, 2026  
**Primary Target Stack**: Next.js 15, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion  
**Deployment**: Google Cloud Run (`https://x.100xprompt.com`)  
**Aesthetic Theme**: Adaptive iOS/macOS Liquid Glass (`#0b0e17` in Dark Mode, `#fbfbfd` in Light Mode)  

---

## 1. Executive Summary & Objective

Optimize **X-OS Studio** for all mobile devices (iPhones, Android, iPads, foldables) so users arriving from viral tweets on mobile browsers get a flawless, responsive touch experience without clipped sidebars, overlapping horizontal scrollbars, or cut-off windows.

---

## 2. Core Mobile Architecture & Component Adaptations

### 2.1 TopBar & Dock (`MacTopBar.tsx` & `MacDock.tsx`)
- **TopBar**: Compact mobile layout hiding redundant desktop menus and showing clean Apple logo, live clock, Light/Dark toggle, and prominent `Ask AI` pill.
- **Dock**:
  - Automatically shrinks icon padding and hitboxes for small touch screens (`h-10 w-10` icons on mobile vs `h-12 w-12` on desktop).
  - Enables horizontal touch scroll (`overflow-x-auto no-scrollbar`) with swipe indicators.
  - Safe-area bottom inset padding for modern iOS home indicator bars (`pb-safe` / `pb-2`).

### 2.2 Main Window Container (`src/app/page.tsx`)
- Mobile view removes unnecessary window borders/margins on small viewports (`p-1 sm:p-4`, `rounded-xl sm:rounded-2xl`).
- Dynamic viewport height handling (`h-[100dvh]` rather than `100vh`) to prevent mobile browser address bar jumpiness.

### 2.3 Finder Decompiler (`MacSidebar.tsx`, `MacCodeViewer.tsx`, `MacInspectorCard.tsx`)
- On screens $< 1024\text{px}$: Replaces 3-column horizontal squeeze with an **adaptive segmented tab switch**:
  - `[ Files | Source Code | Translation & Rules ]`
- Allows mobile users to browse the 2,015-file tree, inspect code, and read plain-English translations seamlessly on mobile.

### 2.4 AI Intelligence Assistant (`AIAgentDrawer.tsx`)
- On mobile ($< 640\text{px}$): Transforms from a floating right drawer into a **native iOS slide-up bottom sheet**:
  - Inset top rounded corners (`rounded-t-3xl`), native iOS drag handle indicator.
  - Expands from `top-12` to `bottom-0` taking full mobile viewport with easy keyboard input and dismiss.

### 2.5 Architecture Diagrams & Matrix Simulator
- Responsive SVG diagram containers with touch-pinch/pan support and horizontal swipe wrappers.
- Single-column stacked cards on mobile for the Algorithm Multiplier Matrix and Tweet Doctor composer.

---

## 3. Scope Boundaries

### In Scope
- Full viewport optimization across all 6 applications (Finder Decompiler, Architecture Diagrams, Tweet Doctor, Weights Matrix, Terminal CLI, Architecture README).
- Mobile-first touch interactions and segmented mobile navigation.
- iOS Bottom Sheet drawer transformation.
- Safe-area viewport adaptation (`100dvh`).

---

## 4. Handoff to Technical Specification

Ready to proceed to `/spec`:
`/spec "Implement Complete Mobile Responsive Overhaul for X-OS Studio — PRD: docs/PRD.md"`
