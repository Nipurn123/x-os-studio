"use client";

import React from "react";
import { NegativeRiskAlert } from "../lib/types";
import { ShieldAlert, AlertOctagon, CheckCircle2, ShieldCheck } from "lucide-react";

interface NegativeRiskRadarProps {
  alerts: NegativeRiskAlert[];
  penaltyTotal: number;
}

export default function NegativeRiskRadar({ alerts, penaltyTotal }: NegativeRiskRadarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Negative Feedback Radar &amp; Downrank Risks
            </h3>
            <p className="text-xs text-slate-400">
              Guards against severe downrank penalties (-234.0 Report, -58.8 Mute, -43.2 Not-Interested)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400">Total Penalty Risk:</span>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              penaltyTotal > 0
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {penaltyTotal > 0 ? `-${penaltyTotal.toFixed(1)} pts` : "0.0 (Clean)"}
          </span>
        </div>
      </div>

      {/* Alert List or Clean Status */}
      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold text-emerald-200">Draft Status: Clean &amp; Safe</p>
            <p className="text-emerald-400/80">
              No toxicity, spam signals, link penalties, or high-probability mute triggers detected.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-xs space-y-2 transition-all hover:bg-rose-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{alert.title}</span>
                </div>
                <span className="font-mono font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                  -{alert.penaltyScore} pts
                </span>
              </div>
              <p className="text-slate-300">{alert.description}</p>
              <div className="rounded-lg bg-black/40 p-2.5 text-slate-200 border border-white/5 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">Fix:</span>
                <span>{alert.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
