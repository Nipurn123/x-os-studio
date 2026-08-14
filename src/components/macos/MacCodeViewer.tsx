"use client";

import React, { useState } from "react";
import { FileNode } from "@/lib/decompiler/repositoryData";
import { Copy, Check, FileCode, ArrowRight, ShieldAlert, Sparkles, Terminal } from "lucide-react";

interface CodeViewerProps {
  node: FileNode;
  theme?: "dark" | "light";
}

export default function MacCodeViewer({ node, theme = "dark" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText(node.codeSnippet || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getImpactBadge = () => {
    switch (node.impactLevel) {
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "SHIELD":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const lines = (node.codeSnippet || "// Empty file").split("\n");

  return (
    <div
      className={`flex-1 flex flex-col min-w-0 border-r select-text font-mono text-xs transition-colors h-full overflow-hidden ${
        isDark
          ? "border-white/[0.08] bg-[#07090e] text-slate-200"
          : "border-black/[0.08] bg-white text-slate-800"
      }`}
    >
      {/* Top File Tab Header */}
      <div
        className={`flex items-center justify-between px-3 sm:px-4 py-2 border-b select-none shrink-0 ${
          isDark
            ? "border-white/[0.08] bg-black/40 text-slate-300"
            : "border-black/[0.08] bg-slate-50 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="font-semibold truncate text-xs">{node.name}</span>
          <span
            className={`hidden sm:inline rounded-full border px-2 py-0.5 text-[9px] font-bold ${getImpactBadge()}`}
          >
            {node.impactLevel}
          </span>
          {node.language && (
            <span className="text-[10px] text-slate-400 font-sans">({node.language})</span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-sans transition-all cursor-pointer ${
            isDark
              ? "border-white/10 bg-white/[0.05] hover:bg-white/10 text-slate-200"
              : "border-black/10 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs"
          }`}
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Body Canvas with Line Numbers */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-2 sm:p-4 leading-relaxed custom-scrollbar touch-scroll min-h-0">
        <pre className="flex font-mono text-[11px] sm:text-xs">
          {/* Line Numbers */}
          <div className="pr-3 sm:pr-4 text-right select-none text-slate-500 dark:text-slate-600 border-r border-slate-200 dark:border-white/5 shrink-0 font-mono">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Text Content */}
          <div className="pl-3 sm:pl-4 flex-1 whitespace-pre leading-6 overflow-x-auto">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`hover:bg-blue-500/10 px-1 rounded transition-colors ${
                  line.trim().startsWith("#") || line.trim().startsWith("//") || line.trim().startsWith("/*")
                    ? "text-slate-500 dark:text-slate-400 italic"
                    : line.includes("struct") || line.includes("fn ") || line.includes("def ") || line.includes("class ")
                    ? "text-purple-600 dark:text-purple-400 font-semibold"
                    : line.includes("pub ") || line.includes("import ") || line.includes("use ") || line.includes("from ")
                    ? "text-blue-600 dark:text-blue-400"
                    : line.includes("Some(") || line.includes("Ok(") || line.includes("return ")
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                {line || " "}
              </div>
            ))}
          </div>
        </pre>
      </div>
    </div>
  );
}
