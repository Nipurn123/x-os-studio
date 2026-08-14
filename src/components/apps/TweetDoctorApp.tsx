"use client";

import React, { useState, useMemo } from "react";
import { auditPost } from "@/lib/algorithm/scorer";
import { generateAlgorithmicRewrites } from "@/lib/copywriting/rewriter";
import { VIRAL_HOOK_TEMPLATES } from "@/lib/copywriting/hooks";
import { HookTemplate } from "@/lib/types";
import {
  Zap,
  Bookmark,
  MessageSquare,
  Eye,
  Link2Off,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Flame,
  Clock,
  TrendingUp,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function TweetDoctorApp({
  theme = "light",
}: {
  theme?: "dark" | "light";
}) {
  const [content, setContent] = useState<string>(
    "7 high-signal tools that will save you 20 hours a week (bookmark this):\n\n1. Claude Code - terminal coding\n2. Bolt.new - instant prototypes\n3. Cursor - fast refactors\n\nWhich one is in your daily workflow?"
  );

  const [activeSubTab, setActiveSubTab] = useState<"audit" | "fixer" | "templates">("audit");
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const isDark = theme === "dark";

  const audit = useMemo(() => auditPost(content), [content]);
  const rewrites = useMemo(() => generateAlgorithmicRewrites(content), [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        color: "text-emerald-500",
        stroke: "#10b981",
        badge: "VIRAL POTENTIAL (Grade S / A+)",
        badgeBg: isDark ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-300",
        message: "Your tweet is optimized with high-leverage bookmark signals (+20.0) and conversation reply magnets (+5.0).",
      };
    }
    if (score >= 60) {
      return {
        color: "text-blue-500",
        stroke: "#3b82f6",
        badge: "SOLID ENGAGEMENT (Grade B)",
        badgeBg: isDark ? "bg-blue-500/10 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-800 border-blue-300",
        message: "Solid post! Adding an open question at the end or converting to a checklist will push this higher.",
      };
    }
    return {
      color: "text-amber-500",
      stroke: "#f59e0b",
      badge: "NEEDS OPTIMIZATION (Grade C / D)",
      badgeBg: isDark ? "bg-amber-500/10 text-amber-300 border-amber-500/30" : "bg-amber-50 text-amber-800 border-amber-300",
      message: "Lacks high-multiplier signals. Add a bookmark cue or remove outbound links from tweet #1.",
    };
  };

  const scoreTheme = getScoreTheme(audit.scaledScore);

  // SVG Circular Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (audit.scaledScore / 100) * circumference;

  const categories = [
    { id: "all", label: "All 12 Starters" },
    { id: "cheat_sheet", label: "Cheat Sheets (40x)" },
    { id: "contrarian", label: "Contrarian (10x)" },
    { id: "curiosity", label: "Curiosity Gaps" },
    { id: "case_study", label: "Case Studies (10x)" },
    { id: "story", label: "Story Transformation" },
  ];

  const filteredTemplates = selectedCategory === "all"
    ? VIRAL_HOOK_TEMPLATES
    : VIRAL_HOOK_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="flex flex-col h-full space-y-4 font-sans text-xs select-text">
      {/* Sub-Navigation Pills */}
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-xl shrink-0 select-none ${
          isDark
            ? "border-white/[0.08] bg-black/40 text-slate-300"
            : "border-black/[0.08] bg-white text-slate-700 shadow-xs"
        }`}
      >
        <button
          onClick={() => setActiveSubTab("audit")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            activeSubTab === "audit"
              ? "bg-blue-600 text-white font-bold shadow-xs"
              : isDark ? "hover:bg-white/[0.05] hover:text-white" : "hover:bg-black/[0.05] hover:text-black"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>1. Live Tweet Auditor</span>
        </button>

        <button
          onClick={() => setActiveSubTab("fixer")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            activeSubTab === "fixer"
              ? "bg-purple-600 text-white font-bold shadow-xs"
              : isDark ? "hover:bg-white/[0.05] hover:text-white" : "hover:bg-black/[0.05] hover:text-black"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>2. 1-Click Fixer (4 Rewriters)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("templates")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            activeSubTab === "templates"
              ? "bg-amber-600 text-white font-bold shadow-xs"
              : isDark ? "hover:bg-white/[0.05] hover:text-white" : "hover:bg-black/[0.05] hover:text-black"
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>3. Viral Starters (12 Templates)</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {/* TAB 1: AUDIT */}
        {activeSubTab === "audit" && (
          <div className="space-y-4">
            {/* Top Row: Composer (Left) + Circular SVG Gauge Card (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Composer Box */}
              <div
                className={`lg:col-span-8 flex flex-col rounded-2xl border p-4 sm:p-5 shadow-sm space-y-3 ${
                  isDark
                    ? "border-white/10 bg-black/40 backdrop-blur-xl"
                    : "border-black/10 bg-white/90 backdrop-blur-xl shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    Draft Tweet Composer
                  </label>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className={content.length > 280 ? "text-rose-500 font-bold" : "text-slate-400"}>
                      {content.length} / 280 chars
                    </span>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-sans font-medium transition-colors ${
                        isDark
                          ? "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10"
                          : "border-black/10 bg-black/[0.04] text-slate-700 hover:bg-black/10"
                      }`}
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Type or paste your tweet draft here..."
                  className={`w-full rounded-xl border p-3.5 font-sans text-xs leading-relaxed transition-all focus:outline-none ${
                    isDark
                      ? "border-white/10 bg-black/50 text-white placeholder:text-slate-600 focus:border-blue-500"
                      : "border-black/10 bg-white text-black placeholder:text-slate-400 focus:border-blue-500 shadow-2xs"
                  }`}
                />

                {/* Quick Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px] text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>{audit.metrics.wordCount} words</span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <Clock className="h-3 w-3" />
                      ~{audit.metrics.readingTimeSeconds}s reading dwell
                    </span>
                  </div>

                  {audit.metrics.hasOutboundLink && (
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Link2Off className="h-3.5 w-3.5" />
                      Outbound Link (-80% reach)
                    </span>
                  )}
                </div>
              </div>

              {/* Right Circular Gauge Card */}
              <div
                className={`lg:col-span-4 flex flex-col justify-between rounded-2xl border p-5 shadow-sm space-y-4 ${
                  isDark
                    ? "border-white/10 bg-black/40 backdrop-blur-xl"
                    : "border-black/10 bg-white/90 backdrop-blur-xl shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Algorithmic Health
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${scoreTheme.badgeBg}`}>
                    Grade {audit.letterGrade}
                  </span>
                </div>

                {/* Circular SVG Gauge */}
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="relative flex items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90 transform">
                      <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        className={isDark ? "stroke-white/10" : "stroke-black/10"}
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        stroke={scoreTheme.stroke}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className={`text-3xl font-black font-mono tracking-tight ${scoreTheme.color}`}>
                        {audit.scaledScore}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                    </div>
                  </div>
                </div>

                <p className={`text-xs text-center leading-relaxed font-sans ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {scoreTheme.message}
                </p>
              </div>
            </div>

            {/* 4 Micro-Meters Barometers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Bookmark Magnet */}
              <div
                className={`p-3.5 rounded-xl border shadow-2xs space-y-1 ${
                  isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Bookmark className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Bookmarks (40x)</span>
                </div>
                <div className="text-base font-extrabold text-emerald-500 font-mono">
                  {(audit.probabilities.share_via_copy_link * 100).toFixed(0)}% Potential
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {audit.metrics.hasListFormatting ? "Checklist format active" : "Add checklist for +40x"}
                </p>
              </div>

              {/* 2. Conversation Starter */}
              <div
                className={`p-3.5 rounded-xl border shadow-2xs space-y-1 ${
                  isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                  <span>Replies (10x)</span>
                </div>
                <div className="text-base font-extrabold text-blue-500 font-mono">
                  {(audit.probabilities.reply * 100).toFixed(0)}% Magnetism
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {audit.metrics.hasQuestionPrompt ? "Open question detected" : "End with a question"}
                </p>
              </div>

              {/* 3. Reading Stop Power */}
              <div
                className={`p-3.5 rounded-xl border shadow-2xs space-y-1 ${
                  isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Eye className="h-3.5 w-3.5 text-purple-500" />
                  <span>Stop Power</span>
                </div>
                <div className="text-base font-extrabold text-purple-500 font-mono">
                  {audit.metrics.hookStoppingScore}/100 Index
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  First 7 words stopping index
                </p>
              </div>

              {/* 4. Link Penalty Guard */}
              <div
                className={`p-3.5 rounded-xl border shadow-2xs space-y-1 ${
                  isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Link2Off className="h-3.5 w-3.5 text-amber-500" />
                  <span>Link Guard</span>
                </div>
                <div className={`text-base font-extrabold font-mono ${audit.metrics.hasOutboundLink ? "text-rose-500" : "text-emerald-500"}`}>
                  {audit.metrics.hasOutboundLink ? "-80% PENALIZED" : "CLEAN"}
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {audit.metrics.hasOutboundLink ? "Move link to reply 1" : "No links in tweet #1"}
                </p>
              </div>
            </div>

            {/* Recommendations Checklist */}
            {audit.suggestions.length > 0 && (
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isDark
                    ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
                    : "border-amber-300 bg-amber-50 text-amber-950"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>Instant Optimization Opportunities:</span>
                </div>
                <ul className="space-y-1 text-xs">
                  {audit.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FIXER */}
        {activeSubTab === "fixer" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewrites.map((option) => (
              <div
                key={option.mode}
                className={`flex flex-col justify-between p-4 rounded-2xl border shadow-sm space-y-3 transition-all ${
                  isDark
                    ? "border-white/10 bg-black/40 hover:border-white/20"
                    : "border-black/10 bg-white hover:border-black/30 shadow-md"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <span className={`font-bold text-xs flex items-center gap-1.5 ${isDark ? "text-white" : "text-black"}`}>
                      <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                      {option.title}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-500">
                      Score: {option.scoreAfter}/100 (+{Math.max(0, option.scoreDelta)} pts)
                    </span>
                  </div>

                  <div
                    className={`rounded-xl border p-3 font-sans text-xs whitespace-pre-wrap leading-relaxed ${
                      isDark
                        ? "border-white/5 bg-black/50 text-slate-200"
                        : "border-black/5 bg-slate-50 text-slate-800"
                    }`}
                  >
                    {option.rewrittenText}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setContent(option.rewrittenText);
                    setActiveSubTab("audit");
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-2 font-bold text-white transition-colors shadow-xs"
                >
                  <span>Apply This Version</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VIRAL STARTERS */}
        {activeSubTab === "templates" && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white font-bold"
                      : isDark ? "bg-white/[0.05] text-slate-400 hover:text-white" : "bg-black/[0.05] text-slate-700 hover:text-black"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`flex flex-col justify-between p-4 rounded-xl border shadow-sm space-y-2.5 ${
                    isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-blue-500">{template.targetMetric}</span>
                      <span className="text-slate-400">#{template.category}</span>
                    </div>

                    <h4 className={`font-bold text-xs ${isDark ? "text-white" : "text-black"}`}>
                      {template.name}
                    </h4>

                    <div
                      className={`rounded-lg border p-2 text-xs font-mono ${
                        isDark ? "border-white/5 bg-black/50 text-slate-300" : "border-black/5 bg-slate-50 text-slate-700"
                      }`}
                    >
                      &ldquo;{template.hook}&rdquo;
                    </div>

                    <p className="text-xs text-slate-400">
                      {template.whyItWorks}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setContent(template.example);
                      setActiveSubTab("audit");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border py-1.5 font-bold text-xs transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  >
                    <span>Load Template</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
