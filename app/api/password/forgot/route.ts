import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPasswordReset } from "@/lib/password-reset";
import { rateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/services/notifications";

const forgotSchema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`password-forgot:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ ok: true });

  const parsed = forgotSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: true });

  const reset = await createPasswordReset(parsed.data.email);
  if (reset) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const resetUrl = `${siteUrl}/en/reset-password?token=${encodeURIComponent(reset.token)}`;
    try {
      await sendPasswordResetEmail({ to: reset.user.email!, name: reset.user.name, resetUrl });
    } catch (error) {
      console.error("Password reset email delivery failed", error);
    }
  }

  return NextResponse.json({ ok: true });
}
