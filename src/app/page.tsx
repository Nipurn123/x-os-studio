"use client";

import React, { useState } from "react";
import MacTopBar from "@/components/macos/MacTopBar";
import MacTrafficLights from "@/components/macos/MacTrafficLights";
import MacDock from "@/components/macos/MacDock";
import MacSidebar from "@/components/macos/MacSidebar";
import MacCodeViewer from "@/components/macos/MacCodeViewer";
import MacInspectorCard from "@/components/macos/MacInspectorCard";
import BrandWatermark from "@/components/macos/BrandWatermark";

import ArchitectureDiagramsApp from "@/components/apps/ArchitectureDiagramsApp";
import TweetDoctorApp from "@/components/apps/TweetDoctorApp";
import AlgorithmMatrixApp from "@/components/apps/AlgorithmMatrixApp";
import TerminalApp from "@/components/apps/TerminalApp";
import ReadmeViewerApp from "@/components/apps/ReadmeViewerApp";
import { AIAgentDrawer } from "@/components/agent/AIAgentDrawer";

import { REPOSITORY_TREE, getAllFiles, FileNode } from "@/lib/decompiler/repositoryData";

export default function MacOSStudio() {
  const allFiles = getAllFiles(REPOSITORY_TREE);
  const [selectedNode, setSelectedNode] = useState<FileNode>(
    allFiles.find((f) => f.id.includes("ranking_scorer")) || allFiles[0]
  );

  const [activeTab, setActiveTab] = useState<string>("decompiler");
  const [theme, setTheme] = useState<"dark" | "light">("light"); // Light Mode by default
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAgentOpen((prev) => !prev);
      } else if (e.key === "Escape" && isAgentOpen) {
        setIsAgentOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAgentOpen]);

  const getWindowTitle = () => {
    switch (activeTab) {
      case "diagrams":
        return "Architecture Diagrams -  4-Stage Visual Recommendation Blueprint";
      case "doctor":
        return "Tweet Growth Doctor -  Live Engagement & Multiplier Auditor";
      case "matrix":
        return "Official Algorithm Weights Matrix -  Production Parameter Cheat Sheet";
      case "terminal":
        return "Terminal -  zsh (x-algorithm-cli)";
      case "readme":
        return "Architecture README -  The 5-Stage Recommendation Pipeline";
      default:
        return `Finder -  ${selectedNode.path || "xai-org/x-algorithm"}`;
    }
  };

  return (
    <div
      className={`relative flex flex-col h-screen w-screen overflow-hidden font-sans transition-colors duration-300 select-none ${
        isDark ? "dark bg-[#07090e] text-slate-100" : "bg-[#f1f3f9] text-slate-900"
      }`}
    >
      {/* Background Ambient Radial Glows (macOS Sonoma / Sequoia Wallpaper vibe) */}
      <div
        className={`pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full blur-[140px] transition-opacity ${
          isDark ? "bg-blue-600/15 opacity-100" : "bg-blue-400/20 opacity-70"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full blur-[150px] transition-opacity ${
          isDark ? "bg-emerald-500/10 opacity-100" : "bg-emerald-400/20 opacity-70"
        }`}
      />
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[170px] transition-opacity ${
          isDark ? "bg-purple-600/10 opacity-100" : "bg-indigo-300/20 opacity-70"
        }`}
      />

      {/* Top macOS Acrylic Menu Bar */}
      <MacTopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleAgent={() => setIsAgentOpen((prev) => !prev)}
        isAgentOpen={isAgentOpen}
      />

      {/* Main macOS Studio Window Container */}
      <main className="relative flex-1 p-2 sm:p-4 pb-20 overflow-hidden flex flex-col">
        <div
          className={`flex-1 flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
            isDark
              ? "border-white/[0.12] bg-[#10131e]/80 backdrop-blur-2xl"
              : "border-black/[0.1] bg-white/80 backdrop-blur-2xl shadow-xl"
          } ${isFullscreen ? "m-0 rounded-none border-none" : ""}`}
        >
          {/* macOS Window Title Bar */}
          <div
            className={`flex h-11 items-center justify-between border-b px-4 select-none shrink-0 ${
              isDark ? "border-white/[0.08] bg-black/40" : "border-black/[0.08] bg-white/60"
            }`}
          >
            {/* Left Traffic Lights */}
            <div className="flex items-center gap-3">
              <MacTrafficLights
                onClose={() => setActiveTab("decompiler")}
                onMinimize={() => setActiveTab("decompiler")}
                onMaximize={() => setIsFullscreen(!isFullscreen)}
              />
              <span
                className={`hidden md:inline font-mono text-[11px] font-semibold border-l pl-3 ${
                  isDark ? "text-slate-500 border-white/10" : "text-slate-400 border-black/10"
                }`}
              >
                X-OS Studio v2026
              </span>
            </div>

            {/* Center Window Title */}
            <div
              className={`flex items-center gap-2 font-sans text-xs font-semibold truncate max-w-[60%] ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              <span className="truncate">{getWindowTitle()}</span>
            </div>

            {/* Right Window Status Pill */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-500">
                2,015 Files Indexed
              </span>
            </div>
          </div>

          {/* Window Body Canvas */}
          <div className="flex-1 flex overflow-hidden">
            {/* 1. DECOMPILER 3-COLUMN STUDIO */}
            {activeTab === "decompiler" && (
              <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden animate-in fade-in duration-200">
                {/* Column 1: Left Sidebar Tree */}
                <MacSidebar
                  tree={REPOSITORY_TREE}
                  allFiles={allFiles}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  theme={theme}
                />

                {/* Column 2: Center Code Canvas */}
                <MacCodeViewer node={selectedNode} theme={theme} />

                {/* Column 3: Right Inspector Card */}
                <MacInspectorCard node={selectedNode} theme={theme} />
              </div>
            )}

            {/* 2. ARCHITECTURE DIAGRAMS APP */}
            {activeTab === "diagrams" && (
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200 ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <ArchitectureDiagramsApp theme={theme} />
              </div>
            )}

            {/* 3. TWEET DOCTOR APP */}
            {activeTab === "doctor" && (
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200 ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <TweetDoctorApp theme={theme} />
              </div>
            )}

            {/* 4. WEIGHTS MATRIX APP */}
            {activeTab === "matrix" && (
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200 ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <AlgorithmMatrixApp theme={theme} />
              </div>
            )}

            {/* 5. TERMINAL CLI APP */}
            {activeTab === "terminal" && (
              <div className="flex-1 flex flex-col h-full p-2 sm:p-3 bg-black/40 overflow-hidden animate-in fade-in duration-200">
                <TerminalApp theme={theme} />
              </div>
            )}

            {/* 6. ARCHITECTURE README APP */}
            {activeTab === "readme" && (
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200 ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <ReadmeViewerApp theme={theme} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating macOS Glassmorphic Dock */}
      <MacDock
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleAgent={() => setIsAgentOpen((prev) => !prev)}
        isAgentOpen={isAgentOpen}
      />

      {/* Floating Bottom-Right 100xprompt Branding Watermark */}
      <BrandWatermark theme={theme} />

      {/* Slide-out AI Agent Drawer */}
      <AIAgentDrawer
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
        isDark={isDark}
        activeFile={{
          path: selectedNode.path,
          subsystem: selectedNode.category,
          description: selectedNode.oneLineSummary,
        }}
        onOpenFile={(path) => {
          const target = allFiles.find((f) => f.path === path || f.name === path);
          if (target) {
            setSelectedNode(target);
            setActiveTab("decompiler");
          }
        }}
      />
    </div>
  );
}
