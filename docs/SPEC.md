# Technical Specification (SPEC)

## Project: Gemini 3.7 Flash AI Agent Assistant for X-OS Studio

**Status**: Approved / Ready for Implementation  
**Version**: 1.0.0  
**Date**: August 14, 2026  
**Architecture**: Next.js 15 Edge/Node API Routes, Server-Sent Streaming, Gemini 3.7 Flash Integration, macOS Sonoma Obsidian Glass UI  

---

## 1. System Architecture & Topology

```
+-------------------------------------------------------------+
|                 X-OS Studio (Frontend)                      |
|                                                             |
|  +---------------------+        +------------------------+  |
|  |   MacTopBar / Dock  | -----> |   AIAgentDrawer.tsx    |  |
|  | (Trigger / Cmd+K)   |        |  (Obsidian Glass UI)   |  |
|  +---------------------+        +-----------+------------+  |
+---------------------------------------------|---------------+
                                              | POST /api/agent/chat
                                              v (streaming chunks)
+-------------------------------------------------------------+
|               Next.js Backend API Route                     |
|                                                             |
|  +-------------------------------------------------------+  |
|  | /api/agent/chat (Edge / Node Streaming Runtime)       |  |
|  | - Injects X System Prompt & Production Weights        |  |
|  | - Injects Subsystem Summaries & Active File Context   |  |
|  | - Calls Google Gemini 3.7 Flash REST API              |  |
|  | - Falls back gracefully to expert offline synthesizer |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

---

## 2. API Contract & Schemas

### Route: `POST /api/agent/chat`

**Request Payload:**
```typescript
interface AgentChatRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  activeFile?: {
    path: string;
    description?: string;
    subsystem?: string;
  };
  temperature?: number;
}
```

**Response Format:**
- Content-Type: `text/event-stream` / `text/plain; charset=utf-8`
- Real-time token streaming with SSE or raw chunked transfer encoding.

---

## 3. System Prompt & Knowledge Ingestion

The agent system prompt includes:
1. **Core Identity**: Senior X Recommendation Systems & Ranking Engineer at 100xprompt.
2. **Mathematical Ranking Weights**:
   - `ShareViaCopyLink`: `+20.0` (40x like boost)
   - `BidirectionalFollowReplyBoost`: `+15.0` to `+20.0` (mutual reply multiplier)
   - `ReplyWithAuthorEngagement`: `+5.0`
   - `VideoRetention50Plus`: `+1.0`
   - `Favorite`: `+0.5`
   - `OpenRawLink`: `-80%` candidate retrieval penalty
   - `ReportPost`: `-234.0` penalty (~468 likes destroyed)
   - `MuteAuthor`: `-58.8` penalty
3. **Subsystem Architecture Guide**:
   - `phoenix/`: Two-tower retrieval + heavy ranking transformer
   - `thunder/`: In-network in-memory cache for followed accounts
   - `simclusters/`: Graph-based interest community clustering
   - `visibility-filtering/`: Safety rules and content label drop/interstitial decisions
   - `user-cred-v2/`: GraphJet-based account reputation and authority scoring
4. **Interactive File Linking**: Format file references as clickable tags that trigger decompiler node navigation.

---

## 4. UI Components & Interactions

### 4.1 `src/components/agent/AIAgentDrawer.tsx`
- Floating drawer anchored to right edge (`fixed right-4 top-12 bottom-16 z-50 w-96 sm:w-[440px]`).
- Acrylic Obsidian Glass (`bg-[#0c101b]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl`).
- Dynamic Light/Dark mode styling based on `isDark`.
- Quick action pills:
  - *"Why are outbound links downranked?"*
  - *"Explain Phoenix Two-Tower ranking"*
  - *"How does mutual follow boost work?"*
  - *"Audit my tweet draft"*
- Chat message bubble list with markdown formatting, syntax highlighting, and 1-click copy button.
- Clean loading pulse and live typing cursor indicator.

### 4.2 Integration Touchpoints
- **TopBar (`src/components/macos/MacTopBar.tsx`)**: Glowing Siri/AI Agent button with live status indicator and shortcut badge (`⌘K`).
- **Dock (`src/components/macos/MacDock.tsx`)**: Added dedicated AI Agent dock item with notification badge.
- **Main View (`src/app/page.tsx`)**: Global keyboard shortcut listener (`Cmd+K` / `Ctrl+K`) and state management.

---

## 5. Verification Plan
1. Test `/api/agent/chat` endpoint with mock queries and algorithm-specific questions.
2. Verify live streaming tokens in UI.
3. Test quick action pills and dynamic active file context injection.
4. Verify responsive drawer collapse, expand, and drag behaviors.
5. Run full build (`bun run build`) and verify 0 type errors.
6. Push update to GitHub and trigger Cloud Run redeploy to `x.100xprompt.com`.
