"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  Battery,
  SlidersHorizontal,
  ExternalLink,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

interface TopBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onToggleAgent?: () => void;
  isAgentOpen?: boolean;
}

export default function MacTopBar({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  onToggleAgent,
  isAgentOpen = false,
}: TopBarProps) {
  const [timeStr, setTimeStr] = useState<string>("12:00 PM");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      className={`relative z-50 flex h-7 w-full items-center justify-between border-b px-3 font-sans text-xs transition-colors select-none ${
        isDark
          ? "border-white/[0.08] bg-black/40 text-slate-200 backdrop-blur-xl"
          : "border-black/[0.08] bg-white/70 text-slate-800 backdrop-blur-xl"
      }`}
    >
      {/* Left Apple / 𝕏 Menus */}
      <div className="flex items-center gap-3">
        {/* Apple/X Icon */}
        <button className={`flex h-5 w-5 items-center justify-center font-bold transition-opacity ${isDark ? "text-white hover:opacity-80" : "text-black hover:opacity-70"}`}>
          
        </button>

        <span className={`font-extrabold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          X-OS Studio
        </span>

        {/* Menu Items */}
        <div className={`hidden sm:flex items-center gap-2 font-medium text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <button
            onClick={() => onSelectTab("decompiler")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeTab === "decompiler"
                ? isDark ? "text-white font-bold" : "text-black font-bold"
                : isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            Finder
          </button>
          <button
            onClick={() => onSelectTab("diagrams")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeTab === "diagrams" ? "text-purple-500 font-bold" : isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => onSelectTab("doctor")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeTab === "doctor" ? "text-emerald-500 font-bold" : isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            Tweet Doctor
          </button>
          <button
            onClick={() => onSelectTab("matrix")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeTab === "matrix" ? "text-blue-500 font-bold" : isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            Weights Matrix
          </button>
          <button
            onClick={() => onSelectTab("terminal")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeTab === "terminal" ? "text-slate-200 font-bold" : isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => onSelectTab("readme")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeTab === "readme" ? "text-cyan-500 font-bold" : isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            README
          </button>
        </div>
      </div>

      {/* Right System Tray Icons */}
      <div className="flex items-center gap-2.5 text-xs font-mono">
        {/* AI Agent Trigger Button */}
        <button
          onClick={onToggleAgent}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-sans font-semibold transition-all cursor-pointer shadow-sm ${
            isAgentOpen
              ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20"
              : isDark
              ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
              : "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
          title="X-OS AI Copilot (⌘K)"
        >
          <Sparkles className={`h-3 w-3 ${isAgentOpen ? "text-amber-300" : "text-indigo-400"} animate-pulse`} />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="text-[9px] opacity-70 font-mono px-1 rounded bg-black/20">⌘K</span>
        </button>

        {/* Dark / Light Mode Switcher */}
        <button
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-sans font-medium transition-all cursor-pointer ${
            isDark
              ? "border-white/10 bg-white/[0.05] text-amber-300 hover:bg-white/10"
              : "border-black/10 bg-black/[0.05] text-slate-700 hover:bg-black/10"
          }`}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
        >
          {isDark ? <Sun className="h-3 w-3 text-amber-400" /> : <Moon className="h-3 w-3 text-indigo-600" />}
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>

        <a
          href="https://github.com/xai-org/x-algorithm"
          target="_blank"
          rel="noreferrer"
          className={`hidden md:flex items-center gap-1 text-[11px] font-sans transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"}`}
        >
          <span>xai-org/x-algorithm</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        <div className={`flex items-center gap-2 border-l pl-2 ${isDark ? "border-white/10 text-slate-300" : "border-black/10 text-slate-600"}`}>
          <Wifi className="h-3.5 w-3.5" />
          <Battery className="h-4 w-4 text-emerald-500" />
          <SlidersHorizontal className="h-3 w-3 cursor-pointer hover:opacity-80" />
        </div>

        {/* Live Clock */}
        <div className={`flex items-center gap-1 font-semibold pl-1 ${isDark ? "text-white" : "text-black"}`}>
          <span suppressHydrationWarning>{mounted ? timeStr : "12:00 PM"}</span>
        </div>
      </div>
    </header>
  );
}
