"use client";

import React, { useState } from "react";
import { Sparkles, Code2, ShieldCheck, Zap, ExternalLink, Github } from "lucide-react";
import AlgorithmReferenceModal from "./AlgorithmReferenceModal";

interface NavbarProps {
  scaledScore: number;
  letterGrade: string;
}

export default function Navbar({ scaledScore, letterGrade }: NavbarProps) {
  const [showModal, setShowModal] = useState(false);

  const getBadgeColor = () => {
    if (scaledScore >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (scaledScore >= 60) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050507]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 p-0.5 border border-white/15 shadow-glow-emerald">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#050507]">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  X-Algo<span className="text-emerald-400">Craft</span>
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-300">
                  v2026 Engine
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">
                Open-Source X Recommendation & Copywriting Optimizer
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-3">
            {/* Live Score Chip */}
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs ${getBadgeColor()}`}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Score: <strong className="text-sm font-bold">{scaledScore}/100</strong></span>
              <span className="rounded bg-black/40 px-1.5 py-0.5 font-bold uppercase tracking-wider">
                Grade {letterGrade}
              </span>
            </div>

            {/* Code Truth Reference Button */}
            <button
              onClick={() => setShowModal(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
            >
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Algorithm Code</span>
            </button>

            {/* GitHub link */}
            <a
              href="https://github.com/xai-org/x-algorithm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden md:inline">xai-org/x-algorithm</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Algorithm Reference Modal */}
      {showModal && <AlgorithmReferenceModal onClose={() => setShowModal(false)} />}
    </>
  );
}
