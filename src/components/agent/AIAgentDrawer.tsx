"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Expand,
  Shrink,
} from "lucide-react";
import { FormattedMarkdown } from "./FormattedMarkdown";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface AIAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  activeFile?: {
    path: string;
    description?: string;
    subsystem?: string;
  };
  onOpenFile?: (path: string) => void;
}

const STORAGE_KEY = "x_os_intelligence_chat_history_v1";

const QUICK_PROMPTS = [
  {
    label: "Why are outbound links downranked?",
    prompt: "Why do outbound links suffer an 80% reach penalty in the X algorithm code?",
  },
  {
    label: "Explain Phoenix Two-Tower ranking",
    prompt: "Explain how the Phoenix Two-Tower retrieval and Heavy Ranker transformer work in JAX.",
  },
  {
    label: "How does mutual follow boost work?",
    prompt: "How does the +20.0 mutual conversation boost (BidirectionalFollowReplyBoost) work?",
  },
  {
    label: "What happens if a tweet gets reported?",
    prompt: "What is the mathematical penalty of receiving a report (-234.0) in the ranking formula?",
  },
];

const INITIAL_MESSAGE: Message = {
  id: "welcome-msg",
  role: "assistant",
  content: `### ⚡ X Algorithm Intelligence Copilot

Ask anything about the open-source X recommendation engine.

\`\`\`diagram
Sourcing (500M Posts) -> Hydration -> Visibility Filtering -> Phoenix Heavy Ranker -> Top 20 Feed
\`\`\`

- **Production Weights**: Inquire about \`+20.0\` CopyLink, \`+20.0\` Mutual Conversation, or \`-234.0\` Report penalties.
- **Subsystem Breakdown**: Explore \`phoenix/\`, \`thunder/\`, \`simclusters/\`, or \`home-mixer/\`.
- **Code Navigation**: Tap any highlighted file path to jump to that file in the Finder Decompiler.`,
  timestamp: "12:00 PM",
};

type ViewMode = "compact" | "wide" | "fullscreen";

