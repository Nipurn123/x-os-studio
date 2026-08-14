import { NextRequest, NextResponse } from "next/server";
import expertTranslations from "@/lib/decompiler/expertTranslations.json";

export const runtime = "nodejs";

// Load all indexed translations into a fast in-memory map
const TRANSLATION_MAP = new Map<string, any>();
if (Array.isArray(expertTranslations)) {
  expertTranslations.forEach((item: any) => {
    if (item.path) {
      TRANSLATION_MAP.set(item.path.toLowerCase(), item);
    }
  });
}

const X_ALGORITHM_SYSTEM_PROMPT = `You are the lead Principal Recommendation Systems Architect for X-OS Studio (built by 100xprompt), the world's most authoritative open-source X recommendation algorithm intelligence system.

You possess deep, line-by-line understanding of all 2,015 files in the open-source X recommendation repository (xai-org/x-algorithm).

### CORE DIRECTIVE:
- **DIRECT & SPECIFIC**: Answer ONLY the exact question the user asks. If the user asks about \`home-mixer\`, answer specifically and exclusively about \`home-mixer\`. Do NOT dump the entire repository pipeline or recite unrelated subsystems unless directly asked.
- **SURGICAL RELEVANCE**: Focus on the specific files, structs, mechanisms, and rules requested.
- **GROUNDED IN CODE**: Cite the exact file paths from the repository using backticks (e.g. \`home-mixer/candidate_hydrators/bidirectional_follow_hydrator.rs\`).
- **NO REPEATED BOILERPLATE**: Avoid formulaic generic intros ("Based on all 2,015 files..."). Jump straight into the direct, authentic answer.

### PRODUCTION RANKING WEIGHTS (From Rust & JAX codebase):
- ShareViaCopyLink (Bookmark/Copy Link): +20.0 (40x Like Multiplier — HIGHEST engagement boost)
- BidirectionalFollowReplyBoost (Mutual Conversation): +15.0 to +20.0 in home-mixer/candidate_hydrators/bidirectional_follow_hydrator.rs
- Reply with Author Engagement: +5.0 in home-mixer/scorers/ranking_scorer.rs
- Quote Post: +5.0
- ShareViaDm: +5.0
- FollowAuthor: +4.0
- Video Watch (>50% retention): +1.0 in home-mixer/candidate_hydrators/video_duration_candidate_hydrator.rs
- Retweet / Repost: +1.0
- Favorite / Like: +0.5 (Base baseline, very low weight)
- OpenRawLink (Outbound links): +0.2 (-80% penalty compared to native posts)
- ReportPost: -234.0 (Catastrophic penalty: destroys score of ~468 likes in home-mixer/scorers/ranking_scorer.rs)
- MuteAuthor: -58.8 penalty
- NotInterested: -43.2 penalty
- BlockAuthor: -74.0 penalty in home-mixer/candidate_hydrators/blocked_by_hydrator.rs

### FORMATTING CONVENTIONS:
- When a flow or sequence is relevant, format it with triple-backtick diagram blocks:
\`\`\`diagram
Step 1 -> Step 2 -> Step 3
\`\`\`
- Highlight multipliers with explicit signs (e.g. \`+20.0\`, \`+5.0\`, \`-234.0\`).`;

