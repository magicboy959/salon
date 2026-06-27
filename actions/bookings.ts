"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { createStoredBooking } from "@/lib/bookings";
import { bookingOrderNumber, sendBookingConfirmation, sendBookingNotification } from "@/services/notifications";

export async function createBooking(input: BookingInput) {
  const parsed = bookingSchema.parse(input);
  const booking = await createStoredBooking(parsed);
  const orderNumber = bookingOrderNumber(booking.id);
  const serviceSummary = booking.items.map((item) => item.serviceName).join(", ");

  await Promise.allSettled([
    sendBookingConfirmation({
      to: parsed.email,
      customerName: parsed.customerName,
      orderNumber,
      serviceSummary,
      dateTime: booking.date.toISOString(),
      phone: parsed.phone,
      appointmentType: parsed.appointmentType,
      address: parsed.address,
      notes: parsed.notes
    }),
    sendBookingNotification({
      to: parsed.email,
      customerName: parsed.customerName,
      orderNumber,
      serviceSummary,
      dateTime: booking.date.toISOString(),
      phone: parsed.phone,
      appointmentType: parsed.appointmentType,
      address: parsed.address,
      notes: parsed.notes
    })
  ]);

  revalidatePath("/admin");
  return booking.id;
}
