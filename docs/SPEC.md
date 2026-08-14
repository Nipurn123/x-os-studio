# Technical Specification (SPEC)

## Project: Dynamic iOS Mobile System UI Implementation for X-OS Studio

**Status**: Approved / Ready for Implementation  
**Version**: 1.0.0  
**Date**: August 14, 2026  
**Architecture**: Adaptive Platform Architecture (macOS Desktop `≥ 768px` vs. Native iOS 18 System Phone ` < 768px`), Dynamic Island & Status Bar, Native iOS Tab Bar  

---

## 1. System Architecture

```
+-----------------------------------------------------------+
| [Desktop ≥ 768px]: macOS Sonoma Studio                    |
| - MacTopBar Menu + Live System Stats                      |
| - MacWindow Frame + Traffic Lights                        |
| - 3-Column Studio Grid (Finder, Code, Inspector)          |
| - Floating MacDock + Acrylic Theme                        |
+-----------------------------------------------------------+
| [Mobile < 768px]: Dynamic iOS 18 Phone System             |
| - IOSStatusBar (Time, Signal, Dynamic Island, Battery)    |
| - Segmented Navigation Pill Header (Files | Code | Intel) |
| - Native Full-Bleed Content Viewports                     |
| - IOSTabBar (5 Native iOS Icons with Active Blue Tint)    |
| - iOS Home Indicator Swipe Bar (Safe Area)                |
+-----------------------------------------------------------+
```

---

## 2. Component Specifications

### 2.1 `src/components/ios/IOSStatusBar.tsx`
- Renders authentic iOS top bar:
  - Left: Bold current time (e.g. `9:41`).
  - Center: **Dynamic Island** with subtle pill shape (`bg-black text-white px-3 py-1 rounded-full text-[10px] flex items-center space-x-1.5`).
  - Right: Cellular signal bars, 5G icon, WiFi, and percentage-based battery icon.
- Interactive: Tapping the Dynamic Island expands to show active algorithm intelligence status.

### 2.2 `src/components/ios/IOSTabBar.tsx`
- Renders native iOS bottom navigation:
  - `[ Decompiler | Diagrams | Tweet Doctor | Matrix | Copilot ]`
  - Active color: Apple Blue (`#007AFF`).
  - Bottom Home Bar: `w-32 h-1 bg-black/40 dark:bg-white/30 rounded-full mx-auto mt-2`.

### 2.3 `src/app/page.tsx` Platform Router
- Seamlessly renders `IOSStatusBar` and `IOSTabBar` when screen width $< 768\text{px}$, while preserving `MacTopBar` and `MacDock` for desktop screens.

---

## 3. Verification Plan
1. Test mobile layout on 375px / 390px / 430px mobile viewports.
2. Verify smooth tab switching between all 5 iOS tabs and the Dynamic Island.
3. Test dark/light mode toggle consistency across the iOS status and tab bars.
4. Run `bun run build` to confirm 0 compilation errors.
5. Push to GitHub and deploy to Cloud Run.
