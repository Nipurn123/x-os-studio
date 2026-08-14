"use client";

import React, { useState } from "react";
import { REPOSITORY_TREE, FileNode, getAllFiles } from "@/lib/decompiler/repositoryData";
import FileTreeNode from "@/components/decompiler/FileTreeNode";
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  Copy,
  Check,
  Search,
  HardDrive,
  Folder,
  Layers,
} from "lucide-react";

export default function RepoDecompilerApp() {
  const allFilesList = getAllFiles(REPOSITORY_TREE);
  const [selectedNode, setSelectedNode] = useState<FileNode>(
    allFilesList.find((f) => f.id === "hm_ranking_scorer") || allFilesList[0]
  );
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSearchResults = searchQuery.trim()
    ? allFilesList.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.oneLineSummary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedNode.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getImpactBadge = (level: FileNode["impactLevel"]) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "HIGH":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "SHIELD":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="flex h-full flex-col lg:flex-row gap-3 font-sans text-xs">
      {/* Left Pane: Hierarchical Finder Tree (Classic Mac System 7) */}
      <div className="w-full lg:w-80 flex flex-col rounded-md border-2 border-t-white border-l-white border-r-[#84847e] border-b-[#84847e] bg-white shadow-xs shrink-0 overflow-hidden">
        {/* Finder Header Bar */}
        <div className="border-b border-slate-200 bg-[#ebebe6] px-3 py-2 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-black flex items-center gap-1.5">
            <HardDrive className="h-4 w-4 text-slate-700" />
            Macintosh HD
          </span>
          <span className="font-mono text-[10px] text-slate-500 font-bold">
            {allFilesList.length} Items
          </span>
        </div>

        {/* Search Bar */}
        <div className="border-b border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center gap-1.5 rounded-xs border border-slate-300 bg-white px-2 py-1">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search all files & subfolders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-black placeholder:text-slate-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Expandable Tree View */}
        <div className="flex-1 overflow-y-auto p-1 space-y-0.5 select-none bg-white">
          {filteredSearchResults ? (
            <div className="space-y-1 p-1">
              <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 uppercase font-bold">
                Search Results ({filteredSearchResults.length})
              </div>
              {filteredSearchResults.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex items-center gap-1.5 p-1.5 rounded-xs cursor-pointer font-mono text-[11px] ${
                    selectedNode.id === node.id
                      ? "bg-[#000080] text-white font-bold"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 shrink-0" />
                  <div className="truncate flex-1">
                    <div>{node.name}</div>
                    <div className="text-[9px] opacity-70 truncate">{node.path}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            REPOSITORY_TREE.map((node) => (
              <FileTreeNode
                key={node.id}
                node={node}
                selectedId={selectedNode.id}
                onSelect={(n) => setSelectedNode(n)}
                level={0}
              />
            ))
          )}
        </div>

        {/* Tree Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-1.5 font-mono text-[10px] text-slate-500 text-center">
          Click disclosure triangles to expand subfolders
        </div>
      </div>

      {/* Right Pane: Split Code + Plain English Translation */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* Breadcrumb Path Banner */}
        <div className="rounded-md border-2 border-t-white border-l-white border-r-[#84847e] border-b-[#84847e] bg-white p-3.5 shadow-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 mb-0.5">
                <span>Macintosh HD</span>
                <span>&gt;</span>
                <span className="text-blue-900 font-bold">{selectedNode.path}</span>
              </div>
              <h2 className="text-sm font-black text-black flex items-center gap-1.5">
                <FileCode className="h-4 w-4 text-blue-600" />
                {selectedNode.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-xs border px-2 py-0.5 font-mono text-[10px] font-bold ${getImpactBadge(
                  selectedNode.impactLevel
                )}`}
              >
                {selectedNode.impactLevel} IMPACT
              </span>
              {selectedNode.weightOrValue && (
                <span className="rounded-xs bg-emerald-50 border border-emerald-300 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-900">
                  {selectedNode.weightOrValue}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-700 italic">
            &ldquo;{selectedNode.oneLineSummary}&rdquo;
          </p>
        </div>

        {/* Side-by-Side View: Left (Code) vs Right (Plain English Translation) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 flex-1">
          {/* Actual Code Pane */}
          <div className="xl:col-span-6 flex flex-col rounded-md border-2 border-t-white border-l-white border-r-[#84847e] border-b-[#84847e] bg-[#12131a] shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                Production Source Code
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>

            <pre className="flex-1 overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-slate-200 bg-transparent select-text whitespace-pre-wrap">
              {selectedNode.codeSnippet}
            </pre>
          </div>

          {/* Plain English Translation Pane */}
          <div className="xl:col-span-6 flex flex-col gap-2.5 rounded-md border-2 border-t-white border-l-white border-r-[#84847e] border-b-[#84847e] bg-white p-3.5 shadow-xs">
            <div className="border-b border-slate-200 pb-1.5">
              <span className="text-xs font-black uppercase tracking-wide text-blue-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Plain-English Decompiler (What this means)
              </span>
            </div>

            {/* 1. In Simple Terms */}
            <div className="space-y-1 rounded-md bg-slate-50 border border-slate-200 p-2.5">
              <h4 className="font-bold text-slate-800 text-xs">📖 In Simple Terms:</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {selectedNode.humanTranslation.inSimpleTerms}
              </p>
            </div>

            {/* 2. Why this exists */}
            <div className="space-y-1 rounded-md bg-slate-50 border border-slate-200 p-2.5">
              <h4 className="font-bold text-slate-800 text-xs">⚙️ Why X Engineers Built This:</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {selectedNode.humanTranslation.whyThisExists}
              </p>
            </div>

            {/* 3. How it affects your reach */}
            <div className="space-y-1 rounded-md bg-blue-50 border border-blue-200 p-2.5">
              <h4 className="font-bold text-blue-950 text-xs">📈 How It Impacts Your Impressions:</h4>
              <p className="text-blue-900 text-xs leading-relaxed">
                {selectedNode.humanTranslation.howItAffectsYourReach}
              </p>
            </div>

            {/* 4. The Golden Rule */}
            <div className="space-y-1 rounded-md bg-emerald-50 border border-emerald-300 p-2.5">
              <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                The Creator&apos;s Action Rule:
              </h4>
              <p className="text-emerald-900 text-xs font-medium leading-relaxed">
                {selectedNode.humanTranslation.theGoldenRule}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
