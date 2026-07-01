"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { CalendarCheck, CalendarPlus, CheckCircle2, MailCheck, MessageCircle, ReceiptText, RotateCcw } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { barbers, services as staticServices } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BookingService = { name: string; price: number; duration: number };
type BookingConfirmation = {
  orderNumber: string;
  values: BookingInput;
  service?: BookingService;
};

export function BookingForm({ locale = "en", services = [...staticServices] }: { locale?: string; services?: BookingService[] }) {
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const copy =
    locale === "ar"
      ? {
          labels: {
            name: "الاسم الكامل",
            email: "البريد الإلكتروني",
            phone: "الهاتف",
            date: "التاريخ",
            time: "الوقت",
            type: "نوع الموعد",
            service: "الخدمة",
            barber: "الحلاق",
            payment: "الدفع",
            address: "العنوان",
            notes: "ملاحظات"
          },
          placeholders: {
            name: "اسمك",
            phone: "+971...",
            address: "مطلوب للخدمة المنزلية",
            notes: "مواقف السيارات، الستايل المفضل، الحساسية، تعليمات الوصول..."
          },
          options: {
            salon: "في الصالون",
            home: "في المنزل",
            anyBarber: "أي حلاق محترف",
            cash: "نقدا",
            card: "بطاقة",
            stripe: "دفع إلكتروني",
            membership: "عضوية"
          },
          submit: "تأكيد الحجز",
          submitting: "جاري التأكيد...",
          success: {
            eyebrow: "تم استلام الحجز",
            title: "طلبك قيد التأكيد",
            message: "أرسلنا تفاصيل الحجز إلى بريدك الإلكتروني. سيتواصل الفريق معك لتأكيد الموعد.",
            order: "رقم الطلب",
            service: "الخدمة",
            date: "التاريخ والوقت",
            type: "نوع الموعد",
            email: "البريد الإلكتروني",
            payment: "الدفع",
            whatsapp: "واتساب",
            calendar: "إضافة للتقويم",
            another: "حجز آخر",
            note: "إذا لم يصلك البريد خلال دقائق، تواصل معنا عبر واتساب مع رقم الطلب.",
            pending: "بانتظار التأكيد"
          },
          failed: "تعذر إرسال الحجز. يرجى المحاولة مرة أخرى."
        }
      : {
          labels: {
            name: "Full name",
            email: "Email",
            phone: "Phone",
            date: "Date",
            time: "Time",
            type: "Appointment type",
            service: "Service",
            barber: "Barber",
            payment: "Payment",
            address: "Address",
            notes: "Notes"
          },
          placeholders: {
            name: "Your name",
            phone: "+971...",
            address: "Required for home service",
            notes: "Parking, preferred style, allergies, arrival instructions..."
          },
          options: {
            salon: "Salon",
            home: "Home",
            anyBarber: "Any master barber",
            cash: "Cash",
            card: "Card",
            stripe: "Stripe",
            membership: "Membership"
          },
          submit: "Confirm booking",
          submitting: "Confirming...",
          success: {
            eyebrow: "Booking received",
            title: "Your appointment request is in",
            message: "We sent the booking details to your email. Our team will contact you to confirm the appointment.",
            order: "Order number",
            service: "Service",
            date: "Date and time",
            type: "Appointment type",
            email: "Email",
            payment: "Payment",
            whatsapp: "WhatsApp",
            calendar: "Add to calendar",
            another: "Book another",
            note: "If the email does not arrive within a few minutes, message us on WhatsApp with your order number.",
            pending: "Pending confirmation"
          },
          failed: "Booking could not be submitted. Please try again."
        };

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as Resolver<BookingInput>,
    defaultValues: {
      appointmentType: "SALON",
      paymentMethod: "CASH",
      serviceIds: [services[0].name],
      date: new Date().toISOString().slice(0, 10),
      time: "12:00"
    }
  });

  async function onSubmit(values: BookingInput) {
    setSubmitError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : copy.failed);
      setConfirmation({
        orderNumber: payload.orderNumber ?? payload.id,
        values,
        service: services.find((service) => service.name === values.serviceIds[0])
      });
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.failed);
    }
  }

  if (confirmation) {
    return (
      <BookingSuccess
        confirmation={confirmation}
        locale={locale}
        copy={copy.success}
        onBookAnother={() => setConfirmation(null)}
      />
    );
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        {submitError ? (
          <div className="md:col-span-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {submitError}
          </div>
        ) : null}
        <Field label={copy.labels.name} error={form.formState.errors.customerName?.message}>
          <Input {...form.register("customerName")} placeholder={copy.placeholders.name} />
        </Field>
        <Field label={copy.labels.email} error={form.formState.errors.email?.message}>
          <Input {...form.register("email")} type="email" placeholder="name@example.com" />
        </Field>
        <Field label={copy.labels.phone} error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} placeholder={copy.placeholders.phone} />
        </Field>
        <Field label={copy.labels.date} error={form.formState.errors.date?.message}>
          <Input {...form.register("date")} type="date" />
        </Field>
        <Field label={copy.labels.time} error={form.formState.errors.time?.message}>
          <Input {...form.register("time")} type="time" />
        </Field>
        <Field label={copy.labels.type}>
          <select {...form.register("appointmentType")} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
            <option value="SALON">{copy.options.salon}</option>
            <option value="HOME">{copy.options.home}</option>
          </select>
        </Field>
        <Field label={copy.labels.service}>
          <select {...form.register("serviceIds.0")} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
            {services.map((service) => <option key={service.name} value={service.name}>{service.name}</option>)}
          </select>
        </Field>
        <Field label={copy.labels.barber}>
          <select {...form.register("barberId")} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
            <option value="">{copy.options.anyBarber}</option>
            {barbers.map((barber) => <option key={barber.name} value={barber.name}>{barber.name}</option>)}
          </select>
        </Field>
        <Field label={copy.labels.payment}>
          <select {...form.register("paymentMethod")} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
            <option value="CASH">{copy.options.cash}</option>
            <option value="CARD">{copy.options.card}</option>
            <option value="STRIPE">{copy.options.stripe}</option>
            <option value="MEMBERSHIP">{copy.options.membership}</option>
          </select>
        </Field>
        <Field label={copy.labels.address}>
          <Input {...form.register("address")} placeholder={copy.placeholders.address} />
        </Field>
        <div className="md:col-span-2">
          <Field label={copy.labels.notes}>
            <Textarea {...form.register("notes")} placeholder={copy.placeholders.notes} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <CalendarCheck className="h-5 w-5" />
            {form.formState.isSubmitting ? copy.submitting : copy.submit}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function BookingSuccess({
  confirmation,
  locale,
  copy,
  onBookAnother
}: {
  confirmation: BookingConfirmation;
  locale: string;
  copy: {
    eyebrow: string;
    title: string;
    message: string;
    order: string;
    service: string;
    date: string;
    type: string;
    email: string;
    payment: string;
    whatsapp: string;
    calendar: string;
    another: string;
    note: string;
    pending: string;
  };
  onBookAnother: () => void;
}) {
  const { orderNumber, values, service } = confirmation;
  const serviceName = service?.name ?? values.serviceIds[0];
  const dateTime = formatBookingDate(values.date, values.time, locale);
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hello, I want to confirm booking ${orderNumber} for ${serviceName} on ${dateTime}.`
  )}`;
  const calendarHref = calendarDataUrl(orderNumber, serviceName, values);

  return (
    <Card className="mx-auto max-w-4xl overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1fr_320px]">
        <div className="p-6 md:p-8">
          <Badge className="gap-2 bg-green-50 text-green-800">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </Badge>
          <h2 className="mt-4 text-3xl font-bold text-foreground">{copy.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{copy.message}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Detail label={copy.order} value={orderNumber} strong />
            <Detail label={copy.service} value={serviceName} />
            <Detail label={copy.date} value={dateTime} />
            <Detail label={copy.type} value={values.appointmentType} />
            <Detail label={copy.email} value={values.email} />
            <Detail label={copy.payment} value={values.paymentMethod} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                {copy.whatsapp}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={calendarHref} download={`${orderNumber}.ics`}>
                <CalendarPlus className="h-4 w-4" />
                {copy.calendar}
              </a>
            </Button>
            <Button type="button" variant="ghost" onClick={onBookAnother}>
              <RotateCcw className="h-4 w-4" />
              {copy.another}
            </Button>
          </div>
        </div>

        <aside className="border-t border-gold/15 bg-white/70 p-6 lg:border-l lg:border-t-0 md:p-8">
          <div className="rounded-lg border border-gold/20 bg-white p-5">
            <ReceiptText className="h-6 w-6 text-gold" />
            <p className="mt-4 text-sm font-semibold text-foreground">{copy.pending}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{copy.note}</p>
          </div>
          <div className="mt-4 rounded-lg border border-gold/20 bg-white p-5">
            <MailCheck className="h-6 w-6 text-gold" />
            <p className="mt-4 text-sm font-semibold text-foreground">{values.email}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{siteConfig.email}</p>
          </div>
        </aside>
      </div>
    </Card>
  );
}

function Detail({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-md border border-gold/15 bg-white/72 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className={strong ? "mt-1 text-base font-bold text-foreground" : "mt-1 text-sm font-semibold text-foreground"}>{value}</p>
    </div>
  );
}

function formatBookingDate(date: string, time: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai"
  }).format(new Date(`${date}T${time}`));
}

function calendarDataUrl(orderNumber: string, serviceName: string, values: BookingInput) {
  const start = new Date(`${values.date}T${values.time}`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alshanab Alaswad Salon//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${orderNumber}@alshanabalaswadsalon.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(`Alshanab Alaswad - ${serviceName}`)}`,
    `DESCRIPTION:${escapeIcs(`Booking ${orderNumber}. Our team will contact you to confirm.`)}`,
    `LOCATION:${escapeIcs(values.appointmentType === "HOME" ? values.address || "Home service" : siteConfig.address)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
}
