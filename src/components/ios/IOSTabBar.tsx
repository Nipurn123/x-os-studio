"use client";

import React from "react";
import {
  FolderCode,
  Layers,
  Zap,
  Cpu,
  Sparkles,
  FileText,
} from "lucide-react";

interface IOSTabBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  theme: "dark" | "light";
  onToggleAgent?: () => void;
  isAgentOpen?: boolean;
}

export function IOSTabBar({
  activeTab,
  onSelectTab,
  theme,
  onToggleAgent,
  isAgentOpen = false,
}: IOSTabBarProps) {
  const isDark = theme === "dark";

  const tabs = [
    {
      id: "decompiler",
      name: "Finder",
      icon: <FolderCode className="w-5 h-5" />,
    },
    {
      id: "diagrams",
      name: "Pipeline",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: "doctor",
      name: "Doctor",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "matrix",
      name: "Matrix",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      id: "agent",
      name: "Copilot",
      icon: <Sparkles className="w-5 h-5" />,
      isAction: true,
    },
  ];

  return (
    <nav
      className={`relative z-40 w-full border-t select-none transition-colors shrink-0 pb-safe ${
        isDark
          ? "border-white/[0.08] bg-[#0c0f17]/95 backdrop-blur-2xl text-slate-400"
          : "border-black/[0.08] bg-white/95 backdrop-blur-2xl text-slate-500"
      }`}
    >
      <div className="flex items-center justify-around h-12 px-2">
        {tabs.map((tab) => {
          const isActive = tab.id === "agent" ? isAgentOpen : activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "agent") {
                  onToggleAgent?.();
                } else {
                  onSelectTab(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all cursor-pointer ${
                isActive
                  ? "text-[#007AFF] font-bold scale-105"
                  : isDark
                  ? "hover:text-white"
                  : "hover:text-black"
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#007AFF]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="py-1">
        <div
          className={`w-32 h-1 rounded-full mx-auto transition-colors ${
            isDark ? "bg-white/20" : "bg-black/20"
          }`}
        />
      </div>
    </nav>
  );
}
