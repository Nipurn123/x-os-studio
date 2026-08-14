"use client";

import React, { useState } from "react";
import { PRODUCTION_ALGO_WEIGHTS } from "@/lib/algorithm/weights";
import {
  Sparkles,
  ShieldAlert,
  Cpu,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Bookmark,
  MessageSquare,
  Repeat,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function AlgorithmMatrixApp({
  theme = "light",
}: {
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  // Sandbox calculator state
  const [bookmarks, setBookmarks] = useState<number>(3);
  const [mutualReplies, setMutualReplies] = useState<number>(2);
  const [replies, setReplies] = useState<number>(5);
  const [quotes, setQuotes] = useState<number>(2);
  const [reposts, setReposts] = useState<number>(8);
  const [likes, setLikes] = useState<number>(25);
  const [linkClicks, setLinkClicks] = useState<number>(0);
  const [reports, setReports] = useState<number>(0);

  // Real-time calculation
  const totalScore = Number(
    (
      bookmarks * PRODUCTION_ALGO_WEIGHTS.share_via_copy_link +
      mutualReplies * PRODUCTION_ALGO_WEIGHTS.bidirectional_follow_reply +
      replies * PRODUCTION_ALGO_WEIGHTS.reply +
      quotes * PRODUCTION_ALGO_WEIGHTS.quote +
      reposts * PRODUCTION_ALGO_WEIGHTS.retweet +
      likes * PRODUCTION_ALGO_WEIGHTS.favorite +
      linkClicks * PRODUCTION_ALGO_WEIGHTS.open_link +
      reports * PRODUCTION_ALGO_WEIGHTS.report
    ).toFixed(1)
  );

  const equivalentLikes = Math.round(Math.max(0, totalScore) / 0.5);

  const rankingSignals = [
    {
      action: "Share via Copy Link (Bookmarks)",
      param: "ShareViaCopyLinkWeight",
      weight: "+20.0",
      power: "40x Like Power",
      why: "Single highest positive signal. X treats link copying and bookmarking as high-signal intent to save and reference.",
      rule: "Write referenceable cheat sheets, resource roundups, or code snippets.",
    },
    {
      action: "Mutual Follower Replies",
      param: "BidirectionalFollowReplyWeightBoost",
      weight: "+20.0",
      power: "40x Like Power",
      why: "Base reply weight (+5.0) + mutual follow boost (+15.0). Prioritizes authentic reciprocal conversations.",
      rule: "Actively reply to and build real relationships with mutual followers.",
    },
    {
      action: "Standard Conversation Reply",
      param: "ReplyWeight",
      weight: "+5.0",
      power: "10x Like Power",
      why: "Comments create conversation threads and dwell time.",
      rule: "End every post with an open question or prompt.",
    },
    {
      action: "Quote Tweet",
      param: "QuoteWeight",
      weight: "+5.0",
      power: "10x Like Power",
      why: "Amplifies post with commentary across follower networks.",
      rule: "Share polarizing case studies that invite commentary.",
    },
    {
      action: "Share via Direct Message (DM)",
      param: "ShareViaDmWeight",
      weight: "+5.0",
      power: "10x Like Power",
      why: "Dark social sharing signals extreme high trust.",
      rule: "Create high-utility posts coworkers want to send to their team.",
    },
    {
      action: "Follow Author from Post",
      param: "FollowAuthorWeight",
      weight: "+4.0",
      power: "8x Like Power",
      why: "Viewer hit 'Follow' directly on your post.",
      rule: "Build complete zero-to-one narratives that prove authority.",
    },
    {
      action: "Repost / Retweet",
      param: "RetweetWeight",
      weight: "+1.0",
      power: "2x Like Power",
      why: "Standard broadcast distribution.",
      rule: "Clear summary takeaways.",
    },
    {
      action: "Favorite / Like",
      param: "FavoriteWeight",
      weight: "+0.5",
      power: "1x Baseline",
      why: "Baseline casual positive signal.",
      rule: "Don't optimize only for likes -  optimize for bookmarks & replies.",
    },
    {
      action: "Open Link (Outbound URL)",
      param: "OpenLinkWeight",
      weight: "+0.2",
      power: "Downranked (-80%)",
      why: "Links pull users off X and kill dwell time.",
      rule: "Never put links in Tweet #1. Drop them in reply #1.",
    },
  ];

  const negativeDownranks = [
    {
      signal: "Report / Safety Violation",
      param: "ReportWeight",
      penalty: "-234.0",
      equivalent: "-468 Likes lost",
      avoidance: "Never post toxic harassment or hate bait.",
    },
    {
      signal: "Mute Author",
      param: "MuteAuthorWeight",
      penalty: "-58.8",
      equivalent: "-117 Likes lost",
      avoidance: "Avoid posting 10 repetitive spam tweets a day.",
    },
    {
      signal: "Not Interested",
      param: "NotInterestedWeight",
      penalty: "-43.2",
      equivalent: "-86 Likes lost",
      avoidance: "Avoid cheap engagement bait with no payoff.",
    },
    {
      signal: "Block Author",
      param: "BlockAuthorWeight",
      penalty: "-31.2",
      equivalent: "-62 Likes lost",
      avoidance: "Critique ideas constructively without attacking people.",
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-5 font-sans text-xs select-text">
      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className={`p-4 rounded-xl border space-y-1 shadow-2xs ${
            isDark ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/70"
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">
            HIGHEST POSITIVE MULTIPLIER
          </span>
          <div className="text-xl font-extrabold font-mono text-emerald-500">
            Copy-Link +20.0 (40x)
          </div>
          <p className="text-[11px] text-slate-500">
            1 link copy = 40 standard likes
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border space-y-1 shadow-2xs ${
            isDark ? "border-blue-500/30 bg-blue-500/5" : "border-blue-200 bg-blue-50/70"
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-blue-500 uppercase">
            MUTUAL FOLLOWER BOOST
          </span>
          <div className="text-xl font-extrabold font-mono text-blue-500">
            Mutual Reply +20.0 (40x)
          </div>
          <p className="text-[11px] text-slate-500">
            +15.0 boost added to base reply weight
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border space-y-1 shadow-2xs ${
            isDark ? "border-rose-500/30 bg-rose-500/5" : "border-rose-200 bg-rose-50/70"
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">
            WORST DOWNRANK PENALTY
          </span>
          <div className="text-xl font-extrabold font-mono text-rose-500">
            Report -234.0 (-468x)
          </div>
          <p className="text-[11px] text-slate-500">
            1 report destroys ~468 likes worth of reach
          </p>
        </div>
      </div>

      {/* Interactive Score Sandbox Calculator */}
      <div
        className={`p-5 rounded-2xl border space-y-4 shadow-sm ${
          isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-500" />
            <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
              Interactive Algorithmic Sandbox Calculator
            </h3>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Total Score:</span>
            <span
              className={`text-base font-black px-2.5 py-0.5 rounded-lg border ${
                totalScore >= 50
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : totalScore > 0
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
              }`}
            >
              {totalScore} pts ({equivalentLikes} Likes equivalent)
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* 1. Bookmarks */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-emerald-500 font-bold">Bookmarks (40x):</span>
              <span className="font-bold">{bookmarks}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={bookmarks}
              onChange={(e) => setBookmarks(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* 2. Mutual Replies */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-blue-500 font-bold">Mutual Replies (40x):</span>
              <span className="font-bold">{mutualReplies}</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={mutualReplies}
              onChange={(e) => setMutualReplies(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* 3. Replies */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-purple-500 font-bold">Replies (10x):</span>
              <span className="font-bold">{replies}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={replies}
              onChange={(e) => setReplies(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* 4. Quotes */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-indigo-500 font-bold">Quotes (10x):</span>
              <span className="font-bold">{quotes}</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={quotes}
              onChange={(e) => setQuotes(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* 5. Reposts */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-cyan-500 font-bold">Reposts (2x):</span>
              <span className="font-bold">{reposts}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={reposts}
              onChange={(e) => setReposts(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* 6. Likes */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Likes (1x Baseline):</span>
              <span className="font-bold">{likes}</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              value={likes}
              onChange={(e) => setLikes(Number(e.target.value))}
              className="w-full accent-slate-400"
            />
          </div>

          {/* 7. Outbound Link Clicks */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-amber-500 font-bold">Link Clicks (0.4x):</span>
              <span className="font-bold">{linkClicks}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={linkClicks}
              onChange={(e) => setLinkClicks(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* 8. Reports */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-rose-500 font-bold">Reports (-468x):</span>
              <span className="font-bold text-rose-500">{reports}</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              value={reports}
              onChange={(e) => setReports(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Positive Multiplier Table */}
      <div
        className={`p-5 rounded-2xl border space-y-3 shadow-sm ${
          isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white"
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-500 border-b border-white/[0.08] pb-2">
          <Sparkles className="h-4 w-4" />
          <span>Positive Engagement Ranking Signals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b font-mono text-[11px] ${isDark ? "border-white/10 text-slate-400" : "border-black/10 text-slate-500"}`}>
                <th className="pb-2 font-bold">Action Signal</th>
                <th className="pb-2 font-bold">Weight ($w_i$)</th>
                <th className="pb-2 font-bold">Power vs Like</th>
                <th className="pb-2 font-bold">Creator Playbook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-sans">
              {rankingSignals.map((sig, i) => (
                <tr key={i} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.02]"}>
                  <td className="py-2.5 font-bold pr-2">
                    <span className={isDark ? "text-white" : "text-black"}>{sig.action}</span>
                    <span className="block font-mono text-[10px] text-slate-400 font-normal">
                      {sig.param}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-emerald-500">
                    {sig.weight}
                  </td>
                  <td className="py-2.5 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        sig.power.includes("40x")
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : sig.power.includes("10x")
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : isDark ? "bg-white/10 text-slate-300" : "bg-black/5 text-slate-700"
                      }`}
                    >
                      {sig.power}
                    </span>
                  </td>
                  <td className={`py-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {sig.rule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Negative Penalties Grid */}
      <div
        className={`p-5 rounded-2xl border space-y-3 shadow-sm ${
          isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white"
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-500 border-b border-white/[0.08] pb-2">
          <ShieldAlert className="h-4 w-4" />
          <span>The Negative Downrank Multipliers (Penalties)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {negativeDownranks.map((neg, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border space-y-1.5 ${
                isDark ? "border-rose-500/20 bg-rose-500/5" : "border-rose-200 bg-rose-50/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs ${isDark ? "text-rose-300" : "text-rose-950"}`}>
                  {neg.signal}
                </span>
                <span className="font-mono font-bold text-rose-500 bg-rose-500/20 px-2 py-0.5 rounded text-[11px]">
                  {neg.penalty}
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? "text-rose-200" : "text-rose-900"}`}>
                Impact: <strong>{neg.equivalent}</strong>
              </p>
              <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                How to avoid: {neg.avoidance}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
