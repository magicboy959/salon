import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listAdminBookingOptions, listAdminBookings, updateBookingDetails, updateBookingStatus } from "@/lib/admin-bookings";
import { appointmentTypes, bookingStatuses, paymentMethods } from "@/lib/admin-booking-types";
import { requireAdmin } from "@/lib/admin-auth";

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(bookingStatuses)
});

const detailsSchema = z.object({
  action: z.literal("details"),
  id: z.string().min(1),
  date: z.string().datetime(),
  appointmentType: z.enum(appointmentTypes),
  paymentMethod: z.enum(paymentMethods),
  address: z.string().max(191).nullable(),
  notes: z.string().max(191).nullable(),
  serviceNames: z.array(z.string().min(1).max(120)).min(1).max(8),
  barberId: z.string().max(191).nullable()
});

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [bookings, options] = await Promise.all([listAdminBookings(), listAdminBookingOptions()]);
    return NextResponse.json({ bookings, options });
  } catch (error) {
    console.error("Admin bookings fetch failed", error);
    return NextResponse.json({ error: "Could not load bookings. Check database access." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const details = detailsSchema.safeParse(body);
  if (details.success) {
    try {
      const affectedRows = await updateBookingDetails(details.data.id, details.data, user.id);
      if (!affectedRows) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Admin booking details update failed", error);
      return NextResponse.json({ error: "Could not update booking details. Check database access." }, { status: 500 });
    }
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const affectedRows = await updateBookingStatus(parsed.data.id, parsed.data.status, user.id);
    if (!affectedRows) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin booking update failed", error);
    return NextResponse.json({ error: "Could not update booking. Check database access." }, { status: 500 });
  }
}
