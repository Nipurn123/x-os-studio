import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "x-algocraft",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      algorithm: "xai-org/x-algorithm (v2026)",
      cloudRun: {
        healthy: true,
        region: process.env.K_LOCATION || "auto",
        service: process.env.K_SERVICE || "x-algocraft-service",
      },
    },
    { status: 200 }
  );
}
