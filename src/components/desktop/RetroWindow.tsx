"use client";

import React, { useState } from "react";
import { Minus, Square, X, Maximize2 } from "lucide-react";

interface RetroWindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
}

export default function RetroWindow({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
  children,
}: RetroWindowProps) {
  const [isShaded, setIsShaded] = useState(false);

  if (!isOpen || isMinimized) return null;

  return (
    <div
      onClick={onFocus}
      style={{ zIndex }}
      className={`absolute inset-x-2 sm:inset-x-6 top-9 bottom-3 flex flex-col rounded-md border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] shadow-2xl overflow-hidden font-sans select-none ${
        isShaded ? "h-8 bottom-auto" : ""
      }`}
    >
      {/* Classic Mac OS System 7 / Platinum Title Bar */}
      <div className="relative flex h-7 items-center justify-between border-b-2 border-[#404040] bg-[#d6d6ce] px-2 text-black select-none overflow-hidden">
        {/* Pinstripe Background Pattern */}
        <div className="absolute inset-0 flex flex-col justify-center gap-[2px] px-8 opacity-60 pointer-events-none">
          <div className="h-[1px] bg-black w-full" />
          <div className="h-[1px] bg-white w-full" />
          <div className="h-[1px] bg-black w-full" />
          <div className="h-[1px] bg-white w-full" />
          <div className="h-[1px] bg-black w-full" />
          <div className="h-[1px] bg-white w-full" />
        </div>

        {/* Left: Classic Mac Square Close Box */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="relative z-10 flex h-4 w-4 items-center justify-center border border-t-[#404040] border-l-[#404040] border-r-white border-b-white bg-[#d6d6ce] active:bg-[#404040] transition-colors"
          title="Close Window"
        >
          <div className="h-1.5 w-1.5 bg-[#404040]" />
        </button>

        {/* Center: Window Title Plaque */}
        <div className="relative z-10 bg-[#d6d6ce] px-3 py-0.5 border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center gap-2 max-w-[70%] truncate shadow-2xs">
          {icon}
          <span className="font-mono text-xs font-bold tracking-tight text-black truncate">
            {title}
          </span>
        </div>

        {/* Right: Classic Mac Zoom Box & Window Shade Box */}
        <div className="relative z-10 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShaded(!isShaded);
            }}
            className="flex h-4 w-4 items-center justify-center border border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] active:bg-slate-300"
            title="Window Shade (Collapse)"
          >
            <div className="h-2 w-2 border-t-2 border-b-2 border-[#404040]" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="flex h-4 w-4 items-center justify-center border border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] active:bg-slate-300"
            title="Minimize to Dock"
          >
            <div className="h-1.5 w-2 border border-[#404040] bg-[#808080]" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Hidden if Window is Shaded) */}
      {!isShaded && (
        <div className="flex-1 overflow-auto bg-[#ebebe6] p-3 sm:p-4 text-slate-900 border-t border-white">
          {children}
        </div>
      )}

      {/* Classic Mac Status Bar */}
      {!isShaded && (
        <div className="flex h-6 items-center justify-between border-t-2 border-t-white border-b-[#84847e] bg-[#d6d6ce] px-3 font-mono text-[11px] text-slate-700 select-none">
          <span className="truncate">Finder · xai-org/x-algorithm (20 Subsystems)</span>
          <span className="hidden sm:inline text-slate-500 font-bold">Macintosh HD · 1.44 MB Floppy Ready</span>
        </div>
      )}
    </div>
  );
}
