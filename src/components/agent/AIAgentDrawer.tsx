"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  HelpCircle,
  Copy,
  Check,
  Code,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Trash2,
} from "lucide-react";

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

const QUICK_PROMPTS = [
  { label: "Why are outbound links downranked?", prompt: "Why do outbound links suffer an 80% reach penalty in the X algorithm code?" },
  { label: "Explain Phoenix Two-Tower ranking", prompt: "Explain how the Phoenix Two-Tower retrieval and Heavy Ranker transformer work in JAX." },
  { label: "How does mutual follow boost work?", prompt: "How does the +20.0 mutual conversation boost (BidirectionalFollowReplyBoost) work?" },
  { label: "What happens if a tweet gets reported?", prompt: "What is the mathematical penalty of receiving a report (-234.0) in the ranking formula?" },
  { label: "Audit my tweet for reach", prompt: "How do I audit and optimize a tweet draft for maximum dwell time, bookmarks, and reach?" },
];

export function AIAgentDrawer({
  isOpen,
  onClose,
  isDark,
  activeFile,
  onOpenFile,
}: AIAgentDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `### ⚡ Welcome to X Algorithm AI Agent (Gemini 3.7 Flash)

I am your resident **X Recommendation Systems Engineer**. I have full architectural context on all **2,015 files** in the open-source algorithm repository.

**Ask me anything about:**
- Mathematical scoring weights (+20.0 CopyLink, +20.0 Mutual Reply, -234.0 Report)
- Phoenix Transformer Two-Tower retrieval & JAX serving pipelines
- Visibility Filtering, Agatha, BDSM & User-Cred-v2 account reputation
- Practical strategies to maximize your impressions & monetization reach`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `Chat session reset. What would you like to explore in the X recommendation engine?`,
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
                content: `⚠️ Failed to get response from AI Agent: ${err.message || "Please check connection"}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-11 bottom-16 z-50 transition-all duration-300 flex flex-col ${
        isExpanded ? "w-[680px] right-4" : "w-[440px] right-4"
      } ${
        isDark
          ? "bg-[#0b0e17]/95 border border-white/15 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          : "bg-white/95 border border-slate-300 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      } backdrop-blur-2xl rounded-2xl overflow-hidden`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b select-none ${
          isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50/80"
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold tracking-tight">X-OS AI Copilot</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-400">2,015 files context indexed</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-600"
            }`}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            title="Clear Chat"
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-600"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close (Esc)"
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active File Context Pill if available */}
      {activeFile && activeFile.path && (
        <div
          className={`flex items-center justify-between px-3 py-1.5 text-[10px] border-b ${
            isDark
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
              : "bg-indigo-50 border-indigo-200 text-indigo-700"
          }`}
        >
          <div className="flex items-center space-x-1.5 truncate">
            <Code className="w-3 h-3 flex-shrink-0" />
            <span className="font-mono truncate">{activeFile.path}</span>
          </div>
          <span className="font-semibold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20">
            Active Context
          </span>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs select-text">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] text-slate-400">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="w-2.5 h-2.5" />
                  </>
                ) : (
                  <>
                    <Bot className="w-2.5 h-2.5 text-indigo-400" />
                    <span className="font-semibold text-indigo-400">X-OS Copilot</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`relative group max-w-[92%] rounded-xl px-3.5 py-2.5 ${
                  isUser
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20"
                    : isDark
                    ? "bg-white/[0.04] border border-white/10 text-slate-200"
                    : "bg-slate-100 border border-slate-200 text-slate-800"
                }`}
              >
                {/* Content */}
                <div className="prose prose-invert prose-xs max-w-none leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content || (
                    <span className="inline-flex items-center space-x-1 text-slate-400 italic">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                      <span>Thinking with Gemini 3.7 Flash...</span>
                    </span>
                  )}
                </div>

                {/* Copy action */}
                {!isUser && msg.content && (
                  <div className="absolute right-2 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className={`p-1 rounded bg-black/40 hover:bg-black/60 text-slate-300 transition-colors`}
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
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

      {/* Quick Prompts */}
      <div
        className={`px-3 py-2 border-t overflow-x-auto no-scrollbar flex items-center space-x-1.5 ${
          isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-200 bg-slate-50"
        }`}
      >
        <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
              isDark
                ? "bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 border border-white/10"
                : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm"
            } disabled:opacity-50`}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={`p-3 border-t flex items-center space-x-2 ${
          isDark ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask any question about the X algorithm..."
          disabled={isLoading}
          className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-all ${
            isDark
              ? "bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              : "bg-slate-50 border border-slate-300 text-black placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
