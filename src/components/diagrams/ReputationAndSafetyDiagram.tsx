"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function ReputationAndSafetyDiagram({
  isDark,
}: {
  isDark: boolean;
}) {
  const [activeSection, setActiveSection] = useState<"pagerank" | "rules">("pagerank");

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Toggle */}
      <div className="flex gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveSection("pagerank")}
          className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all ${
            activeSection === "pagerank"
              ? "bg-emerald-600 text-white shadow-xs"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
          }`}
        >
          1. PageRank User Mass Flow (user-cred-v2)
        </button>

        <button
          onClick={() => setActiveSection("rules")}
          className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all ${
            activeSection === "rules"
              ? "bg-rose-600 text-white shadow-xs"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
          }`}
        >
          2. Visibility First-Drop Rule Evaluator
        </button>
      </div>

      {activeSection === "pagerank" && (
        <div className="space-y-4">
          {/* Formula Card */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">
                SCALA PAGERANK REPUTATION FORMULA
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                user-cred-v2/UserCredV2.scala
              </span>
            </div>

            <div className="rounded-xl bg-black/60 p-3 font-mono text-sm text-emerald-300 text-center border border-emerald-500/20">
              Score = min(100.0, max(0.0, 165.2 + 7.07 * ln(UserMass)))
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Every user begins with a baseline mass ($1.0$). When high-credibility accounts interact with or follow you, your <strong>network mass increases</strong>, boosting your authority score toward $100.0$.
            </p>
          </div>

          {/* Mass Flow Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>High-Mass Interaction Boost</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                A repost or reply from a high-mass verified peer transfers massive PageRank credibility, multiplying your tweet&apos;s out-of-network candidate retrieval volume.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>Low-Quality Engagement Decay</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Interactions from zero-mass bot accounts or engagement rings provide $0.0$ mass transfer and risk triggering BotMaker follow-churn flags.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "rules" && (
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
              Visibility Filtering: First-Drop Bouncer Order
            </h3>
            <span className="font-mono text-xs font-bold text-rose-400">
              visibility-filtering/rules/registry.rs
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-rose-300">
              <span>1. ViewerBlocksAuthorRule / ViewerMutesAuthorRule</span>
              <span className="font-bold">Instant Hard Drop</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-rose-300">
              <span>2. DropStaleTweetsRule (&gt;48 Hours Old)</span>
              <span className="font-bold">Instant Hard Drop</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-rose-300">
              <span>3. HighPrecisionSpamDropRule (BotMaker/Scarecrow)</span>
              <span className="font-bold">Instant Hard Drop</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300">
              <span>4. NsfwAgeGatingDropRule (Underage / Logged-out)</span>
              <span className="font-bold">Filtered Drop</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
