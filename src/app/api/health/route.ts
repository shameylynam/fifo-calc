import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKeyConfigured = !!process.env.ANTHROPIC_API_KEY;

  return NextResponse.json({
    status: "ok",
    service: "fifo-calc-api",
    timestamp: new Date().toISOString(),
    env: {
      ANTHROPIC_API_KEY: apiKeyConfigured ? "set" : "missing",
    },
  });
}