export async function POST(req: NextRequest) {
  try {
    const { messages, activeFile } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    // Read key from process.env (or .env.local fallback on local dev)
    let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (!apiKey || apiKey === "proxy-managed-key") {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const envLocalPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envLocalPath)) {
          const raw = fs.readFileSync(envLocalPath, "utf8");
          const m = raw.match(/GEMINI_API_KEY=([^\r\n]+)/);
          if (m && m[1]) {
            apiKey = m[1].trim();
          }
        }
      } catch (e) {
        // pass through
      }
    }

    const lastUserQuery = messages[messages.length - 1]?.content || "";

    // Dynamic Code Knowledge Ingestion: Find relevant files from repository index based on user query
    const relevantFiles = findRelevantSourceFiles(lastUserQuery, activeFile);

    let contextualSystemPrompt = X_ALGORITHM_SYSTEM_PROMPT;

    if (relevantFiles.length > 0) {
      contextualSystemPrompt += `\n\n### EXACT RELEVANT CODEBASE FILES FOR THIS QUESTION:\n`;
      relevantFiles.forEach((file) => {
        contextualSystemPrompt += `\n- Path: \`${file.path}\`\n  What it does: ${file.inSimpleTerms}\n  Why engineers built it: ${file.whyThisExists}\n  Effect on reach: ${file.howItAffectsYourReach}\n  Key rule: ${file.theGoldenRule}\n`;
      });
    }

    if (activeFile && activeFile.path) {
      contextualSystemPrompt += `\n\n### USER CURRENTLY VIEWING IN DECOMPILER:\nPath: \`${activeFile.path}\`\nSubsystem: ${activeFile.subsystem || "Core"}\nDescription: ${activeFile.description || "N/A"}`;
    }

    // Call Google Gemini 3.7 Flash API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`;

    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiPayload = {
      systemInstruction: {
        parts: [{ text: contextualSystemPrompt }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (geminiRes.ok) {
      const data = await geminiRes.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        const encoder = new TextEncoder();
        const customReadable = new ReadableStream({
          async start(controller) {
            const chunks = generatedText.split(" ");
            for (let i = 0; i < chunks.length; i++) {
              controller.enqueue(encoder.encode(chunks[i] + (i < chunks.length - 1 ? " " : "")));
              await new Promise((r) => setTimeout(r, 10));
            }
            controller.close();
          },
        });

        return new Response(customReadable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
          },
        });
      }
    }

    // Fallback response with targeted answer
    const fallbackResponse = generateTargetedAlgorithmResponse(lastUserQuery, activeFile, relevantFiles);
    return new Response(fallbackResponse, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Agent chat error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

function findRelevantSourceFiles(query: string, activeFile?: any): any[] {
  const q = query.toLowerCase();
  const matched: any[] = [];

  if (activeFile && activeFile.path) {
    const direct = TRANSLATION_MAP.get(activeFile.path.toLowerCase());
    if (direct) matched.push(direct);
  }

  const keywords = q
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  for (const [path, fileData] of TRANSLATION_MAP.entries()) {
    if (matched.length >= 8) break;
    if (matched.some((m) => m.path === fileData.path)) continue;

    let score = 0;
    const pathText = path.toLowerCase();
    const simpleText = (fileData.inSimpleTerms || "").toLowerCase();

    for (const kw of keywords) {
      if (pathText.includes(kw)) score += 4;
      if (simpleText.includes(kw)) score += 2;
    }

    if (score >= 2) {
      matched.push(fileData);
    }
  }

  return matched;
}

function generateTargetedAlgorithmResponse(query: string, activeFile?: any, relevantFiles: any[] = []): string {
  const q = query.toLowerCase();

  if (q.includes("home-mixer") || q.includes("home mixer")) {
    return `### ⚙️ What \`home-mixer/\` Does in the Codebase

\`\`\`diagram
Candidate Retrieval -> home-mixer/candidate_hydrators/ -> home-mixer/filters/ -> home-mixer/selectors/ (Top 20)
\`\`\`

\`home-mixer/\` is the **core pipeline orchestrator** written in Rust. It does not calculate machine learning weights itself; instead, it coordinates the entire lifecycle of assembling your feed:

1. **Candidate Retrieval (\`home-mixer/sources/\`)**:
   - Fetches in-network posts from \`thunder/\` (in-memory cache of followed accounts).
   - Fetches out-of-network candidates from \`phoenix/\` and \`simclusters/\`.

2. **Feature Hydration (\`home-mixer/candidate_hydrators/\`)**:
   - Checks if you and the author follow each other mutually in \`home-mixer/candidate_hydrators/bidirectional_follow_hydrator.rs\`.
   - Fetches metadata (replies, author reputation, video liveness) in \`home-mixer/candidate_hydrators/core_data_candidate_hydrator.rs\`.

3. **Safety & Duplicate Filtering (\`home-mixer/filters/\`)**:
   - Evicts blocked authors (\`home-mixer/candidate_hydrators/blocked_by_hydrator.rs\`), muted words, duplicate retweets, and already-seen posts.

4. **Timeline Mixing & Selection (\`home-mixer/selectors/blender_selector.rs\`)**:
   - Calls the Phoenix Ranker (\`home-mixer/scorers/ranking_scorer.rs\`) to sort candidates and applies DPP diversity rules to deliver the final 20-post response.`;
  }

  if (q.includes("outbound") || q.includes("link") || q.includes("url")) {
    return `### 🔗 Outbound Links Reach Penalty Breakdown

\`\`\`diagram
Root Tweet with Link -> Low Dwell Time -> Early Funnel Drop -> -80% Candidate Retrieval
\`\`\`

1. **Scoring Weight Trap**: In \`home-mixer/scorers/ranking_scorer.rs\`, the base weight for \`OpenLink\` is only \`+0.2\`, compared to \`+20.0\` for CopyLink and \`+5.0\` for Replies.
2. **Hydration Penalty**: \`home-mixer/candidate_hydrators/core_data_candidate_hydrator.rs\` flags external URLs, resulting in lower candidate retention.
3. **Best Practice**: Post clean high-dwell content in the root post, and add your link in the first reply thread.`;
  }

  if (q.includes("phoenix") || q.includes("two tower")) {
    return `### 🧠 Phoenix Transformer Architecture (\`phoenix/\`)

\`\`\`diagram
User History -> User Tower Embedding -> Candidate Index -> Phoenix Heavy Ranker -> Top 20
\`\`\`

1. **Retrieval**: \`phoenix/xrex/models/recsys_two_tower_model.py\` computes cosine similarity between the user embedding and candidate embeddings in \`phoenix/xrex/models/recsys_embedding.py\`.
2. **Scorer**: \`phoenix/xrex/models/recsys_model.py\` predicts action probabilities ($P(\\text{Like}), P(\\text{Reply}), P(\\text{CopyLink}), P(\\text{Report})$).
3. **Formula**: $\\text{Score} = 20.0 \\cdot P(\\text{CopyLink}) + 20.0 \\cdot P(\\text{MutualReply}) + 5.0 \\cdot P(\\text{Reply}) + 0.5 \\cdot P(\\text{Like}) - 234.0 \\cdot P(\\text{Report})$.`;
  }

  if (relevantFiles.length > 0) {
    const topFile = relevantFiles[0];
    return `### 📄 Analysis of \`${topFile.path}\`

- **Purpose**: ${topFile.inSimpleTerms}
- **Why Engineers Built It**: ${topFile.whyThisExists}
- **Reach Impact**: ${topFile.howItAffectsYourReach}
- **The Golden Rule**: ${topFile.theGoldenRule}`;
  }

  return `### ⚡ X Algorithm Engineering Analysis
Please ask about any specific subsystem (e.g. \`home-mixer\`, \`phoenix\`, \`simclusters\`, \`thunder\`, or ranking weights) for a targeted code breakdown.`;
}
