"use client";

import React, { useState } from "react";
import { VIRAL_HOOK_TEMPLATES } from "../lib/copywriting/hooks";
import { HookTemplate } from "../lib/types";
import { Sparkles, Bookmark, MessageSquare, Clock, ArrowRight, Check, Flame } from "lucide-react";

interface HookMatrixProps {
  onSelectHook: (template: HookTemplate) => void;
}

export default function HookMatrix({ onSelectHook }: HookMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All 12 Frameworks" },
    { id: "cheat_sheet", label: "Cheat Sheet (40x)" },
    { id: "contrarian", label: "Contrarian (10x)" },
    { id: "curiosity", label: "Curiosity Gap" },
    { id: "case_study", label: "Case Study (10x)" },
    { id: "story", label: "Story Arc (8x)" },
    { id: "how_to", label: "How I Built This" },
  ];

  const filtered = selectedCategory === "all"
    ? VIRAL_HOOK_TEMPLATES
    : VIRAL_HOOK_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleApply = (template: HookTemplate) => {
    onSelectHook(template);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getMetricBadge = (metric: string) => {
    if (metric.includes("40x")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (metric.includes("10x")) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    if (metric.includes("8x")) return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              12 Psychology-Backed Viral Hook Frameworks
            </h3>
            <p className="text-xs text-slate-400">
              Battle-tested opening formulas engineered to stop scrollers in the first 7 words
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                selectedCategory === cat.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Hook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-black/40 p-4 transition-all duration-200 hover:border-emerald-500/40 hover:bg-white/[0.03] group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${getMetricBadge(template.targetMetric)}`}>
                  {template.targetMetric}
                </span>
                <span className="text-[11px] font-mono text-slate-500">#{template.category}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {template.name}
              </h4>

              <div className="rounded-lg bg-obsidian-950 p-2.5 font-mono text-xs text-slate-300 border border-white/5 leading-relaxed">
                &ldquo;{template.hook}&rdquo;
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 italic">
                Why: {template.whyItWorks.slice(0, 45)}...
              </span>
              <button
                onClick={() => handleApply(template)}
                className="flex items-center gap-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-300 border border-emerald-500/30 transition-all shrink-0"
              >
                {copiedId === template.id ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Loaded!</span>
                  </>
                ) : (
                  <>
                    <span>Use Hook</span>
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
