"use client";

import React, { useState } from "react";
import { ExternalLink, X, Zap } from "lucide-react";

interface BrandWatermarkProps {
  theme?: "dark" | "light";
}

export default function BrandWatermark({ theme = "light" }: BrandWatermarkProps) {
  const [showCard, setShowCard] = useState(false);
  const isDark = theme === "dark";

  return (
    <>
      {/* Floating Bottom-Right Watermark Pill */}
      <div className="fixed bottom-3.5 right-4 z-50 select-none">
        <button
          onClick={() => setShowCard(!showCard)}
          className={`group flex items-center gap-2.5 rounded-full px-3.5 py-1.5 backdrop-blur-2xl border shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isDark
              ? "bg-[#0b0e17]/85 border-white/[0.15] text-white hover:border-emerald-500/40 hover:bg-black/90 shadow-glow-emerald"
              : "bg-white/95 border-black/[0.12] text-slate-900 hover:border-emerald-600 hover:bg-white shadow-md"
          }`}
          title="100xprompt -  Autonomous AI Developer Platform"
        >
          {/* Official 100xprompt Vector SVG Logo */}
          <div className="relative flex h-5 w-5 items-center justify-center rounded-full overflow-hidden shrink-0 bg-black p-0.5 border border-white/10">
            <img
              src="/images/100xprompt-logo.svg"
              alt="100xprompt"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Typography */}
          <div className="flex flex-col text-left font-sans leading-tight">
            <span className="text-[11px] font-black tracking-tight flex items-center gap-1">
              100xprompt
            </span>
            <span className={`text-[9px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              made by 100xprompt
            </span>
          </div>
        </button>

        {/* Clickable Detail Card / Popover with Official Website Link */}
        {showCard && (
          <div
            className={`absolute right-0 bottom-12 w-80 rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50 ${
              isDark
                ? "bg-[#0d101b]/95 border-white/[0.15] text-slate-200"
                : "bg-white/95 border-black/[0.12] text-slate-800"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2.5 mb-3 border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black p-1 border border-white/10 overflow-hidden">
                  <img
                    src="/images/100xprompt-logo.svg"
                    alt="100xprompt Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className={`text-xs font-black ${isDark ? "text-white" : "text-black"}`}>
                    100xprompt
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    made by 100xprompt
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCard(false)}
                className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed font-sans mb-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <strong>100xprompt</strong> is the terminal-based autonomous AI coding assistant and developer intelligence platform.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono text-slate-400">
                Official Platform
              </span>

              <a
                href="https://100xprompt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-xs"
              >
                <span>Visit 100xprompt.com</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
