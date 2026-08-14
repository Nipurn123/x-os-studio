"use client";

import React, { useState } from "react";
import MacTopBar from "@/components/macos/MacTopBar";
import MacTrafficLights from "@/components/macos/MacTrafficLights";
import MacDock from "@/components/macos/MacDock";
import MacSidebar from "@/components/macos/MacSidebar";
import MacCodeViewer from "@/components/macos/MacCodeViewer";
import MacInspectorCard from "@/components/macos/MacInspectorCard";
import BrandWatermark from "@/components/macos/BrandWatermark";

import { IOSStatusBar } from "@/components/ios/IOSStatusBar";
import { IOSTabBar } from "@/components/ios/IOSTabBar";

import ArchitectureDiagramsApp from "@/components/apps/ArchitectureDiagramsApp";
import TweetDoctorApp from "@/components/apps/TweetDoctorApp";
import AlgorithmMatrixApp from "@/components/apps/AlgorithmMatrixApp";
import TerminalApp from "@/components/apps/TerminalApp";
import ReadmeViewerApp from "@/components/apps/ReadmeViewerApp";
import { AIAgentDrawer } from "@/components/agent/AIAgentDrawer";

import { REPOSITORY_TREE, getAllFiles, FileNode } from "@/lib/decompiler/repositoryData";
import { FolderCode, Code, Brain } from "lucide-react";

