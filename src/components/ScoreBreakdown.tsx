"use client";

import React from "react";
import { ScoreBreakdownItem } from "../lib/types";
import { Cpu, ArrowUpRight, TrendingUp, HelpCircle } from "lucide-react";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownItem[];
  rawScore: number;
}

export default function ScoreBreakdown({ breakdown, rawScore }: ScoreBreakdownProps) {
  const positiveItems = breakdown.filter((b) => b.type === "positive" || b.type === "neutral");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Engagement Signal Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Contribution = Predicted Probability × Parameter Weight ($w_i$)
            </p>
          </div>
        </div>

        <span className="font-mono text-xs text-emerald-400 font-bold">
          Linear Blend: Σ(w_i × P)
        </span>
      </div>

      {/* Table / Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="pb-2 font-medium">Action Signal</th>
              <th className="pb-2 font-medium text-center">Weight ($w_i$)</th>
              <th className="pb-2 font-medium text-center">Multiplier vs Like</th>
              <th className="pb-2 font-medium text-center">P(Action)</th>
              <th className="pb-2 font-medium text-right">Score Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {positiveItems.map((item) => {
              const isHighLeverage = item.weight >= 5.0;
              const isTopTier = item.weight >= 20.0;

              return (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-white/[0.02] ${
                    isTopTier ? "bg-emerald-500/[0.04]" : isHighLeverage ? "bg-blue-500/[0.02]" : ""
                  }`}
                >
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      {isTopTier && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          40x SUPER BOOST
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{item.explanation}</p>
                  </td>

                  <td className="py-2.5 text-center">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-bold ${
                        isTopTier
                          ? "bg-emerald-500/20 text-emerald-300"
                          : isHighLeverage
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-white/5 text-slate-300"
                      }`}
                    >
                      +{item.weight.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-2.5 text-center font-bold text-slate-300">
                    {item.multiplierVsLike > 1 ? (
                      <span className="text-emerald-400">+{item.multiplierVsLike}x</span>
                    ) : (
                      <span className="text-slate-400">{item.multiplierVsLike}x</span>
                    )}
                  </td>

                  <td className="py-2.5 text-center text-slate-300">
                    {(item.probability * 100).toFixed(0)}%
                  </td>

                  <td className="py-2.5 text-right font-bold">
                    <span
                      className={
                        item.contribution > 3.0
                          ? "text-emerald-400"
                          : item.contribution > 1.0
                          ? "text-blue-400"
                          : "text-slate-300"
                      }
                    >
                      +{item.contribution.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
