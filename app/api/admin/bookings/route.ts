import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listAdminBookings, updateBookingStatus } from "@/lib/admin-bookings";
import { bookingStatuses } from "@/lib/admin-booking-types";

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(bookingStatuses)
});

export async function GET() {
  try {
    const bookings = await listAdminBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Admin bookings fetch failed", error);
    return NextResponse.json({ error: "Could not load bookings. Check database access." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const affectedRows = await updateBookingStatus(parsed.data.id, parsed.data.status);
    if (!affectedRows) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin booking update failed", error);
    return NextResponse.json({ error: "Could not update booking. Check database access." }, { status: 500 });
  }
}
