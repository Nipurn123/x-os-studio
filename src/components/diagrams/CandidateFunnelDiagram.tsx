"use client";

import React, { useState } from "react";
import {
  Database,
  Cpu,
  Layers,
  ArrowDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function CandidateFunnelDiagram({
  isDark,
}: {
  isDark: boolean;
}) {
  const [activeSegment, setActiveSegment] = useState<"in_network" | "out_network">("out_network");

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Sourcing Split Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In-Network Source Card */}
        <div
          onClick={() => setActiveSegment("in_network")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeSegment === "in_network"
              ? isDark
                ? "border-blue-500/50 bg-blue-500/10 shadow-glow-blue"
                : "border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-500/30"
              : isDark
              ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              : "border-black/10 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-blue-500 uppercase">
              50% OF CANDIDATES (~800 POSTS)
            </span>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400">
              Thunder RAM Cache
            </span>
          </div>

          <h3 className={`text-sm font-black mb-1 ${isDark ? "text-white" : "text-black"}`}>
            In-Network Sourcing (Followed Accounts)
          </h3>

          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Captures every recent post from accounts the viewer follows directly from in-memory RAM cache (<code className="font-mono text-blue-400">thunder/posts/post_store.rs</code>).
          </p>

          <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Retrieval Latency:</span>
            <span className="text-emerald-400 font-bold">&lt; 1 millisecond</span>
          </div>
        </div>

        {/* Out-of-Network Source Card */}
        <div
          onClick={() => setActiveSegment("out_network")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeSegment === "out_network"
              ? isDark
                ? "border-emerald-500/50 bg-emerald-500/10 shadow-glow-emerald"
                : "border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-500/30"
              : isDark
              ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              : "border-black/10 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">
              50% OF CANDIDATES (~700 POSTS)
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
              Phoenix + SimClusters
            </span>
          </div>

          <h3 className={`text-sm font-black mb-1 ${isDark ? "text-white" : "text-black"}`}>
            Out-of-Network Discovery (Two-Tower AI)
          </h3>

          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Discovers viral posts from accounts the viewer does NOT follow by matching vector embeddings and topic clusters (<code className="font-mono text-emerald-400">phoenix/ &amp; simclusters/</code>).
          </p>

          <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">OON Discount Factor:</span>
            <span className="text-amber-400 font-bold">0.75 (25% Discount)</span>
          </div>
        </div>
      </div>

      {/* Funnel Visualizer Card */}
      <div
        className={`rounded-2xl border p-5 space-y-4 shadow-lg ${
          isDark
            ? "border-white/10 bg-black/40 backdrop-blur-xl"
            : "border-black/10 bg-white/90 shadow-md backdrop-blur-xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-emerald-500" />
            <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
              The 500M $\to$ 20 Post Candidate Funnel
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Total Assembly: &lt;100ms
          </span>
        </div>

        {/* Funnel Layers */}
        <div className="space-y-2 font-mono text-xs">
          {/* Level 1 */}
          <div className="flex items-center gap-3">
            <div className="w-32 text-right font-bold text-slate-400 shrink-0">500M Tweets</div>
            <div className="flex-1 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center px-4 justify-between text-blue-200">
              <span className="font-sans font-semibold text-[11px]">Global Daily Universe</span>
              <span>All Active Public Tweets</span>
            </div>
          </div>

          {/* Level 2 */}
          <div className="flex items-center gap-3">
            <div className="w-32 text-right font-bold text-slate-400 shrink-0">~1,500 Posts</div>
            <div className="w-[80%] h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center px-4 justify-between text-purple-200 ml-4">
              <span className="font-sans font-semibold text-[11px]">Candidate Generation</span>
              <span>50% Thunder / 50% Phoenix &amp; SimClusters</span>
            </div>
          </div>

          {/* Level 3 */}
          <div className="flex items-center gap-3">
            <div className="w-32 text-right font-bold text-slate-400 shrink-0">~800 Posts</div>
            <div className="w-[60%] h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center px-4 justify-between text-amber-200 ml-8">
              <span className="font-sans font-semibold text-[11px]">Visibility Filtering</span>
              <span>Drops &gt;48h staleness, blocked, mutes, NSFW</span>
            </div>
          </div>

          {/* Level 4 */}
          <div className="flex items-center gap-3">
            <div className="w-32 text-right font-bold text-slate-400 shrink-0">~200 Posts</div>
            <div className="w-[45%] h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center px-4 justify-between text-emerald-200 ml-12">
              <span className="font-sans font-semibold text-[11px]">Heavy Ranker (Phoenix)</span>
              <span>Multi-task transformer scoring &amp; blend</span>
            </div>
          </div>

          {/* Level 5 */}
          <div className="flex items-center gap-3">
            <div className="w-32 text-right font-bold text-emerald-400 shrink-0">Top 20 Posts</div>
            <div className="w-[30%] h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400 flex items-center px-4 justify-between text-black font-black ml-16 shadow-glow-emerald">
              <span className="font-sans font-bold text-[11px]">Delivered Timeline Slate</span>
              <span>DPP Diversity Applied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
