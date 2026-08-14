"use client";

import React, { useState } from "react";
import FiveStagePipelineDiagram from "@/components/diagrams/FiveStagePipelineDiagram";
import CandidateFunnelDiagram from "@/components/diagrams/CandidateFunnelDiagram";
import PhoenixTwoTowerDiagram from "@/components/diagrams/PhoenixTwoTowerDiagram";
import ReputationAndSafetyDiagram from "@/components/diagrams/ReputationAndSafetyDiagram";
import {
  Layers,
  Filter,
  Cpu,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ArchitectureDiagramsApp({
  theme = "light",
}: {
  theme?: "dark" | "light";
}) {
  const [activeDiagramTab, setActiveDiagramTab] = useState<
    "pipeline" | "funnel" | "phoenix" | "safety"
  >("pipeline");

  const isDark = theme === "dark";

  const tabs = [
    {
      id: "pipeline",
      label: "1. 5-Stage Feed Journey",
      icon: <Layers className="h-3.5 w-3.5" />,
    },
    {
      id: "funnel",
      label: "2. Sourcing & Funnel (500M → 20)",
      icon: <Filter className="h-3.5 w-3.5" />,
    },
    {
      id: "phoenix",
      label: "3. Phoenix Neural Transformer",
      icon: <Cpu className="h-3.5 w-3.5" />,
    },
    {
      id: "safety",
      label: "4. Graph Mass & Safety Shield",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 font-sans text-xs">
      {/* Top Architecture Sub-Navigation Tabs */}
      <div
        className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-xl shrink-0 ${
          isDark
            ? "border-white/[0.08] bg-black/40 text-slate-300"
            : "border-black/[0.08] bg-white text-slate-700 shadow-xs"
        }`}
      >
        {tabs.map((tab) => {
          const isActive = activeDiagramTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDiagramTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : isDark
                  ? "hover:bg-white/[0.05] hover:text-white"
                  : "hover:bg-black/[0.05] hover:text-black"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Diagram Canvas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeDiagramTab === "pipeline" && (
          <div className="animate-in fade-in duration-200">
            <FiveStagePipelineDiagram isDark={isDark} />
          </div>
        )}

        {activeDiagramTab === "funnel" && (
          <div className="animate-in fade-in duration-200">
            <CandidateFunnelDiagram isDark={isDark} />
          </div>
        )}

        {activeDiagramTab === "phoenix" && (
          <div className="animate-in fade-in duration-200">
            <PhoenixTwoTowerDiagram isDark={isDark} />
          </div>
        )}

        {activeDiagramTab === "safety" && (
          <div className="animate-in fade-in duration-200">
            <ReputationAndSafetyDiagram isDark={isDark} />
          </div>
        )}
      </div>
    </div>
  );
}
