import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { services } from "@/lib/data";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`booking:${ip}`, 10);
  if (!limited.ok) return NextResponse.json({ error: "Too many booking attempts" }, { status: 429 });

  const json = await request.json();
  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const booking = await prisma.booking.create({
    data: {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      appointmentType: data.appointmentType,
      date: new Date(`${data.date}T${data.time}`),
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      notes: data.notes,
      couponCode: data.couponCode,
      paymentMethod: data.paymentMethod,
      status: "PENDING",
      arrivalStatus: data.appointmentType === "HOME" ? "SCHEDULED" : null,
      items: {
        create: data.serviceIds.map((serviceName) => {
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

  return NextResponse.json({ id: booking.id, status: booking.status });
}
