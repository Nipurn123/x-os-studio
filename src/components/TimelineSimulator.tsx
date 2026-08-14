"use client";

import React, { useState } from "react";
import { simulateTimelineDistribution } from "../lib/algorithm/simulator";
import { Sliders, Cpu, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Zap, Flame, Radio } from "lucide-react";

interface TimelineSimulatorProps {
  auditScore: number;
}

export default function TimelineSimulator({ auditScore }: TimelineSimulatorProps) {
  const [authorFollowers, setAuthorFollowers] = useState<number>(450);
  const [isMutualFollow, setIsMutualFollow] = useState<boolean>(true);
  const [postAgeHours, setPostAgeHours] = useState<number>(6);
  const [hasVideo10s, setHasVideo10s] = useState<boolean>(false);
  const [userCredibilityScore, setUserCredibilityScore] = useState<number>(85);
  const [candidateSource, setCandidateSource] = useState<"thunder_in_network" | "phoenix_two_tower" | "simclusters">("phoenix_two_tower");

  const simResult = simulateTimelineDistribution({
    authorFollowers,
    isMutualFollow,
    postAgeHours,
    hasVideo10s,
    userCredibilityScore,
    auditScore,
    candidateSource,
  });

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              X Recommendation Pipeline Sandbox
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 5-stage simulation: Thunder / Phoenix Retrieval → Hydration → Visibility Filtering → DPP Reranking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Predicted Slot:</span>
          <span className="rounded bg-emerald-500/20 px-2.5 py-1 font-bold text-emerald-300 border border-emerald-500/30">
            #{simResult.feedPositionSlot <= 100 ? simResult.feedPositionSlot : "99+ (Low)"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            Simulation Parameters
          </h4>

          {/* Candidate Source Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400">Candidate Source:</label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => setCandidateSource("phoenix_two_tower")}
                className={`p-2 rounded-lg border text-center transition-all ${
                  candidateSource === "phoenix_two_tower"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold"
                    : "border-white/5 bg-white/5 text-slate-400"
                }`}
              >
                Phoenix (OON)
              </button>
              <button
                onClick={() => setCandidateSource("thunder_in_network")}
                className={`p-2 rounded-lg border text-center transition-all ${
                  candidateSource === "thunder_in_network"
                    ? "border-blue-500/40 bg-blue-500/10 text-blue-300 font-bold"
                    : "border-white/5 bg-white/5 text-slate-400"
                }`}
              >
                Thunder (In-Net)
              </button>
              <button
                onClick={() => setCandidateSource("simclusters")}
                className={`p-2 rounded-lg border text-center transition-all ${
                  candidateSource === "simclusters"
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300 font-bold"
                    : "border-white/5 bg-white/5 text-slate-400"
                }`}
              >
                SimClusters
              </button>
            </div>
          </div>

          {/* Follower Count Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Author Followers:</span>
              <span className="font-bold text-slate-200">{authorFollowers.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50}
              max={50000}
              step={50}
              value={authorFollowers}
              onChange={(e) => setAuthorFollowers(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            {authorFollowers <= 1000 && (
              <span className="text-[10px] text-emerald-400 font-bold">
                ✓ Cold-Start Boost Eligible (&le; 1,000 followers)
              </span>
            )}
          </div>

          {/* Post Age Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Post Age:</span>
              <span className="font-bold text-slate-200">{postAgeHours} hours</span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              value={postAgeHours}
              onChange={(e) => setPostAgeHours(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            {postAgeHours > 48 && (
              <span className="text-[10px] text-rose-400 font-bold">
                ✗ AgeFilter Drop (&gt; 48 hours)
              </span>
            )}
          </div>

          {/* User Credibility Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">user-cred-v2 Score:</span>
              <span className="font-bold text-slate-200">{userCredibilityScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={userCredibilityScore}
              onChange={(e) => setUserCredibilityScore(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={isMutualFollow}
                onChange={(e) => setIsMutualFollow(e.target.checked)}
                className="accent-emerald-400 rounded"
              />
              <span>Mutual Follow (+15 Boost)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={hasVideo10s}
                onChange={(e) => setHasVideo10s(e.target.checked)}
                className="accent-emerald-400 rounded"
              />
              <span>Video &gt;10s (VQV)</span>
            </label>
          </div>
        </div>

        {/* Right: 5-Stage Visual Funnel */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
            Live Feed Assembly Funnel
          </h4>

          {/* Stage 1: Retrieval */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">1</span>
              <div>
                <span className="text-slate-200 font-bold">Candidate Retrieval</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  {candidateSource === "thunder_in_network" ? "Thunder (In-Network)" : "Phoenix Two-Tower (Out-of-Network)"}
                </p>
              </div>
            </div>
            <span className="text-blue-400 font-bold">Passed</span>
          </div>

          {/* Stage 2: Hydration & Age Filter */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">2</span>
              <div>
                <span className="text-slate-200 font-bold">Age &amp; Core Data Hydration</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  {postAgeHours <= 48 ? "Fresh content (&le;48h threshold)" : "Dropped (Exceeds 48h limit)"}
                </p>
              </div>
            </div>
            {simResult.hydrationPassed ? (
              <span className="text-emerald-400 font-bold">Passed</span>
            ) : (
              <span className="text-rose-400 font-bold">Dropped</span>
            )}
          </div>

          {/* Stage 3: Visibility Filtering */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">3</span>
              <div>
                <span className="text-slate-200 font-bold">Visibility &amp; Safety Policy</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  user-cred-v2 score: {userCredibilityScore}/100
                </p>
              </div>
            </div>
            {simResult.visibilityPassed ? (
              <span className="text-emerald-400 font-bold">Clean</span>
            ) : (
              <span className="text-rose-400 font-bold">Dropped</span>
            )}
          </div>

          {/* Stage 4: Scoring & DPP Diversity */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">4</span>
              <div>
                <span className="text-emerald-300 font-bold">Final Slate Placement</span>
                <p className="text-[11px] text-emerald-400 font-sans">
                  {simResult.isColdStartEligible ? "Boosted to Slots 15-16 via Cold Start" : `Placed at Rank #${simResult.feedPositionSlot}`}
                </p>
              </div>
            </div>
            <span className="text-emerald-400 font-bold text-sm font-mono">
              {simResult.reachMultiplier}x Reach
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
