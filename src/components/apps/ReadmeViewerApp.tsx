"use client";

import React from "react";
import {
  FileText,
  Cpu,
  CheckCircle2,
  Zap,
  Bookmark,
  MessageSquare,
  ShieldAlert,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function ReadmeViewerApp({
  theme = "light",
}: {
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col h-full space-y-6 font-sans text-xs select-text">
      {/* Hero Overview Card */}
      <div
        className={`p-6 rounded-2xl border space-y-3 shadow-sm transition-colors ${
          isDark
            ? "border-white/10 bg-[#0d101b]/80 backdrop-blur-2xl text-slate-100"
            : "border-black/10 bg-white/90 backdrop-blur-2xl text-slate-900 shadow-md"
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">
              README.txt -  The Architecture &amp; Physics of the X Feed
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Complete End-to-End System Blueprint (xai-org/x-algorithm)
            </p>
          </div>
        </div>

        <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Every day, over <strong>500 million posts</strong> are published on X. When you open the app, the recommendation engine extracts, hydrates, filters, scores, and delivers a personalized timeline of the top <strong>20 posts</strong> in under <strong>100 milliseconds</strong>.
        </p>
      </div>

      {/* The 5-Stage Recommendation Pipeline */}
      <div
        className={`p-6 rounded-2xl border space-y-4 shadow-sm transition-colors ${
          isDark
            ? "border-white/10 bg-[#0d101b]/80 backdrop-blur-2xl"
            : "border-black/10 bg-white/90 backdrop-blur-2xl shadow-md"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <Cpu className="h-4 w-4 text-emerald-500" />
          <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
            The 5-Stage Recommendation Pipeline (Step-by-Step)
          </h3>
        </div>

        <div className="space-y-3 font-sans">
          {/* Stage 1 */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? "border-blue-500/20 bg-blue-500/5" : "border-blue-200 bg-blue-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-500 text-xs">Stage 1: Candidate Sourcing (~1,500 Posts)</span>
              <span className="font-mono text-[10px] text-slate-400">thunder/ &amp; phoenix/</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Queries <strong>Thunder</strong> (in-memory RAM cache for followed accounts, ~800 posts) and <strong>Phoenix Two-Tower</strong> + <strong>SimClusters</strong> (~700 out-of-network posts) in parallel in under 5ms.
            </p>
          </div>

          {/* Stage 2 */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? "border-purple-500/20 bg-purple-500/5" : "border-purple-200 bg-purple-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-500 text-xs">Stage 2: Context Hydration</span>
              <span className="font-mono text-[10px] text-slate-400">home-mixer/candidate_hydrators/</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Loads the viewer&apos;s last 100 engagement tokens, checks mutual follow status via SocialGraph for the +15.0 reply boost, and verifies video duration (&gt;10s).
            </p>
          </div>

          {/* Stage 3 */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? "border-rose-500/20 bg-rose-500/5" : "border-rose-200 bg-rose-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-500 text-xs">Stage 3: Visibility Filtering (The Bouncer)</span>
              <span className="font-mono text-[10px] text-slate-400">visibility-filtering/rules/</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Evaluates first-drop rules: drops posts older than 48 hours, muted keywords, blocked authors, duplicate spam text, and NSFW content for underage viewers.
            </p>
          </div>

          {/* Stage 4 */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-500 text-xs">Stage 4: Neural Transformer Scoring &amp; Blending</span>
              <span className="font-mono text-[10px] text-slate-400">home-mixer/scorers/ranking_scorer.rs</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              The Phoenix multi-task transformer predicts 15+ action probabilities. RankingScorer blends them into a linear sum: Bookmarks ($+20.0$), Mutual Replies ($+20.0$), Replies ($+5.0$), Quotes ($+5.0$), Reports ($-234.0$).
            </p>
          </div>

          {/* Stage 5 */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? "border-amber-500/20 bg-amber-500/5" : "border-amber-200 bg-amber-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-500 text-xs">Stage 5: Slate Diversity (DPP Reranking)</span>
              <span className="font-mono text-[10px] text-slate-400">vm-ranker/dpp.rs</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Determinantal Point Processes (DPP $\theta = 0.65$) rerank the top candidates to ensure topic and creator variety, delivering the final 20-post slate to your screen.
            </p>
          </div>
        </div>
      </div>

      {/* The 7 Unbreakable Creator Rules */}
      <div
        className={`p-6 rounded-2xl border space-y-3 shadow-sm transition-colors ${
          isDark
            ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-100"
            : "border-emerald-300 bg-emerald-50/80 text-emerald-950 shadow-md"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-black">
            The 7 Unbreakable Algorithmic Creator Rules
          </h3>
        </div>

        <ol className="list-decimal pl-5 space-y-1.5 text-xs font-medium leading-relaxed">
          <li><strong>Bookmarks are the #1 Growth Signal (+20.0, 40x Like Power):</strong> Format tweets as referenceable cheat sheets, blueprints, and tool lists.</li>
          <li><strong>Conversations drive reach (+20.0 Mutual Boost, +5.0 Replies):</strong> Always end your post with a genuine question to invite discussion.</li>
          <li><strong>Never put outbound links in Tweet #1:</strong> Raw links receive an $80\%$ downweight ($+0.2$) and kill dwell time. Put links in reply #1.</li>
          <li><strong>Capitalize on the 48-Hour Freshness Window:</strong> Posts older than 48 hours are permanently dropped by the age filter.</li>
          <li><strong>Space your posts 2 to 4 hours apart:</strong> Posting multiple times in minutes triggers author decay and DPP diversity suppression.</li>
          <li><strong>Protect yourself against negative signals (-234.0 Report, -58.8 Mute):</strong> 1 report destroys ~468 likes worth of algorithmic ranking.</li>
          <li><strong>Build genuine peer relationships (PageRank User Mass):</strong> Engagements from verified, high-authority accounts multiply your reach exponentially.</li>
        </ol>
      </div>
    </div>
  );
}
