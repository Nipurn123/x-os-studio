import { NextRequest, NextResponse } from "next/server";
import { generateAlgorithmicRewrites } from "@/lib/copywriting/rewriter";
import { auditPost } from "@/lib/algorithm/scorer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = body.content || "";

    if (!content.trim()) {
      return NextResponse.json(
        { error: "Content is required for algorithmic optimization." },
        { status: 400 }
      );
    }

    const audit = auditPost(content);
    const rewrites = generateAlgorithmicRewrites(content);

    return NextResponse.json({
      success: true,
      audit,
      rewrites,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to optimize post", details: error.message },
      { status: 500 }
    );
  }
}
