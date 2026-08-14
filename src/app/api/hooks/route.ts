import { NextResponse } from "next/server";
import { VIRAL_HOOK_TEMPLATES } from "@/lib/copywriting/hooks";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    total: VIRAL_HOOK_TEMPLATES.length,
    templates: VIRAL_HOOK_TEMPLATES,
  });
}
