"use client";

import React from "react";

interface CRTOverlayProps {
  enabled: boolean;
}

export default function CRTOverlay({ enabled }: CRTOverlayProps) {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Scanline lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Screen Vignette Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)] shadow-inner" />
    </div>
  );
}
