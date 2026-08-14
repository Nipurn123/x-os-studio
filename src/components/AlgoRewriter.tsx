"use client";

import React, { useState } from "react";
import { RewriteOption } from "../lib/types";
import { Sparkles, Bookmark, MessageSquare, Clock, ShieldCheck, ArrowRight, Check, Copy, TrendingUp, RefreshCw } from "lucide-react";

interface AlgoRewriterProps {
  options: RewriteOption[];
  onApplyRewrite: (text: string) => void;
}

export default function AlgoRewriter({ options, onApplyRewrite }: AlgoRewriterProps) {
  const [activeTab, setActiveTab] = useState<string>("copy_link");
  const [copiedMode, setCopiedMode] = useState<string | null>(null);

  const current = options.find((o) => o.mode === activeTab) || options[0];

  const handleCopy = (text: string, mode: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMode(mode);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Bookmark":
        return <Bookmark className="h-4 w-4 text-emerald-400" />;
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case "Clock":
        return <Clock className="h-4 w-4 text-purple-400" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-rose-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Algorithmic Multiplier Rewriter
            </h3>
            <p className="text-xs text-slate-400">
              Instant transformations engineered to trigger specific neural ranking signals
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => setActiveTab(opt.mode)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                activeTab === opt.mode
                  ? "bg-white/15 text-white border border-white/30 font-bold shadow-sm"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:text-slate-200"
              }`}
            >
              {getIcon(opt.icon)}
              <span className="hidden sm:inline">{opt.title}</span>
              <span className="sm:hidden">{opt.mode}</span>
              {opt.scoreDelta > 0 && (
                <span className="ml-1 text-emerald-400 font-bold">+{opt.scoreDelta}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Rewrite Active Card */}
      {current && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rewritten Textarea & Controls */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/50 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                  {getIcon(current.icon)}
                  {current.title}
                </span>
                <span className="text-emerald-400 font-bold">
                  {current.scoreAfter}/100 Predicted Score
                </span>
              </div>

              <div className="rounded-lg bg-obsidian-950/80 p-4 font-mono text-sm leading-relaxed text-slate-100 border border-white/5 whitespace-pre-wrap">
                {current.rewrittenText}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {current.rewrittenText.length} characters
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(current.rewrittenText, current.mode)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {copiedMode === current.mode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onApplyRewrite(current.rewrittenText)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-xs font-bold text-black transition-all hover:opacity-90 shadow-glow-emerald"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Apply to Editor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Score Delta & Transformation Reasoning */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-mono">
                <div className="text-slate-400 mb-1">Algorithmic Lift:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400">
                    +{Math.max(0, current.scoreDelta)} pts
                  </span>
                  <span className="text-slate-400">
                    ({current.scoreBefore} → {current.scoreAfter})
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Target Optimization Strategy:
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Key Algorithmic Adjustments:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {current.keyChanges.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
