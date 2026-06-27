"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { services } from "@/lib/data";
import { sendBookingEmail } from "@/services/notifications";

export async function createBooking(input: BookingInput) {
  const parsed = bookingSchema.parse(input);
  const booking = await prisma.booking.create({
    data: {
      customerName: parsed.customerName,
      email: parsed.email,
      phone: parsed.phone,
      appointmentType: parsed.appointmentType,
      date: new Date(`${parsed.date}T${parsed.time}`),
      address: parsed.address,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      notes: parsed.notes,
      couponCode: parsed.couponCode,
      paymentMethod: parsed.paymentMethod,
      barberId: parsed.barberId || null,
      branchId: parsed.branchId || null,
      items: {
        create: parsed.serviceIds.map((serviceName) => {
          const service = services.find((item) => item.name === serviceName);
          return {
            serviceName,
            price: service?.price ?? 0,
            duration: service?.duration ?? 30
          };
        })
      }
    },
    include: { items: true }
  });

  await sendBookingEmail({
    to: parsed.email,
    customerName: parsed.customerName,
    serviceSummary: booking.items.map((item) => item.serviceName).join(", "),
    dateTime: booking.date.toISOString()
  });

  revalidatePath("/admin");
  return booking.id;
}
