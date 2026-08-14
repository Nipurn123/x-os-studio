"use client";

import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Zap,
} from "lucide-react";

export default function PhoenixTwoTowerDiagram({
  isDark,
}: {
  isDark: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"two_tower" | "isolation_mask">("two_tower");

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Sub-tab selection */}
      <div className="flex gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveTab("two_tower")}
          className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all ${
            activeTab === "two_tower"
              ? "bg-blue-600 text-white shadow-xs"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
          }`}
        >
          1. Two-Tower Neural Retrieval
        </button>

        <button
          onClick={() => setActiveTab("isolation_mask")}
          className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all ${
            activeTab === "isolation_mask"
              ? "bg-purple-600 text-white shadow-xs"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
          }`}
        >
          2. Candidate Isolation Masking
        </button>
      </div>

      {activeTab === "two_tower" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Tower */}
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark ? "border-blue-500/30 bg-blue-500/5" : "border-blue-200 bg-blue-50/70"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-blue-500 uppercase">
                TOWER 1: USER CONTEXT
              </span>
              <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
                User History Encoder
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Encodes the viewer&apos;s last 100 interaction tokens (likes, retweets, replies) into a 1,024-dimensional normalized <strong>User Embedding vector</strong>.
              </p>
              <div className="rounded-lg bg-black/40 p-2 font-mono text-[10px] text-blue-300">
                UserVector = TransformerEncoder(HistoryTokens)
              </div>
            </div>

            {/* Candidate Tower */}
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/70"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">
                TOWER 2: ITEM CORPUS
              </span>
              <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
                Candidate Semantic ID Encoder
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Encodes candidate posts using 6-level x 256 code Semantic IDs (residual-quantized multimodal embeddings) into a 1,024-dimensional <strong>Item Embedding vector</strong>.
              </p>
              <div className="rounded-lg bg-black/40 p-2 font-mono text-[10px] text-emerald-300">
                ItemVector = SemanticIDEncoder(PostSIDs + AuthorID)
              </div>
            </div>
          </div>

          {/* Dot Product Match Banner */}
          <div
            className={`p-4 rounded-xl border text-center space-y-2 ${
              isDark ? "border-purple-500/30 bg-purple-500/5" : "border-purple-200 bg-purple-50"
            }`}
          >
            <div className="text-xs font-mono font-bold text-purple-400">
              Similarity Search: Dot Product Matching (UserVector · ItemVector)
            </div>
            <p className={`text-xs max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              The retrieval server executes an ultra-fast dot-product similarity search over precomputed candidate indexes inside the checkpoint to extract the top ~1,000 candidates in &lt;10ms.
            </p>
          </div>
        </div>
      )}

      {activeTab === "isolation_mask" && (
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
              Why Candidate Isolation Masking is Critical
            </h3>
            <span className="font-mono text-xs font-bold text-purple-400">
              phoenix/recsys_model.py
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            In standard transformers (like GPT), every token attends to every other token. In Phoenix ranking, <strong>candidates are strictly masked so they cannot attend to each other</strong>. A candidate can only attend to the user&apos;s history tokens.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <span className="font-bold text-emerald-400 block">✓ Batch Invariance:</span>
              <p className="text-slate-300">
                Your post&apos;s score is 100% independent of whichever other tweets happen to be in the batch.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-1">
              <span className="font-bold text-blue-400 block">✓ Cacheable &amp; Consistent:</span>
              <p className="text-slate-300">
                Allows sub-second caching and parallel GPU evaluation without non-deterministic score fluctuations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
