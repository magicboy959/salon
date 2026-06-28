import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { siteConfig } from "@/config/site";

type Mailbox = "booking" | "noreply";

type BookingEmailInput = {
  to: string;
  customerName: string;
  orderNumber: string;
  serviceSummary: string;
  dateTime: string;
  phone: string;
  appointmentType: string;
  address?: string | null;
  notes?: string | null;
};

const transporters: Partial<Record<Mailbox, Transporter>> = {};

function smtpConfig(mailbox: Mailbox) {
  const user = mailbox === "booking" ? process.env.BOOKING_SMTP_USER : process.env.NOREPLY_SMTP_USER;
  const pass = mailbox === "booking" ? process.env.BOOKING_SMTP_PASS : process.env.NOREPLY_SMTP_PASS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? "true") === "true";

  if (!host || !user || !pass) return null;
  return { host, port, secure, auth: { user, pass } };
}

function transporter(mailbox: Mailbox) {
  if (transporters[mailbox]) return transporters[mailbox];
  const config = smtpConfig(mailbox);
  if (!config) return null;
  transporters[mailbox] = nodemailer.createTransport(config);
  return transporters[mailbox];
}

function fromAddress(mailbox: Mailbox) {
  const user = mailbox === "booking" ? process.env.BOOKING_SMTP_USER : process.env.NOREPLY_SMTP_USER;
  const label = mailbox === "booking" ? "Alshanab Alaswad Booking" : "Alshanab Alaswad Salon";
  return `${label} <${user}>`;
}

export function bookingOrderNumber(id: string) {
  return `SALON-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function sendBookingConfirmation(input: BookingEmailInput) {
  const mailer = transporter("booking");
  if (!mailer) return { skipped: true };

  return mailer.sendMail({
    from: fromAddress("booking"),
    to: input.to,
    subject: `Booking received - ${input.orderNumber}`,
    text: [
      `Hello ${input.customerName},`,
      "",
      `We received your booking request. Your order number is ${input.orderNumber}.`,
      `Service: ${input.serviceSummary}`,
      `Date: ${input.dateTime}`,
      `Type: ${input.appointmentType}`,
      "",
      "We will contact you to confirm the appointment.",
      "",
      "Alshanab Alaswad Gents Salon"
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
        <h2>Booking received</h2>
        <p>Hello <strong>${escapeHtml(input.customerName)}</strong>,</p>
        <p>We received your booking request.</p>
        <p><strong>Order number:</strong> ${escapeHtml(input.orderNumber)}</p>
        <p><strong>Service:</strong> ${escapeHtml(input.serviceSummary)}</p>
        <p><strong>Date:</strong> ${escapeHtml(input.dateTime)}</p>
        <p><strong>Type:</strong> ${escapeHtml(input.appointmentType)}</p>
        <p>We will contact you to confirm the appointment.</p>
        <p>Alshanab Alaswad Gents Salon</p>
      </div>
    `
  });
}

export async function sendBookingNotification(input: BookingEmailInput) {
  const mailer = transporter("booking");
  const to = process.env.BOOKING_NOTIFY_TO || process.env.BOOKING_SMTP_USER;
  if (!mailer || !to) return { skipped: true };

  return mailer.sendMail({
    from: fromAddress("booking"),
    to,
    subject: `New booking - ${input.orderNumber}`,
    text: [
      `Order: ${input.orderNumber}`,
      `Customer: ${input.customerName}`,
      `Phone: ${input.phone}`,
      `Email: ${input.to}`,
      `Service: ${input.serviceSummary}`,
      `Date: ${input.dateTime}`,
      `Type: ${input.appointmentType}`,
      `Address: ${input.address || "-"}`,
      `Notes: ${input.notes || "-"}`
    ].join("\n")
  });
}

export async function sendWelcomeEmail(input: { to: string; name: string }) {
  const mailer = transporter("noreply");
  if (!mailer) return { skipped: true };

  return mailer.sendMail({
    from: fromAddress("noreply"),
    to: input.to,
    subject: "Welcome to Alshanab Alaswad Gents Salon",
    text: `Hello ${input.name},\n\nWelcome to Alshanab Alaswad Gents Salon. Your customer account is ready.\n\nYou can now book appointments and receive updates from us.\n`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
        <h2>Welcome, ${escapeHtml(input.name)}</h2>
        <p>Your customer account is ready.</p>
        <p>You can now book appointments and receive updates from Alshanab Alaswad Gents Salon.</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(input: { to: string; name?: string | null; resetUrl: string }) {
  const mailer = transporter("noreply");
  if (!mailer) return { skipped: true };

  const name = input.name || "Customer";
  return mailer.sendMail({
    from: fromAddress("noreply"),
    to: input.to,
    subject: "Reset your Alshanab Alaswad Salon password",
    text: [
      `Hello ${name},`,
      "",
      "Use this link to reset your password. The link expires in 1 hour.",
      input.resetUrl,
      "",
      "If you did not request this, you can ignore this email."
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
        <h2>Password reset</h2>
        <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
        <p>Use the button below to reset your password. The link expires in 1 hour.</p>
        <p><a href="${escapeHtml(input.resetUrl)}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Reset password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
}

export function whatsappBookingUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp}?text=${encoded}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
