"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { createStoredBooking } from "@/lib/bookings";
import { sendBookingEmail } from "@/services/notifications";

export async function createBooking(input: BookingInput) {
  const parsed = bookingSchema.parse(input);
  const booking = await createStoredBooking(parsed);

  await sendBookingEmail({
    to: parsed.email,
    customerName: parsed.customerName,
    serviceSummary: booking.items.map((item) => item.serviceName).join(", "),
    dateTime: booking.date.toISOString()
  });

  revalidatePath("/admin");
  return booking.id;
}
