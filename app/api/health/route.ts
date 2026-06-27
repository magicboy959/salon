import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "alshamy-alaswad-salon",
    timestamp: new Date().toISOString()
  });
}
