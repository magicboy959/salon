import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendBookingEmail(input: {
  to: string;
  customerName: string;
  serviceSummary: string;
  dateTime: string;
}) {
  if (!resend) return { skipped: true };
  return resend.emails.send({
    from: process.env.RESEND_FROM ?? "Alshamy Alaswad <bookings@example.com>",
    to: input.to,
    subject: "Your Alshamy Alaswad appointment is confirmed",
    html: `<strong>${input.customerName}</strong>, your booking for ${input.serviceSummary} is confirmed for ${input.dateTime}.`
  });
}

export function whatsappBookingUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp}?text=${encoded}`;
}
