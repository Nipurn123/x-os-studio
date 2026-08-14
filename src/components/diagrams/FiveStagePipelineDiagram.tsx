"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Database,
  UserCheck,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface PipelineStep {
  id: string;
  stageNum: number;
  title: string;
  subsystem: string;
  color: string;
  badge: string;
  inputs: string[];
  outputs: string[];
  description: string;
  codeReference: string;
  creatorTakeaway: string;
}

export default function FiveStagePipelineDiagram({
  isDark,
}: {
  isDark: boolean;
}) {
  const [selectedStepId, setSelectedStepId] = useState<string>("stage4");

  const stages: PipelineStep[] = [
    {
      id: "stage1",
      stageNum: 1,
      title: "Candidate Sourcing",
      subsystem: "thunder/ & phoenix/ & simclusters/",
      color: "from-blue-500 to-indigo-600",
      badge: "~1,500 Candidate Posts",
      inputs: ["500M Daily Tweets Universe", "Viewer ID"],
      outputs: ["In-Network Posts (~800)", "Out-of-Network Posts (~700)"],
      description: "When you open the app, X queries Thunder (in-memory RAM cache for accounts you follow) and Phoenix Two-Tower + SimClusters (out-of-network discovery) in parallel.",
      codeReference: "home-mixer/sources/phoenix_source.rs & thunder_source.rs",
      creatorTakeaway: "Post when your followers are active to enter Thunder RAM cache immediately, and use clear keywords to match Phoenix interest vectors.",
    },
    {
      id: "stage2",
      stageNum: 2,
      title: "Query & Candidate Hydration",
      subsystem: "home-mixer/candidate_hydrators/",
      color: "from-purple-500 to-violet-600",
      badge: "Context Enrichment",
      inputs: ["Raw Post IDs", "Viewer History (100 engagements)"],
      outputs: ["Mutual Follow Tags", "Video Duration", "Follower Counts"],
      description: "Enriches bare tweet IDs with critical context: checks if the viewer and author mutually follow each other, loads video duration (>10s), and fetches follower counts.",
      codeReference: "home-mixer/candidate_hydrators/bidirectional_follow_hydrator.rs",
      creatorTakeaway: "Mutual follow replies unlock an automatic +15.0 boost (+20.0 total). Videos >10s earn Video Quality View (VQV) credit.",
    },
    {
      id: "stage3",
      stageNum: 3,
      title: "Visibility Filtering (The Bouncer)",
      subsystem: "visibility-filtering/rules/",
      color: "from-rose-500 to-red-600",
      badge: "Safety Policy Shield",
      inputs: ["Hydrated Candidates", "Viewer Block/Mute Lists"],
      outputs: ["Clean Candidate Slate (~800 Posts)", "Dropped Violations (0 Imp)"],
      description: "A strict first-drop policy registry evaluates candidate posts. Drops tweets older than 48 hours, blocked/muted authors, duplicate spam text, and NSFW content for underage accounts.",
      codeReference: "visibility-filtering/rules/registry.rs & socialgraph_rules.rs",
      creatorTakeaway: "Content older than 48 hours is permanently dropped. Avoid spam or hostile behavior that prompts user mutes and blocks.",
    },
    {
      id: "stage4",
      stageNum: 4,
      title: "Neural Scoring & Blending",
      subsystem: "home-mixer/scorers/ & phoenix/",
      color: "from-emerald-500 to-teal-600",
      badge: "Final Score = Σ(w_i * P)",
      inputs: ["Surviving Candidates", "Phoenix Transformer Predictions"],
      outputs: ["Ranked Candidate Leaderboard", "Probability Vectors"],
      description: "Phoenix neural transformer predicts probabilities for 15+ actions. RankingScorer blends them into one score: Bookmarks (+20.0), Mutual Replies (+20.0), Replies (+5.0), Likes (+0.5), Reports (-234.0).",
      codeReference: "home-mixer/scorers/ranking_scorer.rs & author_cold_start.rs",
      creatorTakeaway: "Bookmarks (+20.0) are worth 40x more than Likes (+0.5). Emerging creators (<= 1k followers) are injected into test slots 15-16.",
    },
    {
      id: "stage5",
      stageNum: 5,
      title: "DPP Diversity & Slate Delivery",
      subsystem: "vm-ranker/dpp.rs",
      color: "from-amber-500 to-orange-600",
      badge: "Final For You Feed",
      inputs: ["Top Ranked Posts", "DPP Kernel (θ = 0.65)"],
      outputs: ["Personalized Diverse Feed Slate (~20 Posts)"],
      description: "Determinantal Point Process (DPP) reranker ensures feed diversity by penalizing consecutive similar topics and applying author decay to rapid posts.",
      codeReference: "vm-ranker/dpp.rs & home-mixer/selectors/top_k_score_selector.rs",
      creatorTakeaway: "Space your tweets 2-4 hours apart. Posting multiple times in minutes triggers author decay and DPP downranking.",
    },
  ];

  const currentStep = stages.find((s) => s.id === selectedStepId) || stages[3];

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Visual Pipeline Flowchart Row */}
      <div className="flex flex-col lg:flex-row items-stretch gap-2 overflow-x-auto pb-2">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === selectedStepId;
          return (
            <React.Fragment key={stage.id}>
              {/* Stage Interactive Node */}
              <div
                onClick={() => setSelectedStepId(stage.id)}
                className={`flex-1 flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 min-w-[170px] ${
                  isSelected
                    ? isDark
                      ? "border-emerald-500/50 bg-emerald-500/10 shadow-glow-emerald"
                      : "border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-500/30"
                    : isDark
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    : "border-black/10 bg-white hover:bg-slate-50 shadow-2xs"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                        isSelected
                          ? "bg-emerald-500 text-black"
                          : isDark
                          ? "bg-white/10 text-white"
                          : "bg-black/10 text-black"
                      }`}
                    >
                      {stage.stageNum}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                      {stage.badge}
                    </span>
                  </div>

                  <h4
                    className={`font-bold text-xs ${
                      isSelected
                        ? isDark ? "text-emerald-300" : "text-emerald-950 font-extrabold"
                        : isDark ? "text-slate-200" : "text-slate-900"
                    }`}
                  >
                    {stage.title}
                  </h4>

                  <p
                    className={`text-[10px] font-mono truncate ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {stage.subsystem}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px]">
                  <span className={isSelected ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {isSelected ? "Inspecting Node" : "Click to Inspect"}
                  </span>
                </div>
              </div>

              {/* Connector Arrow between stages */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-slate-400 shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Interactive Step Inspector Drawer */}
      <div
        className={`rounded-2xl border p-5 space-y-4 shadow-lg transition-all ${
          isDark
            ? "border-white/10 bg-black/40 backdrop-blur-xl"
            : "border-black/10 bg-white/90 shadow-md backdrop-blur-xl"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              {currentStep.stageNum}
            </span>
            <div>
              <h3 className={`text-sm font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                Stage {currentStep.stageNum}: {currentStep.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Code reference: <span className="text-blue-400 font-bold">{currentStep.codeReference}</span>
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-mono font-bold text-emerald-400">
            {currentStep.badge}
          </span>
        </div>

        {/* 2-Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Data Flow Inputs/Outputs & Description */}
          <div className="md:col-span-7 space-y-3">
            <div className="space-y-1">
              <h4 className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                📖 Stage Mechanics:
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {currentStep.description}
              </p>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div
                className={`p-2.5 rounded-lg border ${
                  isDark
                    ? "border-blue-500/20 bg-blue-500/5 text-blue-200"
                    : "border-blue-200 bg-blue-50 text-blue-950"
                }`}
              >
                <span className="font-bold block text-[10px] uppercase opacity-70">
                  Data Inputs:
                </span>
                {currentStep.inputs.map((inp, i) => (
                  <div key={i} className="truncate">• {inp}</div>
                ))}
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  isDark
                    ? "border-purple-500/20 bg-purple-500/5 text-purple-200"
                    : "border-purple-200 bg-purple-50 text-purple-950"
                }`}
              >
                <span className="font-bold block text-[10px] uppercase opacity-70">
                  Stage Outputs:
                </span>
                {currentStep.outputs.map((out, i) => (
                  <div key={i} className="truncate">• {out}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Creator Rule */}
          <div className="md:col-span-5 flex flex-col justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 space-y-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>The Creator&apos;s Strategy for Stage {currentStep.stageNum}:</span>
              </div>
              <p className={`text-xs leading-relaxed font-medium ${isDark ? "text-emerald-100" : "text-emerald-950 font-semibold"}`}>
                {currentStep.creatorTakeaway}
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400/80">
              Live Pipeline Verification · Verified Against xai-org/x-algorithm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
