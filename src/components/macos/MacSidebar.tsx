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
      className={`w-full lg:w-72 flex flex-col border-r shrink-0 overflow-hidden select-none font-sans text-xs transition-colors ${
        isDark
          ? "border-white/[0.08] bg-black/30 backdrop-blur-xl text-slate-200"
          : "border-black/[0.08] bg-slate-50/70 backdrop-blur-xl text-slate-800"
      }`}
    >
      {/* Top Search Filter */}
      <div className={`p-3 border-b ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`}>
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
        className={`flex items-center justify-between px-3 py-2 text-[11px] font-mono font-semibold border-b ${
          isDark ? "text-slate-400 border-white/[0.04]" : "text-slate-500 border-black/[0.04]"
        }`}
      >
        <span>xai-org/x-algorithm</span>
        <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isDark ? "bg-white/10 text-slate-300" : "bg-black/5 text-slate-700"}`}>
          {allFiles.length} items
        </span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
        {filtered ? (
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 uppercase font-bold">
              Matching Files ({filtered.length})
            </div>
            {filtered.map((node) => (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedNode.id === node.id
                    ? "bg-blue-600 text-white font-medium shadow-xs"
                    : isDark ? "text-slate-300 hover:bg-white/[0.04]" : "text-slate-700 hover:bg-black/[0.04]"
                }`}
              >
                <FileCode className={`h-3.5 w-3.5 shrink-0 ${selectedNode.id === node.id ? "text-white" : "text-blue-500"}`} />
                <div className="truncate flex-1">
                  <div className={`text-xs truncate ${selectedNode.id === node.id ? "text-white" : isDark ? "text-white" : "text-black font-medium"}`}>
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
        style={{ paddingLeft: `${level * 12 + 6}px` }}
        className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-all ${
          isSelected
            ? "bg-blue-600 text-white font-semibold shadow-xs"
            : isDark ? "text-slate-300 hover:bg-white/[0.05]" : "text-slate-700 hover:bg-black/[0.05]"
        }`}
      >
        {isFolder ? (
          <span className="flex h-3.5 w-3.5 items-center justify-center shrink-0">
            {isOpen ? (
              <ChevronDown className={`h-3 w-3 ${isSelected ? "text-white" : "text-slate-400"}`} />
            ) : (
              <ChevronRight className={`h-3 w-3 ${isSelected ? "text-white" : "text-slate-400"}`} />
            )}
          </span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {isFolder ? (
          isOpen ? (
            <FolderOpen className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-yellow-200 fill-yellow-200" : "text-blue-500 fill-blue-500/20"}`} />
          ) : (
            <Folder className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-yellow-200 fill-yellow-200" : "text-blue-500 fill-blue-500/20"}`} />
          )
        ) : (
          <FileCode className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : getLanguageColor()}`} />
        )}

        <span className="truncate flex-1 font-sans text-xs">{node.name}</span>

        {node.language && !isFolder && !isSelected && (
          <span className={`text-[9px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            {node.language.split(" ")[0]}
          </span>
        )}
      </div>

      {isFolder && isOpen && node.children && (
        <div className={`border-l ml-2 ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
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
