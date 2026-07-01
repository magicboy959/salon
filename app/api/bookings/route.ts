import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { createStoredBooking } from "@/lib/bookings";
import { bookingOrderNumber, sendBookingConfirmation, sendBookingNotification } from "@/services/notifications";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`booking:${ip}`, 10);
  if (!limited.ok) return NextResponse.json({ error: "Too many booking attempts" }, { status: 429 });

  const json = await request.json();
  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const booking = await createStoredBooking(data);
  const orderNumber = bookingOrderNumber(booking.id);
  const serviceSummary = booking.items.map((item) => item.serviceName).join(", ");
  const dateTime = new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai"
  }).format(booking.date);

  const emailResults = await Promise.allSettled([
    sendBookingConfirmation({
      to: data.email,
      customerName: data.customerName,
      orderNumber,
      serviceSummary,
      dateTime,
      phone: data.phone,
      appointmentType: data.appointmentType,
      address: data.address,
      notes: data.notes
    }),
    sendBookingNotification({
      to: data.email,
      customerName: data.customerName,
      orderNumber,
      serviceSummary,
      dateTime,
      phone: data.phone,
      appointmentType: data.appointmentType,
      address: data.address,
      notes: data.notes
    })
  ]);

  for (const result of emailResults) {
    if (result.status === "rejected") console.error("Booking email delivery failed", result.reason);
  }

  return NextResponse.json({ id: booking.id, orderNumber, status: booking.status });
}
