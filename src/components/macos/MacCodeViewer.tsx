"use client";

import React, { useState } from "react";
import { FileNode } from "@/lib/decompiler/repositoryData";
import { Code2, Copy, Check } from "lucide-react";

interface CodeViewerProps {
  node: FileNode;
  theme?: "dark" | "light";
}

export default function MacCodeViewer({ node, theme = "dark" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText(node.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = node.codeSnippet.split("\n");

  return (
    <div
      className={`flex-1 flex flex-col h-full border-r overflow-hidden select-text font-mono text-xs transition-colors ${
        isDark
          ? "bg-[#0a0c14] border-white/[0.08] text-slate-200"
          : "bg-[#f8f9fc] border-black/[0.08] text-slate-800"
      }`}
    >
      {/* Editor Header Bar */}
      <div
        className={`flex h-10 items-center justify-between border-b px-4 text-xs select-none ${
          isDark
            ? "border-white/[0.08] bg-black/40 text-slate-400"
            : "border-black/[0.08] bg-white text-slate-600 shadow-2xs"
        }`}
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-blue-500" />
          <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
            {node.name}
          </span>
          <span className="text-[10px] text-slate-400">({node.language || "Source"})</span>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-sans font-medium transition-colors ${
            isDark
              ? "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white"
              : "border-black/10 bg-black/[0.05] text-slate-700 hover:bg-black/10 hover:text-black"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Body with Line Numbers */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="flex font-mono text-xs leading-relaxed">
          {/* Line Numbers Column */}
          <div
            className={`select-none pr-4 text-right font-mono shrink-0 ${
              isDark ? "text-slate-600" : "text-slate-400"
            }`}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text Column */}
          <pre
            className={`flex-1 font-mono whitespace-pre overflow-x-auto ${
              isDark ? "text-slate-200" : "text-slate-900 font-medium"
            }`}
          >
            {node.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
