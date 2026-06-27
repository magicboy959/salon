import { z } from "zod";

export const bookingSchema = z.object({
  customerName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  serviceIds: z.array(z.string()).min(1),
  barberId: z.string().optional(),
  branchId: z.string().optional(),
  appointmentType: z.enum(["SALON", "HOME"]),
  date: z.string().min(8),
  time: z.string().min(4),
  address: z.string().max(240).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  notes: z.string().max(1000).optional(),
  couponCode: z.string().max(60).optional(),
  paymentMethod: z.enum(["CASH", "CARD", "STRIPE", "MEMBERSHIP"])
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  message: z.string().min(10).max(1500)
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(8).max(700)
});