export function AIAgentDrawer({
  isOpen,
  onClose,
  isDark,
  activeFile,
  onOpenFile,
}: AIAgentDrawerProps): React.JSX.Element | null {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load local chat history", e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn("Failed to save local chat history", e);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear local chat history", e);
    }
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `### 🔄 Session Reset\nChat history cleared from your browser storage. Ask any question about the X recommendation algorithm codebase.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSend = async (customPrompt?: string) => {
    const messageContent = (customPrompt || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const assistantId = `assistant-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          activeFile,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: accumulatedText } : msg
          )
        );
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: `⚠️ Failed to get response: ${err.message || "Please check connection"}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Responsive Styles: Mobile (<640px) uses true iOS Bottom Sheet (top-8 inset-x-0 bottom-0)
  const getContainerStyles = () => {
    if (viewMode === "fullscreen") {
      return "fixed inset-1 sm:inset-4 z-50 rounded-2xl sm:rounded-3xl";
    }
    if (viewMode === "wide") {
      return "fixed top-8 bottom-16 right-2 sm:right-6 w-[860px] max-w-[96vw] z-50 rounded-2xl";
    }
    // Compact Mode: On mobile, full-width bottom sheet; on desktop, sleek side floating drawer
    return "fixed inset-x-0 sm:inset-x-auto sm:right-6 bottom-0 sm:bottom-16 top-10 sm:top-8 w-full sm:w-[450px] z-50 rounded-t-3xl sm:rounded-2xl";
  };

  return (
    <>
      {/* Dimmed backdrop when in Mobile Sheet or Fullscreen Mode */}
      <div
        onClick={() => {
          if (viewMode === "fullscreen") {
            setViewMode("compact");
          } else {
            onClose();
          }
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity animate-in fade-in sm:hidden"
      />

      {viewMode === "fullscreen" && (
        <div
          onClick={() => setViewMode("compact")}
          className="hidden sm:block fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity animate-in fade-in"
        />
      )}

      <div
        className={`${getContainerStyles()} transition-all duration-300 flex flex-col ${
          isDark
            ? "bg-[#11141e]/95 border border-white/15 text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
            : "bg-[#fcfcfe]/95 border border-slate-300 text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
        } backdrop-blur-3xl overflow-hidden`}
      >
        {/* iOS Native Drag Handle on Mobile */}
        <div className="flex sm:hidden items-center justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-400/40 dark:bg-white/20" />
        </div>

        {/* Apple Native Minimal Titlebar */}
        <div
          className={`flex items-center justify-between px-3.5 py-2 sm:py-2.5 border-b select-none shrink-0 ${
            isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200/90 bg-slate-50/80"
          }`}
        >
          {/* Left: Traffic Lights & Minimal Label */}
          <div className="flex items-center space-x-2.5">
            {/* Traffic Lights on Desktop */}
            <div className="hidden sm:flex items-center space-x-2 mr-0.5">
              <button
                onClick={onClose}
                title="Close (Esc)"
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity flex items-center justify-center group cursor-pointer"
              >
                <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === "compact" ? "wide" : "compact")}
                title="Toggle Compact / Wide"
                className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity flex items-center justify-center group cursor-pointer"
              >
                <div className="w-1.5 h-0.5 bg-black/60 opacity-0 group-hover:opacity-100" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === "fullscreen" ? "compact" : "fullscreen")}
                title={viewMode === "fullscreen" ? "Exit Fullscreen" : "Enter Fullscreen"}
                className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity flex items-center justify-center group cursor-pointer"
              >
                <Expand className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
              </button>
            </div>

            {/* Siri Orb */}
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-sm">
              <div className="w-full h-full rounded-full bg-[#11141e] flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
              </div>
            </div>

            <span className="text-xs font-bold tracking-tight">Intelligence Copilot</span>
          </div>

          {/* Right: Apple Segmented Pill & Trash */}
          <div className="flex items-center space-x-1.5">
            {/* Apple Segmented View Control on Tablet / Desktop */}
            <div
              className={`hidden sm:flex items-center p-0.5 rounded-lg border text-[10px] font-medium ${
                isDark ? "bg-black/50 border-white/10" : "bg-slate-200/80 border-slate-300"
              }`}
            >
              <button
                onClick={() => setViewMode("compact")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "compact"
                    ? isDark ? "bg-white/20 text-white font-bold" : "bg-white text-black font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Drawer
              </button>
              <button
                onClick={() => setViewMode("wide")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "wide"
                    ? isDark ? "bg-white/20 text-white font-bold" : "bg-white text-black font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Wide
              </button>
              <button
                onClick={() => setViewMode("fullscreen")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "fullscreen"
                    ? isDark ? "bg-white/20 text-white font-bold" : "bg-white text-black font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Full
              </button>
            </div>

            <button
              onClick={handleClear}
              title="Clear Chat History"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-black"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              title="Close Drawer"
              className={`flex sm:hidden p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-600 hover:text-black"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 text-xs select-text overflow-x-hidden">
          <div className={`${viewMode === "fullscreen" ? "max-w-4xl mx-auto space-y-4" : "space-y-3"}`}>
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col w-full ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] text-slate-400 select-none">
                    {isUser ? (
                      <span className="font-semibold text-slate-500">You</span>
                    ) : (
                      <span className={`font-bold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                        X-OS Intelligence
                      </span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative group w-full ${
                      isUser
                        ? "max-w-[88%] sm:max-w-[70%] bg-[#007AFF] text-white self-end ml-auto rounded-2xl px-3.5 py-2.5 shadow-sm"
                        : viewMode === "fullscreen"
                        ? "max-w-full rounded-2xl px-5 py-4 shadow-sm"
                        : "max-w-[98%] sm:max-w-[96%] rounded-2xl px-3.5 py-2.5 shadow-sm"
                    } ${
                      !isUser &&
                      (isDark
                        ? "bg-white/[0.04] border border-white/10 text-slate-200"
                        : "bg-white border border-slate-200/90 text-slate-900 shadow-sm")
                    } transition-all overflow-hidden`}
                  >
                    {/* Formatted Markdown */}
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-medium break-words leading-relaxed text-xs sm:text-sm">
                        {msg.content}
                      </div>
                    ) : msg.content ? (
                      <FormattedMarkdown content={msg.content} isDark={isDark} onOpenFile={onOpenFile} />
                    ) : (
                      <div className="flex items-center space-x-2 py-1 text-slate-400 italic">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>Reasoning with X recommendation architecture...</span>
                      </div>
                    )}

                    {!isUser && msg.content && (
                      <div className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className={`p-1.5 rounded-lg ${
                            isDark
                              ? "bg-black/60 hover:bg-black/80 text-slate-300"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                          } transition-colors cursor-pointer`}
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts Container */}
        <div
          className={`px-3 py-2 border-t overflow-x-auto no-scrollbar flex items-center space-x-1.5 select-none shrink-0 ${
            isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-200 bg-slate-50/70"
          }`}
        >
          <div className={`${viewMode === "fullscreen" ? "max-w-4xl mx-auto w-full flex items-center space-x-1.5 overflow-x-auto no-scrollbar" : "flex items-center space-x-1.5"}`}>
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.prompt)}
                disabled={isLoading}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border border-white/10 active:scale-95"
                    : "bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-sm active:scale-95"
                } disabled:opacity-50`}
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inset Search Composer (with bottom safe-area on mobile iOS) */}
        <div
          className={`p-2.5 sm:p-3.5 border-t shrink-0 pb-safe ${
            isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white"
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={`flex items-center space-x-2 ${viewMode === "fullscreen" ? "max-w-4xl mx-auto" : ""}`}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any question about the algorithm..."
              disabled={isLoading}
              className={`flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs outline-none transition-all ${
                isDark
                  ? "bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50"
                  : "bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50"
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 sm:p-2.5 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 flex-shrink-0 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
