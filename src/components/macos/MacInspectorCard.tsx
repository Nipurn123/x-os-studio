"use client";

import React from "react";
import { FileNode } from "@/lib/decompiler/repositoryData";
import {
  Info,
  Lightbulb,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface InspectorProps {
  node: FileNode;
  theme?: "dark" | "light";
}

export default function MacInspectorCard({ node, theme = "dark" }: InspectorProps) {
  const isDark = theme === "dark";

  const getImpactBadge = (level: FileNode["impactLevel"]) => {
    switch (level) {
      case "CRITICAL":
        return isDark
          ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
          : "bg-rose-100 text-rose-800 border-rose-300";
      case "HIGH":
        return isDark
          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          : "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "SHIELD":
        return isDark
          ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
          : "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return isDark
          ? "bg-slate-500/10 text-slate-300 border-slate-500/30"
          : "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <aside
      className={`w-full lg:w-96 flex flex-col h-full border-l overflow-y-auto select-text font-sans text-xs p-5 space-y-4 custom-scrollbar transition-colors ${
        isDark
          ? "bg-[#0d101b]/80 border-white/[0.08] text-slate-200 backdrop-blur-2xl"
          : "bg-white/85 border-black/[0.08] text-slate-800 backdrop-blur-2xl shadow-sm"
      }`}
    >
      {/* Top File Title & Impact */}
      <div className={`space-y-2 border-b pb-4 ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`}>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${getImpactBadge(
              node.impactLevel
            )}`}
          >
            {node.impactLevel} Impact
          </span>

          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
            {node.path}
          </span>
        </div>

        <h3 className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          {node.name}
        </h3>

        <p className={`text-xs italic ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          &ldquo;{node.oneLineSummary}&rdquo;
        </p>
      </div>

      {/* 4-Step Plain-English Decompiler Breakdown */}
      <div className="space-y-3">
        {/* 1. In Simple Terms */}
        <div
          className={`rounded-xl border p-3.5 space-y-1.5 shadow-2xs ${
            isDark
              ? "border-white/[0.06] bg-white/[0.02]"
              : "border-slate-200 bg-slate-50/70"
          }`}
        >
          <div className={`flex items-center gap-1.5 font-bold text-xs ${isDark ? "text-slate-200" : "text-slate-900"}`}>
            <Info className="h-3.5 w-3.5 text-blue-500" />
            <span>In Simple Terms</span>
          </div>
          <p className={`text-xs leading-relaxed font-sans ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            {node.humanTranslation.inSimpleTerms}
          </p>
        </div>

        {/* 2. Why This Exists */}
        <div
          className={`rounded-xl border p-3.5 space-y-1.5 shadow-2xs ${
            isDark
              ? "border-white/[0.06] bg-white/[0.02]"
              : "border-slate-200 bg-slate-50/70"
          }`}
        >
          <div className={`flex items-center gap-1.5 font-bold text-xs ${isDark ? "text-slate-200" : "text-slate-900"}`}>
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <span>Why X Engineers Built This</span>
          </div>
          <p className={`text-xs leading-relaxed font-sans ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            {node.humanTranslation.whyThisExists}
          </p>
        </div>

        {/* 3. How It Affects Your Reach */}
        <div
          className={`rounded-xl border p-3.5 space-y-1.5 shadow-2xs ${
            isDark
              ? "border-blue-500/20 bg-blue-500/[0.04]"
              : "border-blue-200 bg-blue-50/60"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold text-blue-600 text-xs">
            <Zap className="h-3.5 w-3.5 text-blue-500" />
            <span>How It Affects Your Reach</span>
          </div>
          <p className={`text-xs leading-relaxed font-sans ${isDark ? "text-blue-100" : "text-blue-950 font-medium"}`}>
            {node.humanTranslation.howItAffectsYourReach}
          </p>
        </div>

        {/* 4. The Creator's Action Rule */}
        <div
          className={`rounded-xl border p-3.5 space-y-1.5 shadow-2xs ${
            isDark
              ? "border-emerald-500/30 bg-emerald-500/[0.06]"
              : "border-emerald-200 bg-emerald-50/60"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold text-emerald-600 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>The Creator&apos;s Action Rule</span>
          </div>
          <p className={`text-xs leading-relaxed font-sans ${isDark ? "text-emerald-100 font-medium" : "text-emerald-950 font-semibold"}`}>
            {node.humanTranslation.theGoldenRule}
          </p>
        </div>
      </div>
    </aside>
  );
}
