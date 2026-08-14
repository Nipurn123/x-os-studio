"use client";

import React, { useState } from "react";
import { ThreadTweet } from "../lib/types";
import { Plus, Trash2, ArrowDown, Sparkles, Copy, Check, TrendingDown, Layers } from "lucide-react";

interface ThreadBuilderProps {
  initialContent: string;
}

export default function ThreadBuilder({ initialContent }: ThreadBuilderProps) {
  const [tweets, setTweets] = useState<ThreadTweet[]>([
    {
      id: "1",
      order: 1,
      content: initialContent || "7 tools that will save you 20 hours a week (bookmark this):\n\n1. Claude Code - terminal coding\n2. Bolt.new - instant prototypes\n3. Cursor - fast refactors\n\nFull breakdown below 🧵👇",
      characterCount: 180,
      predictedDropOffPct: 0,
      role: "hook",
    },
    {
      id: "2",
      order: 2,
      content: "1. Tool One Deep Dive\n\nHere is why this tool creates 10x leverage in your daily engineering workflow.\n\nKey advantage:\n- 0 latency\n- Complete privacy\n- Open source",
      characterCount: 165,
      predictedDropOffPct: 15,
      role: "meat",
    },
    {
      id: "3",
      order: 3,
      content: "Summary & Action Item:\n\nIf you found this thread valuable:\n1. Follow @nipurn for more breakdowns\n2. Repost tweet 1 to share with your network\n3. Bookmark this thread for later",
      characterCount: 175,
      predictedDropOffPct: 35,
      role: "cta",
    },
  ]);

  const [copiedAll, setCopiedAll] = useState(false);

  const handleAddTweet = () => {
    const nextOrder = tweets.length + 1;
    const dropOff = Math.min(65, 10 + nextOrder * 8);
    const newTweet: ThreadTweet = {
      id: String(Date.now()),
      order: nextOrder,
      content: `Tweet ${nextOrder} context / insight...`,
      characterCount: 30,
      predictedDropOffPct: dropOff,
      role: nextOrder === 1 ? "hook" : "meat",
    };
    setTweets([...tweets, newTweet]);
  };

  const handleUpdateContent = (id: string, newText: string) => {
    setTweets(
      tweets.map((t) =>
        t.id === id
          ? {
              ...t,
              content: newText,
              characterCount: newText.length,
            }
          : t
      )
    );
  };

  const handleDelete = (id: string) => {
    if (tweets.length <= 1) return;
    const filtered = tweets.filter((t) => t.id !== id);
    const reordered = filtered.map((t, idx) => ({
      ...t,
      order: idx + 1,
      predictedDropOffPct: idx === 0 ? 0 : Math.min(65, 10 + (idx + 1) * 8),
    }));
    setTweets(reordered);
  };

  const handleCopyThread = () => {
    const formatted = tweets
      .map((t, i) => `[Tweet ${i + 1}/${tweets.length}]\n${t.content}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-obsidian-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Thread Sequencer &amp; Drop-off Predictor
            </h3>
            <p className="text-xs text-slate-400">
              Simulates retention curve from Hook to Climax and final CTA conversion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddTweet}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Tweet</span>
          </button>

          <button
            onClick={handleCopyThread}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
          >
            {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedAll ? "Thread Copied!" : "Copy Full Thread"}</span>
          </button>
        </div>
      </div>

      {/* Tweet Timeline Sequencer */}
      <div className="space-y-4">
        {tweets.map((tweet, idx) => (
          <div
            key={tweet.id}
            className="relative flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20"
          >
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  {tweet.order}
                </span>
                <span className="font-bold text-slate-200 uppercase tracking-wider">
                  {tweet.order === 1
                    ? "Hook Tweet (Scroll Stopper)"
                    : tweet.order === tweets.length
                    ? "Final CTA (Follow / Bookmark)"
                    : `Thread Insight #${tweet.order - 1}`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className={tweet.characterCount > 280 ? "text-rose-400 font-bold" : "text-slate-400"}>
                  {tweet.characterCount} / 280 chars
                </span>

                {tweet.order > 1 && (
                  <span className="text-amber-400/80 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    -{tweet.predictedDropOffPct}% drop-off
                  </span>
                )}

                {tweets.length > 1 && (
                  <button
                    onClick={() => handleDelete(tweet.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Input textarea */}
            <textarea
              value={tweet.content}
              onChange={(e) => handleUpdateContent(tweet.id, e.target.value)}
              rows={3}
              className="w-full resize-y rounded-lg bg-obsidian-950/80 p-3 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none border border-white/5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
