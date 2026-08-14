import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "X-OS Studio — Open-Source X (Twitter) Algorithm Visualizer & Decompiler";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#07090e",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
          padding: "48px 60px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Top macOS Style Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
            <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
            <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
            <span style={{ fontSize: "20px", fontWeight: "800", marginLeft: "12px", letterSpacing: "-0.5px" }}>
              X-OS Studio v2026
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "6px 16px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: "700",
              color: "#34d399",
            }}
          >
            2,015 Algorithm Files Indexed
          </div>
        </div>

        {/* Center Main Headline & Visual Highlights */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "1000px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: "900",
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              background: "linear-gradient(to right, #ffffff, #cbd5e1, #818cf8)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "16px",
            }}
          >
            The Open-Source X (Twitter) Algorithm Visualizer & Architecture Suite
          </div>

          <p
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              fontWeight: "500",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Decompile 2,015 files • Phoenix Two-Tower Model • +20x Multiplier Matrix • Tweet Doctor AI
          </p>

          {/* Metric Badges Pill Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                padding: "10px 20px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#a5b4fc",
              }}
            >
              ⚡ 500M → 20 in &lt;100ms
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                padding: "10px 20px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#6ee7b7",
              }}
            >
              🔗 +20.0x Copy Link Boost
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.35)",
                padding: "10px 20px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#fda4af",
              }}
            >
              🚨 -234.0x Report Penalty
            </div>
          </div>
        </div>

        {/* Bottom Bar with Live Link & Branding */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#64748b" }}>
            <span>Built by</span>
            <span style={{ color: "#ffffff", fontWeight: "700" }}>100xprompt</span>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "#38bdf8",
              fontFamily: "monospace",
              letterSpacing: "0.5px",
            }}
          >
            x.100xprompt.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
