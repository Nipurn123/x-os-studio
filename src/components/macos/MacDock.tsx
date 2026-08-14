"use client";

import React, { useState } from "react";
import {
  FolderCode,
  Zap,
  Cpu,
  Terminal,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";

interface DockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  theme?: "dark" | "light";
  onToggleAgent?: () => void;
  isAgentOpen?: boolean;
}

export default function MacDock({
  activeTab,
  onSelectTab,
  theme = "light",
  onToggleAgent,
  isAgentOpen = false,
}: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const isDark = theme === "dark";

  const apps = [
    {
      id: "decompiler",
      name: "Finder",
      badge: "2,015 Files",
      color: "from-blue-500 to-indigo-600",
      icon: <FolderCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
    },
    {
      id: "diagrams",
      name: "Architecture",
      badge: "4 Flows",
      color: "from-purple-500 to-pink-600",
      icon: <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
    },
    {
      id: "doctor",
      name: "Tweet Doctor",
      badge: "Auditor",
      color: "from-amber-400 to-orange-500",
      icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
    },
    {
      id: "matrix",
      name: "Weights Matrix",
      badge: "Cheat Sheet",
      color: "from-emerald-400 to-teal-600",
      icon: <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
    },
    {
      id: "terminal",
      name: "Terminal",
      badge: "CLI",
      color: "from-slate-700 to-slate-900",
      icon: <Terminal className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
    },
    {
      id: "readme",
      name: "Whitepaper",
      badge: "Docs",
      color: "from-cyan-500 to-blue-600",
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
    },
    {
      id: "agent",
      name: "AI Copilot",
      badge: "Intelligence",
      color: "from-indigo-600 via-purple-600 to-cyan-500",
      icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-pulse" />,
      isAction: true,
    },
  ];

  return (
    <div className="fixed bottom-1 sm:bottom-2 inset-x-0 z-40 flex items-center justify-center select-none px-2 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-end gap-1.5 sm:gap-2.5 rounded-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 backdrop-blur-2xl shadow-2xl transition-all max-w-[98vw] overflow-x-auto no-scrollbar ${
          isDark
            ? "border border-white/[0.15] bg-black/60 shadow-black/80"
            : "border border-black/[0.1] bg-white/80 shadow-slate-400/20"
        }`}
      >
        {apps.map((app) => {
          const isActive = app.id === "agent" ? isAgentOpen : activeTab === app.id;
          const isHovered = hoveredApp === app.id;

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center group cursor-pointer shrink-0"
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
              onClick={() => {
                if (app.id === "agent") {
                  onToggleAgent?.();
                } else {
                  onSelectTab(app.id);
                }
              }}
            >
              {/* Tooltip on Desktop Hover */}
              {isHovered && (
                <div className="hidden sm:flex absolute -top-10 flex-col items-center animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                  <div
                    className={`rounded-md px-2 py-0.5 text-[10px] font-sans font-semibold shadow-lg backdrop-blur-md whitespace-nowrap ${
                      isDark
                        ? "border border-white/10 bg-black/90 text-white"
                        : "border border-black/10 bg-white/95 text-black shadow-md"
                    }`}
                  >
                    {app.name}
                  </div>
                  <div
                    className={`h-1 w-1 rotate-45 border-r border-b ${
                      isDark ? "bg-black/90 border-white/10" : "bg-white/95 border-black/10"
                    }`}
                  />
                </div>
              )}

              {/* Touch & Click App Icon Tile */}
              <div
                className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${
                  app.color
                } shadow-sm transition-all duration-200 group-hover:scale-115 group-hover:-translate-y-1.5 group-active:scale-90 border border-white/20`}
              >
                {app.icon}
              </div>

              {/* Active Indicator LED Dot */}
              <div className="mt-1 h-1 w-1 rounded-full transition-all">
                {isActive && (
                  <div
                    className={`h-1 w-1 rounded-full scale-125 ${
                      isDark ? "bg-white shadow-glow-blue" : "bg-indigo-600"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
