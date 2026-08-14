"use client";

import React, { useState } from "react";
import { FileNode } from "@/lib/decompiler/repositoryData";
import {
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";

interface SidebarProps {
  tree: FileNode[];
  allFiles: FileNode[];
  selectedNode: FileNode;
  onSelectNode: (node: FileNode) => void;
  theme?: "dark" | "light";
}

export default function MacSidebar({
  tree,
  allFiles,
  selectedNode,
  onSelectNode,
  theme = "dark",
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isDark = theme === "dark";

  const filtered = searchQuery.trim()
    ? allFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.oneLineSummary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <aside
      className={`w-full lg:w-72 flex flex-col border-r shrink-0 overflow-hidden select-none font-sans text-xs transition-colors h-full ${
        isDark
          ? "border-white/[0.08] bg-black/30 backdrop-blur-xl text-slate-200"
          : "border-black/[0.08] bg-slate-50/70 backdrop-blur-xl text-slate-800"
      }`}
    >
      {/* Top Search Filter */}
      <div className={`p-2.5 sm:p-3 border-b shrink-0 ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`}>
        <div
          className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-all ${
            isDark
              ? "border-white/10 bg-white/[0.05] focus-within:border-blue-500/50 focus-within:bg-white/[0.08]"
              : "border-black/10 bg-white focus-within:border-blue-500/50 shadow-2xs"
          }`}
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 2,015 files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-transparent text-xs placeholder:text-slate-400 focus:outline-none font-sans ${
              isDark ? "text-white" : "text-black"
            }`}
          />
        </div>
      </div>

      {/* Directory Tree Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 text-[11px] font-mono font-semibold border-b shrink-0 ${
          isDark ? "text-slate-400 border-white/[0.04]" : "text-slate-500 border-black/[0.04]"
        }`}
      >
        <span>xai-org/x-algorithm</span>
        <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isDark ? "bg-white/10 text-slate-300" : "bg-black/5 text-slate-700"}`}>
          {allFiles.length} items
        </span>
      </div>

      {/* Scrollable Tree Content */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar touch-scroll min-h-0">
        {filtered ? (
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 uppercase font-bold">
              Matching Files ({filtered.length})
            </div>
            {filtered.map((node) => (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedNode.id === node.id
                    ? "bg-blue-600 text-white font-medium shadow-xs"
                    : isDark ? "text-slate-300 hover:bg-white/[0.04] active:bg-white/[0.08]" : "text-slate-700 hover:bg-black/[0.04] active:bg-black/[0.08]"
                }`}
              >
                <FileCode className={`h-4 w-4 shrink-0 ${selectedNode.id === node.id ? "text-white" : "text-blue-500"}`} />
                <div className="truncate flex-1 min-w-0">
                  <div className={`text-xs truncate ${selectedNode.id === node.id ? "text-white font-bold" : isDark ? "text-white" : "text-black font-medium"}`}>
                    {node.name}
                  </div>
                  <div className={`text-[10px] truncate font-mono ${selectedNode.id === node.id ? "text-blue-100" : "text-slate-400"}`}>
                    {node.path}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          tree.map((node) => (
            <SidebarNode
              key={node.id}
              node={node}
              selectedId={selectedNode.id}
              onSelect={onSelectNode}
              level={0}
              isDark={isDark}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function SidebarNode({
  node,
  selectedId,
  onSelect,
  level = 0,
  isDark = true,
}: {
  node: FileNode;
  selectedId: string;
  onSelect: (n: FileNode) => void;
  level: number;
  isDark: boolean;
}) {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const getLanguageColor = () => {
    if (node.language === "Rust") return "text-orange-500";
    if (node.language?.includes("Python")) return "text-blue-500";
    if (node.language === "Scala") return "text-red-500";
    if (node.language?.includes("Thrift")) return "text-emerald-500";
    return "text-slate-400";
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${Math.max(level * 12 + 6, 6)}px` }}
        className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-lg cursor-pointer transition-colors text-xs select-none ${
          isSelected
            ? "bg-blue-600 text-white font-medium shadow-xs"
            : isDark
            ? "text-slate-300 hover:bg-white/[0.04] active:bg-white/[0.08]"
            : "text-slate-700 hover:bg-black/[0.04] active:bg-black/[0.08]"
        }`}
      >
        {isFolder ? (
          <>
            <span className="text-slate-400 hover:text-slate-200">
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
            {isOpen ? (
              <FolderOpen className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            ) : (
              <Folder className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            )}
            <span className="font-mono text-xs truncate flex-1">{node.name}</span>
            {node.children && (
              <span className="text-[10px] text-slate-500 font-mono ml-auto">
                {node.children.length}
              </span>
            )}
          </>
        ) : (
          <>
            <FileCode className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : getLanguageColor()}`} />
            <span className={`font-mono text-xs truncate flex-1 ${isSelected ? "text-white font-bold" : ""}`}>
              {node.name}
            </span>
          </>
        )}
      </div>

      {isFolder && isOpen && node.children && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <SidebarNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
