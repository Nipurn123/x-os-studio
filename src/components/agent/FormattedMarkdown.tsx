"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Terminal,
  ArrowRight,
  Layers,
  FileCode,
  ExternalLink,
  Sigma,
} from "lucide-react";

interface FormattedMarkdownProps {
  content: string;
  isDark: boolean;
  onOpenFile?: (path: string) => void;
}

export function FormattedMarkdown({ content, isDark, onOpenFile }: FormattedMarkdownProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleFileClick = (rawPath: string) => {
    const clean = rawPath.trim().replace(/^[`'"]|[`'"]$/g, "");
    if (onOpenFile) {
      onOpenFile(clean);
    }
  };

  const renderFormattedContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer: string[] = [];

    // Table parsing accumulator
    let inTable = false;
    let tableHeaderRows: string[] = [];
    let tableBodyRows: string[][] = [];

    const flushTable = (keyIdx: number) => {
      if (inTable && tableHeaderRows.length > 0) {
        elements.push(
          <div
            key={`table-${keyIdx}`}
            className="my-3 rounded-xl border border-black/[0.08] dark:border-white/[0.12] overflow-hidden shadow-sm max-w-full"
          >
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className={isDark ? "bg-white/[0.06] border-b border-white/10" : "bg-slate-100/90 border-b border-slate-200"}>
                    {tableHeaderRows.map((th, hIdx) => (
                      <th key={hIdx} className="px-3 py-2 font-semibold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {renderInline(th.trim(), isDark, handleFileClick)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                  {tableBodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? isDark ? "bg-transparent" : "bg-white"
                          : isDark ? "bg-white/[0.02]" : "bg-slate-50/60"
                      }
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-xs text-slate-800 dark:text-slate-200">
                          {renderInline(cell.trim(), isDark, handleFileClick)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        inTable = false;
        tableHeaderRows = [];
        tableBodyRows = [];
      }
    };

    lines.forEach((line, idx) => {
      // 1. Markdown Table Check (| col1 | col2 |)
      const trimmed = line.trim();
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        // Divider row: | --- | --- |
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
          return;
        }

        const cells = trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());

        if (!inTable) {
          inTable = true;
          tableHeaderRows = cells;
          tableBodyRows = [];
        } else {
          tableBodyRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // 2. Code Block Start / End
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          const codeText = codeBuffer.join("\n");
          const blockId = `code-${idx}`;
          const isDiagram =
            codeLanguage === "mermaid" ||
            codeLanguage === "flow" ||
            codeLanguage === "diagram" ||
            (codeText.includes("->") && !codeText.includes("{"));

          if (isDiagram) {
            const rawSteps = codeText
              .split(/\r?\n|->/)
              .map((s) => s.replace(/[->|\\]/g, "").trim())
              .filter((s) => s.length > 0 && !/^[\s\d\-•.]+$/.test(s));

            elements.push(
              <div
                key={blockId}
                className={`my-3 p-3 rounded-xl border max-w-full overflow-hidden ${
                  isDark
                    ? "bg-[#0d111c] border-indigo-500/25 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-black/[0.05] dark:border-white/[0.08]">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Algorithm Flow</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                    {rawSteps.length} Steps
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono py-0.5">
                  {rawSteps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <div
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-semibold text-[10px] ${
                          sIdx === rawSteps.length - 1
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                            : isDark
                            ? "bg-black/50 border-white/10 text-slate-200"
                            : "bg-white border-slate-200 text-slate-800 shadow-sm"
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-indigo-500/15 flex items-center justify-center text-[8px] text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                          {sIdx + 1}
                        </span>
                        <span className="break-words">{step}</span>
                      </div>
                      {sIdx < rawSteps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          } else {
            elements.push(
              <div
                key={blockId}
                className={`my-2.5 rounded-xl border overflow-hidden font-mono text-[11px] max-w-full ${
                  isDark ? "bg-[#07090e] border-white/10" : "bg-slate-900 text-slate-100 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/5 text-[10px] text-slate-400 select-none">
                  <div className="flex items-center space-x-1.5">
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    <span>{codeLanguage || "code"}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeText, blockId)}
                    className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode === blockId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed scrollbar-thin max-w-full">
                  {codeText}
                </pre>
              </div>
            );
          }

          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // 3. Mathematical Formula Blocks
      const isStandaloneFormula =
        (trimmed.startsWith("$$") && trimmed.endsWith("$$")) ||
        (trimmed.startsWith("$") && trimmed.endsWith("$") && trimmed.length > 2) ||
        (trimmed.includes("\\sum") || trimmed.includes("\\text{Score}") || trimmed.includes("\\times"));

      if (isStandaloneFormula && !trimmed.startsWith("-") && !trimmed.startsWith("•")) {
        const cleanedFormula = cleanMathSyntax(trimmed);
        elements.push(
          <div
            key={idx}
            className={`my-3 p-3 rounded-xl border font-mono text-center overflow-x-auto max-w-full ${
              isDark
                ? "bg-purple-950/20 border-purple-500/25 text-purple-200"
                : "bg-purple-50/80 border-purple-200 text-purple-950 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5 text-[9px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 mb-1">
              <Sigma className="w-3 h-3" />
              <span>Ranking Formula</span>
            </div>
            <div className="text-xs font-bold tracking-wide break-words">{cleanedFormula}</div>
          </div>
        );
        return;
      }

      // 4. Section Divider
      if (trimmed === "---" || trimmed === "***") {
        elements.push(<hr key={idx} className="my-3 border-black/[0.08] dark:border-white/[0.08]" />);
        return;
      }

      // 5. Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={idx}
            className={`text-xs font-bold uppercase tracking-wider mt-3.5 mb-1.5 flex items-center space-x-1.5 ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            <span>{line.replace("### ", "")}</span>
          </h3>
        );
        return;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={idx}
            className={`text-sm font-extrabold tracking-tight mt-4 mb-2 pb-1 border-b ${
              isDark ? "text-white border-white/10" : "text-slate-900 border-slate-200"
            }`}
          >
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }

      // 6. Numbered Steps / Items
      const numMatch = line.trim().match(/^(\d+)[.)]\s*(.*)$/);
      if (numMatch) {
        const num = numMatch[1];
        const rest = numMatch[2];
        elements.push(
          <div
            key={idx}
            className={`my-1.5 p-2.5 rounded-xl border flex items-start space-x-2.5 transition-colors max-w-full ${
              isDark
                ? "bg-white/[0.02] border-white/10 hover:border-white/15"
                : "bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-sm"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 ${
                isDark
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {num}
            </span>
            <div className="flex-1 min-w-0 leading-relaxed text-xs break-words">
              {renderInline(rest, isDark, handleFileClick)}
            </div>
          </div>
        );
        return;
      }

      // 7. Bullet Lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ") || line.trim().startsWith("* ")) {
        const bulletText = line.trim().replace(/^[-•*]\s*/, "");
        elements.push(
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0 leading-relaxed text-xs break-words">
              {renderInline(bulletText, isDark, handleFileClick)}
            </div>
          </div>
        );
        return;
      }

      // 8. Normal Paragraph
      if (line.trim()) {
        elements.push(
          <p key={idx} className="my-1.5 leading-relaxed text-xs break-words max-w-full">
            {renderInline(line, isDark, handleFileClick)}
          </p>
        );
      }
    });

    // Flush any pending table at EOF
    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  return <div className="space-y-1 w-full max-w-full overflow-hidden">{renderFormattedContent()}</div>;
}

// Clean LaTeX / Math strings to readable mathematical format
function cleanMathSyntax(raw: string): string {
  return raw
    .replace(/^\$\$|\$\$$|^\$|\$$/g, "")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\sum/g, "Σ")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\lambda/g, "λ")
    .replace(/\\_\{([^}]+)\}/g, "_$1")
    .replace(/\\([a-zA-Z]+)/g, "$1")
    .trim();
}

function renderInline(
  text: string,
  isDark: boolean,
  onOpenFile?: (path: string) => void
): React.ReactNode {
  // Split inline tokens by code, bold, math, or raw latex syntax
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$|P\([^\)]+\)|W_\{[^\}]+\})/g);

  return parts.map((part, i) => {
    // 1. LaTeX Math Token cleanup: P(\text{action}) or W_{\text{action}}
    if (part.startsWith("P(") || part.startsWith("W_{") || (part.startsWith("$") && part.endsWith("$"))) {
      const cleanMath = cleanMathSyntax(part);
      return (
        <span
          key={i}
          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded mx-0.5 inline-block ${
            isDark ? "bg-purple-950/40 text-purple-300 border border-purple-500/25" : "bg-purple-100 text-purple-800"
          }`}
        >
          {cleanMath}
        </span>
      );
    }

    // 2. Code, Path, and Multipliers
    if (part.startsWith("`") && part.endsWith("`")) {
      const val = part.slice(1, -1);
      const isMultiplier =
        (val.startsWith("+") || val.startsWith("-")) && !isNaN(parseFloat(val.replace(/[+x%]/g, "")));
      const isPositive = val.startsWith("+");
      const isNegative = val.startsWith("-");
      const isFilePath =
        val.includes("/") ||
        val.endsWith(".rs") ||
        val.endsWith(".py") ||
        val.endsWith(".scala") ||
        val.endsWith(".json") ||
        val.endsWith(".ts");

      if (isMultiplier && (isPositive || isNegative)) {
        return (
          <span
            key={i}
            className={`inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded font-mono font-bold text-[10px] shadow-sm whitespace-nowrap align-middle ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
            }`}
          >
            {val}
          </span>
        );
      }

      if (isFilePath) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onOpenFile?.(val)}
            title={`Click to open ${val} in Decompiler`}
            className={`inline-flex items-center max-w-full space-x-1 px-1.5 py-0.2 mx-0.5 rounded font-mono text-[10px] font-semibold transition-all cursor-pointer shadow-sm group align-middle ${
              isDark
                ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
            }`}
          >
            <FileCode className="w-2.5 h-2.5 text-indigo-500 flex-shrink-0" />
            <span className="underline decoration-indigo-400/50 break-all">{val}</span>
            <ExternalLink className="w-2 h-2 opacity-50 flex-shrink-0" />
          </button>
        );
      }

      return (
        <code
          key={i}
          className={`px-1.5 py-0.2 mx-0.5 rounded font-mono text-[10px] font-semibold break-all ${
            isDark ? "bg-white/10 text-amber-300 border border-white/5" : "bg-slate-200/80 text-slate-800"
          }`}
        >
          {val}
        </code>
      );
    }

    // 3. Bold Text
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}
