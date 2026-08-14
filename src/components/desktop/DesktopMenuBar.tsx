"use client";

import React, { useState, useEffect } from "react";
import {
  FileCode,
  Zap,
  HelpCircle,
  Clock,
  Github,
  Tv,
  Terminal,
  Cpu,
  FileText,
  Info,
} from "lucide-react";

interface MenuBarProps {
  onOpenApp: (appId: string) => void;
  activeAppTitle: string;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
}

export default function DesktopMenuBar({
  onOpenApp,
  activeAppTitle,
  isCrtEnabled,
  onToggleCrt,
}: MenuBarProps) {
  const [timeStr, setTimeStr] = useState<string>("12:00 PM");
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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

  const closeMenus = () => setActiveMenu(null);

  return (
    <div
      onClick={closeMenus}
      className="relative z-50 flex h-6 w-full items-center justify-between border-b border-[#404040] bg-[#d6d6ce] px-2 font-mono text-[11px] text-black shadow-xs select-none"
    >
      {/* Left Classic Mac Menus */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Apple / 𝕏 System Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === "apple" ? null : "apple");
            }}
            className={`flex h-5 px-2 items-center justify-center font-black text-xs transition-colors rounded-xs ${
              activeMenu === "apple" ? "bg-black text-white" : "hover:bg-black/10"
            }`}
          >
            🍎 / 𝕏
          </button>

          {activeMenu === "apple" && (
            <div className="absolute left-0 top-5 w-56 rounded-xs border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] p-1 shadow-md text-xs font-sans">
              <button
                onClick={() => onOpenApp("readme")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-2"
              >
                <Info className="h-3.5 w-3.5" />
                <span>About X-OS System 7.5...</span>
              </button>
              <div className="my-1 border-b border-[#808080]" />
              <button
                onClick={() => onOpenApp("decompiler")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-2"
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Repo Decompiler (20 Subsystems)</span>
              </button>
              <button
                onClick={() => onOpenApp("doctor")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-2"
              >
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                <span>Tweet Growth Doctor</span>
              </button>
              <button
                onClick={() => onOpenApp("matrix")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-2"
              >
                <Cpu className="h-3.5 w-3.5 text-emerald-600" />
                <span>Weights Matrix Cheat Sheet</span>
              </button>
              <button
                onClick={() => onOpenApp("terminal")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-2"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Terminal Command Shell</span>
              </button>
              <div className="my-1 border-b border-[#808080]" />
              <a
                href="https://github.com/xai-org/x-algorithm"
                target="_blank"
                rel="noreferrer"
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-2"
              >
                <Github className="h-3.5 w-3.5" />
                <span>xai-org/x-algorithm (GitHub)</span>
              </a>
            </div>
          )}
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === "file" ? null : "file");
            }}
            className={`px-2 py-0.5 rounded-xs font-bold ${
              activeMenu === "file" ? "bg-black text-white" : "hover:bg-black/10"
            }`}
          >
            File
          </button>
          {activeMenu === "file" && (
            <div className="absolute left-0 top-5 w-44 rounded-xs border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] p-1 shadow-md text-xs font-sans">
              <button
                onClick={() => onOpenApp("decompiler")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                Open Repo Explorer
              </button>
              <button
                onClick={() => onOpenApp("doctor")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                New Tweet Draft
              </button>
              <button
                onClick={() => onOpenApp("terminal")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                New Terminal Session
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === "view" ? null : "view");
            }}
            className={`px-2 py-0.5 rounded-xs font-bold ${
              activeMenu === "view" ? "bg-black text-white" : "hover:bg-black/10"
            }`}
          >
            View
          </button>
          {activeMenu === "view" && (
            <div className="absolute left-0 top-5 w-48 rounded-xs border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] p-1 shadow-md text-xs font-sans">
              <button
                onClick={onToggleCrt}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between"
              >
                <span>CRT Scanlines</span>
                <span className="font-bold">{isCrtEnabled ? "✓ ON" : "OFF"}</span>
              </button>
              <button
                onClick={() => onOpenApp("matrix")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                View Weights Matrix
              </button>
            </div>
          )}
        </div>

        {/* Special Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === "special" ? null : "special");
            }}
            className={`px-2 py-0.5 rounded-xs font-bold ${
              activeMenu === "special" ? "bg-black text-white" : "hover:bg-black/10"
            }`}
          >
            Special
          </button>
          {activeMenu === "special" && (
            <div className="absolute left-0 top-5 w-48 rounded-xs border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] p-1 shadow-md text-xs font-sans">
              <button
                onClick={() => onOpenApp("readme")}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                System Architecture
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                Restart Desktop
              </button>
            </div>
          )}
        </div>

        {/* Current Active Window Name */}
        <span className="hidden md:inline font-bold text-slate-700 border-l border-[#808080] pl-2 truncate max-w-[200px]">
          {activeAppTitle}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* CRT Scanline Toggle */}
        <button
          onClick={onToggleCrt}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-xs border text-[10px] font-mono font-bold transition-all ${
            isCrtEnabled
              ? "bg-amber-200 border-amber-600 text-amber-950"
              : "bg-white/60 border-[#808080] text-slate-700 hover:bg-white"
          }`}
          title="Toggle 90s CRT Monitor Scanlines"
        >
          <Tv className="h-3 w-3" />
          <span>CRT {isCrtEnabled ? "ON" : "OFF"}</span>
        </button>

        {/* Mac Clock */}
        <div className="flex items-center gap-1 font-mono font-bold text-slate-900 border-l border-[#808080] pl-2">
          <Clock className="h-3 w-3 text-slate-600" />
          <span suppressHydrationWarning>{mounted ? timeStr : "12:00 PM"}</span>
        </div>
      </div>
    </div>
  );
}
