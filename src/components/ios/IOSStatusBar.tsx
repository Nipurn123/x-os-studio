"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  Battery,
  Sparkles,
  Sun,
  Moon,
  Signal,
} from "lucide-react";

interface IOSStatusBarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onToggleAgent?: () => void;
  isAgentOpen?: boolean;
}

export function IOSStatusBar({
  theme,
  onToggleTheme,
  onToggleAgent,
  isAgentOpen = false,
}: IOSStatusBarProps) {
  const [timeStr, setTimeStr] = useState<string>("9:41");
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, "0");
      setTimeStr(`${hours % 12 || 12}:${minutes}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-50 w-full select-none shrink-0 pt-1 px-4">
      {/* Main iOS Status Bar Line */}
      <div className="flex items-center justify-between h-9 text-xs font-semibold">
        {/* Left: Time & Theme Switcher */}
        <div className="flex items-center space-x-2 w-20">
          <span className={`text-[13px] font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            {timeStr}
          </span>
          <button
            onClick={onToggleTheme}
            className={`p-1 rounded-full ${
              isDark ? "text-amber-400 hover:bg-white/10" : "text-indigo-600 hover:bg-black/5"
            }`}
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
        </div>

        {/* Center: Apple Dynamic Island */}
        <div
          onClick={() => {
            setIsIslandExpanded(!isIslandExpanded);
            if (!isAgentOpen) onToggleAgent?.();
          }}
          className={`transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg ${
            isIslandExpanded || isAgentOpen
              ? "px-3.5 py-1.5 rounded-2xl bg-black text-white border border-white/20 scale-105"
              : "px-2.5 py-1 rounded-full bg-black text-white border border-white/10 hover:scale-105"
          }`}
        >
          <div className="flex items-center space-x-1.5 text-[10px]">
            <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-400 to-purple-400 animate-pulse" />
            <span className="font-mono text-[9px] font-bold text-slate-200">
              {isAgentOpen ? "Copilot Active" : "X-OS 2026"}
            </span>
          </div>
        </div>

        {/* Right: Signal, 5G, Battery */}
        <div className="flex items-center justify-end space-x-1.5 w-20 text-[11px]">
          <Signal className={`w-3.5 h-3.5 ${isDark ? "text-white" : "text-black"}`} />
          <span className={`text-[10px] font-bold font-sans ${isDark ? "text-white" : "text-black"}`}>5G</span>
          <div className="flex items-center">
            <div
              className={`w-5 h-2.5 rounded-[4px] border px-0.5 flex items-center ${
                isDark ? "border-white/80" : "border-black/80"
              }`}
            >
              <div className="w-full h-1.5 bg-emerald-500 rounded-[2px]" />
            </div>
            <div className={`w-0.5 h-1 rounded-r-sm ${isDark ? "bg-white/80" : "bg-black/80"}`} />
          </div>
        </div>
      </div>
    </header>
  );
}
