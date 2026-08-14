"use client";

import React from "react";
import { X, Code2, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

interface ModalProps {
  onClose: () => void;
}

export default function AlgorithmReferenceModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-white/15 bg-[#090a10] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">X Recommendation Engine Ground Truth</h3>
              <p className="text-xs text-slate-400 font-mono">
                Extracted from <span className="text-emerald-400">home-mixer/params/param.rs</span> &amp; <span className="text-blue-400">ranking_scorer.rs</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Key Scoring Weights Code Block */}
          <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-slate-300">
            <div className="mb-2 flex items-center justify-between text-slate-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Cpu className="h-4 w-4" /> Production Scoring Weights (Rust)
              </span>
              <span>home-mixer/params/param.rs</span>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`// Exact weights blended in RankingScorer::effective_head_weights
param!(FavoriteWeight, f64, "rust_home_mixer_favorite_weight", 0.5);              // 1x Baseline
param!(ReplyWeight, f64, "rust_home_mixer_reply_weight", 5.0);                    // 10x Like
param!(BidirectionalFollowReplyWeightBoost, f64, "...", 15.0);                   // +15.0 Boost (20.0 Total)
param!(QuoteWeight, f64, "rust_home_mixer_quote_weight", 5.0);                    // 10x Like
param!(ShareViaCopyLinkWeight, f64, "rust_home_mixer_share_via_copy_link_weight", 20.0); // 40x Like (HIGHEST)
param!(ShareViaDmWeight, f64, "rust_home_mixer_share_via_dm_weight", 5.0);        // 10x Like
param!(FollowAuthorWeight, f64, "rust_home_mixer_follow_author_weight", 4.0);     // 8x Like
param!(OpenLinkWeight, f64, "rust_home_mixer_open_link_weight", 0.2);             // Heavy Outbound Discount
param!(ContDwellTimeWeight, f64, "rust_home_mixer_cont_dwell_time_weight", 0.004);// Per active viewing sec

// Downrank Penalties (Severe Negative Multipliers)
param!(ReportWeight, f64, "rust_home_mixer_report_weight", -234.0);               // Equivalent to -468 Likes
param!(MuteAuthorWeight, f64, "rust_home_mixer_mute_author_weight", -58.8);       // Equivalent to -117 Likes
param!(NotInterestedWeight, f64, "rust_home_mixer_not_interested_weight", -43.2);// Equivalent to -86 Likes
param!(BlockAuthorWeight, f64, "rust_home_mixer_block_author_weight", -31.2);    // Equivalent to -62 Likes`}
            </pre>
          </div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <Sparkles className="h-4 w-4" />
                The 40x Growth Multipliers
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Copy-Link Shares (+20.0):</strong> Bookmarking and link copying are 40x more valuable than a standard like. Format content as reusable cheat sheets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Mutual Follower Replies (+20.0):</strong> Active two-way conversations with mutual followers receive the single highest thread distribution boost.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                <ShieldAlert className="h-4 w-4" />
                The Negative Feedback Trap
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Reports (-234.0) &amp; Mutes (-58.8):</strong> A single angry user reporting or muting your tweet wipes out the algorithmic ranking of hundreds of positive engagements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Outbound Links (+0.2):</strong> Raw links cause users to leave the app, receiving an 80% lower weight and killing dwell time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 bg-white/[0.02] text-xs text-slate-400">
          <span>Licensed under Apache 2.0 (X Corp / xAI)</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-500/20 px-4 py-1.5 font-medium text-emerald-300 hover:bg-emerald-500/30 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
