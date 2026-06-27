import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { createStoredBooking } from "@/lib/bookings";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`booking:${ip}`, 10);
  if (!limited.ok) return NextResponse.json({ error: "Too many booking attempts" }, { status: 429 });

  const json = await request.json();
  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const booking = await createStoredBooking(data);

  return NextResponse.json({ id: booking.id, status: booking.status });
}
