"use client";

import React, { useState } from "react";
import { X, Minus, Maximize2 } from "lucide-react";

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function MacTrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: TrafficLightsProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-2 select-none"
    >
      {/* Red: Close */}
      <button
        onClick={onClose}
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-xs transition-transform active:scale-90"
        title="Close"
      >
        {isHovered && (
          <X className="h-2 w-2 text-[#4c0000] font-black stroke-[3]" />
        )}
      </button>

      {/* Yellow: Minimize */}
      <button
        onClick={onMinimize}
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-xs transition-transform active:scale-90"
        title="Minimize"
      >
        {isHovered && (
          <Minus className="h-2 w-2 text-[#5e3d00] font-black stroke-[3]" />
        )}
      </button>

      {/* Green: Maximize */}
      <button
        onClick={onMaximize}
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#27c93f] border border-[#1aab29] shadow-xs transition-transform active:scale-90"
        title="Zoom / Fullscreen"
      >
        {isHovered && (
          <Maximize2 className="h-1.5 w-1.5 text-[#004d00] font-black stroke-[3]" />
        )}
      </button>
    </div>
  );
}
