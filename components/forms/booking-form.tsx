"use client";

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

export function BookingForm() {
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
    form.reset();
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" error={form.formState.errors.customerName?.message}>
          <Input {...form.register("customerName")} placeholder="Your name" />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input {...form.register("email")} type="email" placeholder="name@example.com" />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} placeholder="+971..." />
        </Field>
        <Field label="Date" error={form.formState.errors.date?.message}>
          <Input {...form.register("date")} type="date" />
        </Field>
        <Field label="Time" error={form.formState.errors.time?.message}>
          <Input {...form.register("time")} type="time" />
        </Field>
        <Field label="Appointment type">
          <select {...form.register("appointmentType")} className="h-11 w-full rounded-md border border-gold/25 bg-black/45 px-3 text-sm text-white">
            <option value="SALON">Salon</option>
            <option value="HOME">Home</option>
          </select>
        </Field>
        <Field label="Service">
          <select {...form.register("serviceIds.0")} className="h-11 w-full rounded-md border border-gold/25 bg-black/45 px-3 text-sm text-white">
            {services.map((service) => <option key={service.name} value={service.name}>{service.name}</option>)}
          </select>
        </Field>
        <Field label="Barber">
          <select {...form.register("barberId")} className="h-11 w-full rounded-md border border-gold/25 bg-black/45 px-3 text-sm text-white">
            <option value="">Any master barber</option>
            {barbers.map((barber) => <option key={barber.name} value={barber.name}>{barber.name}</option>)}
          </select>
        </Field>
        <Field label="Payment">
          <select {...form.register("paymentMethod")} className="h-11 w-full rounded-md border border-gold/25 bg-black/45 px-3 text-sm text-white">
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="STRIPE">Stripe</option>
            <option value="MEMBERSHIP">Membership</option>
          </select>
        </Field>
        <Field label="Address">
          <Input {...form.register("address")} placeholder="Required for home service" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Notes">
            <Textarea {...form.register("notes")} placeholder="Parking, preferred style, allergies, arrival instructions..." />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <CalendarCheck className="h-5 w-5" />
            {form.formState.isSubmitting ? "Confirming..." : "Confirm booking"}
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
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