export default function MacOSStudio() {
  const allFiles = getAllFiles(REPOSITORY_TREE);
  const [selectedNode, setSelectedNode] = useState<FileNode>(
    allFiles.find((f) => f.id.includes("ranking_scorer")) || allFiles[0]
  );

  const [activeTab, setActiveTab] = useState<string>("decompiler");
  const [mobileSubTab, setMobileSubTab] = useState<"tree" | "code" | "inspect">("tree");
  const [theme, setTheme] = useState<"dark" | "light">("light");
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
        return "Architecture Diagrams - 4-Stage Visual Blueprint";
      case "doctor":
        return "Tweet Growth Doctor - Live Engagement Auditor";
      case "matrix":
        return "Official Weights Matrix - Parameter Cheat Sheet";
      case "terminal":
        return "Terminal - zsh (x-algorithm-cli)";
      case "readme":
        return "Architecture Whitepaper - The 5-Stage Pipeline";
      default:
        return `Finder - ${selectedNode.name || "ranking_scorer.rs"}`;
    }
  };

  return (
    <div
      className={`relative flex flex-col h-[100dvh] w-screen overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "dark bg-[#07090e] text-slate-100" : "bg-[#f1f3f9] text-slate-900"
      }`}
    >
      {/* Background Ambient Radial Glows */}
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

      {/* 1. TOP BAR: Desktop macOS (>=768px) vs. Native iOS Status Bar with Dynamic Island on Mobile (<768px) */}
      <div className="hidden md:block">
        <MacTopBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleAgent={() => setIsAgentOpen((prev) => !prev)}
          isAgentOpen={isAgentOpen}
        />
      </div>
      <div className="block md:hidden">
        <IOSStatusBar
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleAgent={() => setIsAgentOpen((prev) => !prev)}
          isAgentOpen={isAgentOpen}
        />
      </div>

      {/* Main Studio Content Viewport */}
      <main className="relative flex-1 p-1 sm:p-2.5 md:p-3 pb-1 md:pb-20 overflow-hidden flex flex-col min-h-0">
        <div
          className={`flex-1 flex flex-col rounded-2xl md:rounded-2xl border shadow-xl overflow-hidden transition-all duration-200 min-h-0 ${
            isDark
              ? "border-white/[0.12] bg-[#10131e]/90 backdrop-blur-2xl"
              : "border-black/[0.1] bg-white/90 backdrop-blur-2xl shadow-slate-300/40"
          } ${isFullscreen ? "m-0 rounded-none border-none" : ""}`}
        >
          {/* Desktop Title Bar (Hidden on Mobile for full screen real estate) */}
          <div
            className={`hidden md:flex h-9 sm:h-10 items-center justify-between border-b px-2.5 sm:px-4 select-none shrink-0 ${
              isDark ? "border-white/[0.08] bg-black/40" : "border-black/[0.08] bg-white/70"
            }`}
          >
            {/* Left Traffic Lights */}
            <div className="flex items-center gap-2 sm:gap-3">
              <MacTrafficLights
                onClose={() => setActiveTab("decompiler")}
                onMinimize={() => setActiveTab("decompiler")}
                onMaximize={() => setIsFullscreen(!isFullscreen)}
              />
              <span
                className={`font-mono text-[11px] font-semibold border-l pl-3 ${
                  isDark ? "text-slate-500 border-white/10" : "text-slate-400 border-black/10"
                }`}
              >
                X-OS Studio
              </span>
            </div>

            {/* Center Window Title */}
            <div
              className={`flex items-center gap-2 font-sans text-xs font-semibold truncate max-w-[60%] sm:max-w-[70%] ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              <span className="truncate">{getWindowTitle()}</span>
            </div>

            {/* Right Window Status Pill */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-500">
                2,015 Files
              </span>
            </div>
          </div>

          {/* Window Body Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* 1. DECOMPILER STUDIO (Responsive 3-Column on Desktop / Segmented Tab on Mobile) */}
            {activeTab === "decompiler" && (
              <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-200 min-h-0">
                {/* Mobile Sub-Tab Segmented Bar (< 1024px) */}
                <div
                  className={`flex lg:hidden items-center justify-around border-b px-2 py-1.5 shrink-0 ${
                    isDark ? "bg-black/40 border-white/10" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setMobileSubTab("tree")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mobileSubTab === "tree"
                        ? isDark
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <FolderCode className="w-3.5 h-3.5" />
                    <span>Files (2,015)</span>
                  </button>

                  <button
                    onClick={() => setMobileSubTab("code")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mobileSubTab === "code"
                        ? isDark
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[90px]">{selectedNode.name}</span>
                  </button>

                  <button
                    onClick={() => setMobileSubTab("inspect")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mobileSubTab === "inspect"
                        ? isDark
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Translation</span>
                  </button>
                </div>

                {/* Desktop 3-Column Studio (Visible on lg >= 1024px) */}
                <div className="hidden lg:flex flex-1 flex-row h-full overflow-hidden min-h-0">
                  <MacSidebar
                    tree={REPOSITORY_TREE}
                    allFiles={allFiles}
                    selectedNode={selectedNode}
                    onSelectNode={setSelectedNode}
                    theme={theme}
                  />
                  <MacCodeViewer node={selectedNode} theme={theme} />
                  <MacInspectorCard node={selectedNode} theme={theme} />
                </div>

                {/* Mobile Active Single-View (Visible on screens < 1024px) */}
                <div className="flex lg:hidden flex-1 h-full overflow-hidden min-h-0 relative">
                  {mobileSubTab === "tree" && (
                    <div className="absolute inset-0 flex flex-col overflow-hidden">
                      <MacSidebar
                        tree={REPOSITORY_TREE}
                        allFiles={allFiles}
                        selectedNode={selectedNode}
                        onSelectNode={(node) => {
                          setSelectedNode(node);
                          if (node.type === "file") {
                            setMobileSubTab("code");
                          }
                        }}
                        theme={theme}
                      />
                    </div>
                  )}
                  {mobileSubTab === "code" && (
                    <div className="absolute inset-0 flex flex-col overflow-hidden">
                      <MacCodeViewer node={selectedNode} theme={theme} />
                    </div>
                  )}
                  {mobileSubTab === "inspect" && (
                    <div className="absolute inset-0 overflow-y-auto p-2.5 custom-scrollbar touch-scroll">
                      <MacInspectorCard node={selectedNode} theme={theme} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ARCHITECTURE DIAGRAMS APP */}
            {activeTab === "diagrams" && (
              <div
                className={`flex-1 overflow-y-auto p-3 sm:p-6 animate-in fade-in duration-200 custom-scrollbar touch-scroll ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <ArchitectureDiagramsApp theme={theme} />
              </div>
            )}

            {/* 3. TWEET DOCTOR APP */}
            {activeTab === "doctor" && (
              <div
                className={`flex-1 overflow-y-auto p-3 sm:p-6 animate-in fade-in duration-200 custom-scrollbar touch-scroll ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <TweetDoctorApp theme={theme} />
              </div>
            )}

            {/* 4. WEIGHTS MATRIX APP */}
            {activeTab === "matrix" && (
              <div
                className={`flex-1 overflow-y-auto p-3 sm:p-6 animate-in fade-in duration-200 custom-scrollbar touch-scroll ${
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
                className={`flex-1 overflow-y-auto p-3 sm:p-6 animate-in fade-in duration-200 custom-scrollbar touch-scroll ${
                  isDark ? "bg-black/20" : "bg-slate-50/50"
                }`}
              >
                <ReadmeViewerApp theme={theme} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 2. BOTTOM NAVIGATION: Desktop macOS Floating Dock (>=768px) vs. Native iOS Tab Bar (<768px) */}
      <div className="hidden md:block">
        <MacDock
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          theme={theme}
          onToggleAgent={() => setIsAgentOpen((prev) => !prev)}
          isAgentOpen={isAgentOpen}
        />
      </div>
      <div className="block md:hidden">
        <IOSTabBar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === "decompiler") {
              setMobileSubTab("tree");
            }
          }}
          theme={theme}
          onToggleAgent={() => setIsAgentOpen((prev) => !prev)}
          isAgentOpen={isAgentOpen}
        />
      </div>

      {/* Floating Bottom-Right 100xprompt Branding Watermark (Desktop only) */}
      <div className="hidden md:block">
        <BrandWatermark theme={theme} />
      </div>

      {/* Slide-out / Mobile Bottom Sheet AI Copilot */}
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
            setMobileSubTab("code");
          }
        }}
      />
    </div>
  );
}
