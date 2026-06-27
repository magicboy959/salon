"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { CalendarCheck } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { services, barbers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export function BookingForm({ locale = "en" }: { locale?: string }) {
  const [confirmation, setConfirmation] = useState<string | null>(null);
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
          success: "تم استلام الحجز. رقم الطلب:"
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
          success: "Booking received. Order number:"
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
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!response.ok) throw new Error("Booking failed");
    const payload = await response.json();
    setConfirmation(payload.orderNumber ?? payload.id);
    form.reset();
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
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
        {confirmation ? (
          <div className="md:col-span-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
            {copy.success} {confirmation}. {locale === "ar" ? "تم إرسال التفاصيل إلى بريدك الإلكتروني." : "Details were sent to your email."}
          </div>
        ) : null}
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
