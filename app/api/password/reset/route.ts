import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resetPassword } from "@/lib/password-reset";
import { rateLimit } from "@/lib/rate-limit";

const resetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(100)
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`password-reset:${ip}`, 10, 60 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const parsed = resetSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    await resetPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
  }
}
