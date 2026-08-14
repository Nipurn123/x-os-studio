"use client";

import React, { useState, useRef, useEffect } from "react";
import { REPOSITORY_TREE, getAllFiles } from "@/lib/decompiler/repositoryData";
import { auditPost } from "@/lib/algorithm/scorer";
import { Terminal as TerminalIcon, Send, CornerDownLeft, Play } from "lucide-react";

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

export default function TerminalApp({
  theme = "light",
}: {
  theme?: "dark" | "light";
}) {
  const allFilesList = getAllFiles(REPOSITORY_TREE);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "neofetch",
      output: (
        <div className="space-y-2 text-slate-300 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="text-emerald-400 font-black text-2xl">𝕏</div>
            <div>
              <div className="text-white font-bold">x-algorithm @ x-os-studio</div>
              <div className="text-slate-400 text-[11px]">-------------------------</div>
              <div className="text-slate-400 text-[11px]">OS: macOS Sequoia (X-OS Studio v2026)</div>
              <div className="text-slate-400 text-[11px]">Host: xai-org/x-algorithm (2,015 files)</div>
              <div className="text-slate-400 text-[11px]">Kernel: Rust 1.80 / JAX / Scala 2.13</div>
              <div className="text-slate-400 text-[11px]">Shell: zsh 5.9 (x86_64-apple-darwin)</div>
            </div>
          </div>
          <div className="text-slate-400 pt-1 text-[11px]">
            Type <span className="text-yellow-300 font-bold">help</span> or click any quick command chip above to explore the engine.
          </div>
        </div>
      ),
    },
  ]);

  // Localized container scroll ONLY -  never scrolls the window or parent page
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [history]);

  const quickCommands = [
    { label: "tree", cmd: "tree" },
    { label: "weights", cmd: "weights" },
    { label: "explain ranking_scorer", cmd: "explain ranking_scorer" },
    { label: "explain author_cold_start", cmd: "explain author_cold_start" },
    { label: "explain recsys_model", cmd: "explain recsys_model" },
    { label: "explain bidirectional_follow", cmd: "explain bidirectional_follow" },
    { label: "score \"7 tools that save 20h\"", cmd: 'score "7 tools that save 20h of coding (bookmark this)"' },
    { label: "clear", cmd: "clear" },
  ];

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    let outputNode: React.ReactNode;

    switch (command) {
      case "help":
        outputNode = (
          <div className="space-y-1.5 text-slate-300 font-mono text-xs">
            <div className="text-yellow-300 font-bold">X-OS Terminal Commands:</div>
            <div>  <span className="text-emerald-400 font-bold">tree</span> / <span className="text-emerald-400 font-bold">ls</span> -  List all 2,015 indexed files and subfolders</div>
            <div>  <span className="text-emerald-400 font-bold">explain &lt;file|module&gt;</span> -  Decompile any file into plain English (e.g. `explain ranking_scorer`, `explain cold_start`, `explain phoenix`)</div>
            <div>  <span className="text-emerald-400 font-bold">weights</span> -  Display production ranking weights (+20x copy link, +5x reply, -234x report)</div>
            <div>  <span className="text-emerald-400 font-bold">score &quot;&lt;text&gt;&quot;</span> -  Test and score any tweet draft in real time</div>
            <div>  <span className="text-emerald-400 font-bold">clear</span> -  Clear terminal output</div>
            <div>  <span className="text-emerald-400 font-bold">about</span> -  Show system architecture summary</div>
          </div>
        );
        break;

      case "tree":
      case "ls":
        outputNode = (
          <div className="space-y-1 text-slate-300 font-mono text-xs max-h-80 overflow-y-auto custom-scrollbar p-1">
            <div className="text-emerald-400 font-bold">Repository Tree ({allFilesList.length} indexed files):</div>
            {allFilesList.slice(0, 100).map((s, idx) => (
              <div key={s.id} className="truncate">
                {idx + 1}. <span className="text-blue-400 font-bold">{s.path}</span> <span className="text-slate-400">({s.language || s.category})</span>
              </div>
            ))}
            {allFilesList.length > 100 && (
              <div className="text-slate-500 italic pt-1">
                ... and {allFilesList.length - 100} more files (use `explain &lt;name&gt;` to inspect any file)
              </div>
            )}
          </div>
        );
        break;

      case "weights":
        outputNode = (
          <div className="space-y-1.5 text-slate-300 font-mono text-xs">
            <div className="text-emerald-400 font-bold">Production Blend Weights (home-mixer/params/param.rs):</div>
            <div>• <span className="text-emerald-300 font-bold">ShareViaCopyLink (+20.0)</span> -  40x Like Multiplier (HIGHEST)</div>
            <div>• <span className="text-emerald-300 font-bold">BidirectionalFollowReplyBoost (+15.0)</span> -  +20.0 Total for Mutual Replies</div>
            <div>• <span className="text-blue-300 font-bold">Reply (+5.0)</span> -  10x Like Multiplier</div>
            <div>• <span className="text-blue-300 font-bold">Quote (+5.0)</span> -  10x Like Multiplier</div>
            <div>• <span className="text-blue-300 font-bold">ShareViaDm (+5.0)</span> -  10x Like Multiplier</div>
            <div>• <span className="text-blue-300 font-bold">FollowAuthor (+4.0)</span> -  8x Like Multiplier</div>
            <div>• <span className="text-slate-400">Favorite (+0.5)</span> -  1x Standard Baseline</div>
            <div>• <span className="text-amber-400">OpenLink (+0.2)</span> -  Outbound Link Penalty (-80% vs native)</div>
            <div>• <span className="text-rose-400 font-bold">Report (-234.0)</span> -  ~468 Likes Destroyed</div>
            <div>• <span className="text-rose-400 font-bold">MuteAuthor (-58.8)</span> -  ~117 Likes Destroyed</div>
            <div>• <span className="text-rose-400 font-bold">NotInterested (-43.2)</span> -  ~86 Likes Destroyed</div>
          </div>
        );
        break;

      case "explain":
        const target = arg.toLowerCase().replace(/[-/.]/g, "");
        const found = allFilesList.find(
          (s) =>
            s.id.toLowerCase().includes(target) ||
            s.name.toLowerCase().replace(/[-/.]/g, "").includes(target) ||
            s.path.toLowerCase().replace(/[-/.]/g, "").includes(target)
        );
        if (found) {
          outputNode = (
            <div className="space-y-2 rounded-xl bg-white/[0.04] p-3.5 border border-white/10 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-yellow-300 font-bold">{found.name}</span>
                <span className="text-slate-400 text-[10px]">{found.path}</span>
              </div>
              <div><strong className="text-white">📖 In Simple Terms:</strong> <span className="text-slate-300">{found.humanTranslation.inSimpleTerms}</span></div>
              <div><strong className="text-blue-300">⚙️ Why X Engineers Built This:</strong> <span className="text-slate-300">{found.humanTranslation.whyThisExists}</span></div>
              <div><strong className="text-emerald-400">📈 Impact on Reach:</strong> <span className="text-slate-300">{found.humanTranslation.howItAffectsYourReach}</span></div>
              <div><strong className="text-amber-300">✅ Creator Rule:</strong> <span className="text-slate-300">{found.humanTranslation.theGoldenRule}</span></div>
            </div>
          );
        } else {
          outputNode = (
            <div className="text-rose-400">
              Module not found. Try `tree` to see file list or `explain ranking_scorer`.
            </div>
          );
        }
        break;

      case "score":
        const draft = arg.replace(/^["']|["']$/g, "");
        if (!draft) {
          outputNode = <div className="text-amber-400">Usage: `score &quot;your tweet draft here&quot;`</div>;
        } else {
          const res = auditPost(draft);
          outputNode = (
            <div className="space-y-1.5 rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/30 font-mono text-xs">
              <div className="text-emerald-400 font-bold text-sm">
                Score: {res.scaledScore}/100 (Grade {res.letterGrade})
              </div>
              <div className="text-slate-300">• Word count: {res.metrics.wordCount} words (~{res.metrics.readingTimeSeconds}s dwell)</div>
              <div className="text-slate-300">• Hook stopping power: {res.metrics.hookStoppingScore}/100</div>
              <div className="text-slate-300">• Bookmark potential: {(res.probabilities.share_via_copy_link * 100).toFixed(0)}%</div>
              <div className="text-slate-300">• Reply magnetism: {(res.probabilities.reply * 100).toFixed(0)}%</div>
              {res.metrics.hasOutboundLink && (
                <div className="text-amber-400 font-bold">⚠️ Outbound link detected: -80% reach penalty</div>
              )}
            </div>
          );
        }
        break;

      case "clear":
        setHistory([]);
        return;

      case "about":
        outputNode = (
          <div className="space-y-1 text-slate-300 font-mono text-xs">
            <div className="text-white font-bold">X-OS Studio Algorithm Terminal</div>
            <div>Indexes 2,015 production source files from xai-org/x-algorithm under Apache 2.0 license.</div>
            <div>Built for creators and engineers to decompile recommendation algorithms with zero friction.</div>
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="text-rose-400 font-mono text-xs">
            zsh: command not found: {command}. Type <span className="text-yellow-300 font-bold">help</span> for command list.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: trimmed, output: outputNode }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full rounded-xl bg-[#0b0d14] border border-white/[0.1] shadow-2xl overflow-hidden font-mono text-xs select-text">
      {/* Terminal Top Window Tab */}
      <div className="flex h-9 items-center justify-between border-b border-white/[0.08] bg-black/60 px-4 select-none shrink-0">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <TerminalIcon className="h-3.5 w-3.5 text-purple-400" />
          <span className="font-bold text-white">zsh</span>
          <span className="text-slate-500"> -  80x24</span>
          <span className="text-slate-500 font-sans hidden sm:inline">~/x-algorithm (main)</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-bold">Connected</span>
        </div>
      </div>

      {/* Quick Command Chips Toolbar */}
      <div className="flex items-center gap-1.5 p-2 bg-black/40 border-b border-white/[0.06] overflow-x-auto select-none shrink-0 custom-scrollbar">
        <span className="text-[10px] text-slate-500 font-bold uppercase pl-1 pr-1 shrink-0">
          Quick:
        </span>
        {quickCommands.map((qc, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCommand(qc.cmd)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-blue-600 hover:text-white text-[11px] font-mono text-slate-300 border border-white/5 transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <Play className="h-2.5 w-2.5 text-emerald-400" />
            <span>{qc.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Body Output Container (Internal Scrolling Only) */}
      <div
        ref={outputContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0b0d14]"
      >
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-bold">➜</span>
              <span className="text-cyan-400 font-bold">x-algorithm</span>
              <span className="text-purple-400">git:(main)</span>
              <span className="text-white font-semibold">{entry.command}</span>
            </div>
            <div className="pl-4">{entry.output}</div>
          </div>
        ))}
      </div>

      {/* Terminal Input Footer (No autoFocus to prevent browser page-jumping) */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-white/[0.08] bg-black/70 px-4 py-2.5 shrink-0"
      >
        <span className="text-emerald-400 font-bold">➜</span>
        <span className="text-cyan-400 font-bold text-xs hidden sm:inline">x-algorithm</span>
        <span className="text-purple-400 text-xs hidden sm:inline">git:(main)</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type a command (e.g. 'weights', 'tree', 'explain ranking_scorer')..."
          className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <span>Run</span>
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}
