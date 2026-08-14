"use client";

import React, { useState } from "react";
import { FileNode } from "@/lib/decompiler/repositoryData";
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown } from "lucide-react";

interface FileTreeNodeProps {
  node: FileNode;
  selectedId: string;
  onSelect: (node: FileNode) => void;
  level?: number;
}

export default function FileTreeNode({
  node,
  selectedId,
  onSelect,
  level = 0,
}: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level < 1); // Top folders open by default

  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const getLanguageBadge = () => {
    if (!node.language) return null;
    if (node.language === "Rust") return "bg-orange-100 text-orange-800 border-orange-200";
    if (node.language.includes("Python")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (node.language === "Scala") return "bg-red-100 text-red-800 border-red-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="select-none font-mono text-xs">
      {/* Node row */}
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${level * 14 + 6}px` }}
        className={`flex items-center gap-1.5 py-1 pr-2 rounded-xs cursor-pointer transition-colors ${
          isSelected
            ? "bg-[#000080] text-white font-bold"
            : "text-slate-800 hover:bg-slate-200/80"
        }`}
      >
        {/* Disclosure Triangle for folders */}
        {isFolder ? (
          <span className="flex h-3.5 w-3.5 items-center justify-center shrink-0">
            {isOpen ? (
              <ChevronDown className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-slate-600"}`} />
            ) : (
              <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-slate-600"}`} />
            )}
          </span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Icon */}
        {isFolder ? (
          isOpen ? (
            <FolderOpen
              className={`h-3.5 w-3.5 shrink-0 ${
                isSelected ? "text-yellow-300 fill-yellow-300" : "text-amber-500 fill-amber-400"
              }`}
            />
          ) : (
            <Folder
              className={`h-3.5 w-3.5 shrink-0 ${
                isSelected ? "text-yellow-300 fill-yellow-300" : "text-amber-500 fill-amber-400"
              }`}
            />
          )
        ) : (
          <FileCode
            className={`h-3.5 w-3.5 shrink-0 ${
              isSelected ? "text-blue-200" : "text-blue-600"
            }`}
          />
        )}

        {/* Node Name */}
        <span className="truncate flex-1 font-mono text-[11px]">{node.name}</span>

        {/* Language Badge */}
        {node.language && !isSelected && (
          <span
            className={`text-[9px] px-1 py-0.2 rounded border font-mono ${getLanguageBadge()}`}
          >
            {node.language.split(" ")[0]}
          </span>
        )}
      </div>

      {/* Children list */}
      {isFolder && isOpen && node.children && (
        <div className="border-l border-slate-300/60 ml-2">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
