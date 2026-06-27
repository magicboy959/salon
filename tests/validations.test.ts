import { describe, expect, it } from "vitest";
import { bookingSchema } from "@/lib/validations";

describe("bookingSchema", () => {
  it("accepts a valid salon booking", () => {
    const result = bookingSchema.safeParse({
      customerName: "Omar",
      email: "omar@example.com",
      phone: "+971500000000",
      serviceIds: ["Haircut"],
      appointmentType: "SALON",
      date: "2026-07-01",
      time: "14:30",
      paymentMethod: "CASH"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = bookingSchema.safeParse({
      customerName: "Omar",
      email: "bad",
      phone: "+971500000000",
      serviceIds: ["Haircut"],
      appointmentType: "SALON",
      date: "2026-07-01",
      time: "14:30",
      paymentMethod: "CASH"
    });

    expect(result.success).toBe(false);
  });
});
