"use client";

import React from "react";

interface DesktopIconProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  onOpen: () => void;
}

export default function DesktopIcon({
  id,
  title,
  icon,
  badge,
  onOpen,
}: DesktopIconProps) {
  return (
    <button
      onClick={onOpen}
      onDoubleClick={onOpen}
      className="group relative flex w-20 flex-col items-center gap-1 rounded-sm p-1.5 text-center transition-all hover:bg-black/15 focus:outline-none select-none"
    >
      {/* Authentic Mac System 7 Icon Frame */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d6d6ce] shadow-xs group-hover:bg-[#ebebe6] group-active:translate-y-0.5">
        {icon}

        {badge && (
          <span className="absolute -top-1.5 -right-1.5 rounded-full bg-emerald-600 px-1 text-[8px] font-bold text-white shadow-xs font-mono">
            {badge}
          </span>
        )}
      </div>

      {/* Classic Mac Black/White Label */}
      <span className="rounded-xs bg-[#ebebe6] px-1 py-0.2 font-mono text-[10px] font-bold text-black border border-[#404040] group-hover:bg-[#000080] group-hover:text-white group-hover:border-[#000080] truncate max-w-full shadow-2xs">
        {title}
      </span>
    </button>
  );
}
