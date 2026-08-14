"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Clock,
  Type,
  Maximize2,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Link2Off,
  Flame,
} from "lucide-react";
import { PostAuditResult } from "../lib/types";

interface PostAuditorProps {
  content: string;
  onChange: (value: string) => void;
  audit: PostAuditResult;
  onApplyHook?: (hook: string) => void;
}

export default function PostAuditor({
  content,
  onChange,
  audit,
  onApplyHook,
}: PostAuditorProps) {
  const [copied, setCopied] = useState(false);
  const [isLongform, setIsLongform] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = () => {
    if (audit.scaledScore >= 80) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (audit.scaledScore >= 60) return "text-blue-400 border-blue-500/40 bg-blue-500/10";
    if (audit.scaledScore >= 40) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  const charLimit = isLongform ? 4000 : 280;
  const isOverLimit = content.length > charLimit;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Real-Time Algorithmic Draft Auditor
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates post syntax against Phoenix neural ranking &amp; visibility filters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLongform(!isLongform)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors ${
              isLongform
                ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {isLongform ? "Longform Mode (4k chars)" : "Standard Post (280 chars)"}
          </button>

          <button
            onClick={handleCopy}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy Draft"}</span>
          </button>
        </div>
      </div>

      {/* Main Composer & Live Visual Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative rounded-xl border border-white/10 bg-black/50 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste or write your post draft here...
Example:
7 tools that will save you 20 hours of coding this week (bookmark this):

1. Claude Code - terminal coding
2. Bolt.new - instant prototypes
3. Cursor - fast refactors

Which one is in your daily workflow?"
              rows={8}
              className="w-full resize-y rounded-xl bg-transparent p-4 font-mono text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />

            {/* Character & Quick Stats Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/5 bg-white/[0.02] px-4 py-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className={isOverLimit ? "font-bold text-rose-400" : "text-slate-400"}>
                  {content.length} / {charLimit} chars
                </span>
                <span>{audit.metrics.wordCount} words</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  ~{audit.metrics.readingTimeSeconds}s dwell
                </span>
              </div>

              {audit.metrics.hasOutboundLink && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Link2Off className="h-3.5 w-3.5" />
                  Link Detected (-80% reach)
                </span>
              )}
            </div>
          </div>

          {/* First 7-Word Hook Velocity Inspector */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-emerald-400" />
                First 7-Word Hook Velocity:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {audit.metrics.hookStoppingScore}/100 Stopping Power
              </span>
            </div>
            <div className="rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-slate-200 border border-white/5 flex items-center justify-between gap-2">
              <span className="truncate">
                &ldquo;{audit.metrics.first7Words || "Type your first line..."}&rdquo;
              </span>
              <span className="shrink-0 text-[10px] text-slate-500 uppercase tracking-widest">
                Scanned Area
              </span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Algorithmic Score Card */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Composite Algorithmic Score
              </span>
              <span className={`rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-widest ${getScoreColor()}`}>
                Grade {audit.letterGrade}
              </span>
            </div>

            {/* Score Big Display */}
            <div className="my-5 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-white font-mono">
                {audit.scaledScore}
              </span>
              <span className="text-lg font-mono text-slate-500">/ 100</span>
              <div className="ml-auto text-right font-mono text-xs">
                <div className="text-emerald-400 font-bold">+{audit.positiveTotal} pos</div>
                <div className="text-rose-400 font-bold">-{audit.negativePenaltyTotal} neg</div>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  audit.scaledScore >= 80
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-emerald"
                    : audit.scaledScore >= 60
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-glow-blue"
                    : "bg-gradient-to-r from-amber-500 to-rose-500"
                }`}
                style={{ width: `${Math.max(5, audit.scaledScore)}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Barometer */}
          <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Copy-Link Potential (40x):</span>
              <span className="font-bold text-emerald-400">
                {(audit.probabilities.share_via_copy_link * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Conversation Magnetism (10x):</span>
              <span className="font-bold text-blue-400">
                {(audit.probabilities.reply * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Whitespace Scannability:</span>
              <span className="font-bold text-purple-400">
                {audit.metrics.whitespaceIndex}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Negative Feedback Risk:</span>
              <span className={`font-bold ${audit.metrics.sentimentRiskScore > 30 ? "text-rose-400" : "text-emerald-400"}`}>
                {audit.metrics.sentimentRiskScore > 30 ? "Elevated" : "Clean"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithmic Suggestions Pills */}
      {audit.suggestions.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            <Lightbulb className="h-4 w-4" />
            Instant Algorithm Optimization Triggers:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {audit.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg bg-black/40 p-2 text-xs text-slate-300 border border-white/5"
              >
                <TrendingUp className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
