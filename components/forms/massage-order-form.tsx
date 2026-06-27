"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

export function MassageOrderForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    hours: "1",
    customerType: "Male customer",
    masseuse: "Male masseuse",
    location: "Salon",
    address: "",
    notes: ""
  });

  const message = useMemo(() => {
    const total = Number(form.hours || 1) * 200;
    return [
      "Massage booking request",
      `Name: ${form.name || "-"}`,
      `Phone: ${form.phone || "-"}`,
      `Email: ${form.email || "-"}`,
      `Customer: ${form.customerType}`,
      `Preferred masseuse: ${form.masseuse}`,
      `Location: ${form.location}`,
      `Date: ${form.date || "-"}`,
      `Time: ${form.time || "-"}`,
      `Duration: ${form.hours} hour(s)`,
      `Estimated total: AED ${total}`,
      `Address: ${form.address || "-"}`,
      `Notes: ${form.notes || "-"}`
    ].join("\n");
  }, [form]);

  const emailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Massage booking request")}&body=${encodeURIComponent(message)}`;

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <form className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <Input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+971..." />
            </Field>
          </div>
          <Field label="Email">
            <Input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" placeholder="name@example.com" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date">
              <Input value={form.date} onChange={(event) => update("date", event.target.value)} type="date" />
            </Field>
            <Field label="Time">
              <Input value={form.time} onChange={(event) => update("time", event.target.value)} type="time" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Duration">
              <select value={form.hours} onChange={(event) => update("hours", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                <option value="1">1 hour - AED 200</option>
                <option value="2">2 hours - AED 400</option>
                <option value="3">3 hours - AED 600</option>
              </select>
            </Field>
            <Field label="Location">
              <select value={form.location} onChange={(event) => update("location", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                <option>Salon</option>
                <option>Home service</option>
                <option>Hotel</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Customer">
              <select value={form.customerType} onChange={(event) => update("customerType", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                <option>Male customer</option>
                <option>Female customer</option>
              </select>
            </Field>
            <Field label="Masseuse">
              <select value={form.masseuse} onChange={(event) => update("masseuse", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                <option>Male masseuse</option>
                <option>Female masseuse</option>
              </select>
            </Field>
          </div>
          <Field label="Address">
            <Input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Required for home or hotel service" />
          </Field>
          <Field label="Notes">
            <Textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Preferred pressure, room number, parking notes, or special requests..." />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                Send on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={emailHref}>
                <Mail className="h-4 w-4" />
                Send by Email
              </a>
            </Button>
          </div>
        </form>
        <div className="rounded-lg border border-gold/20 bg-white/70 p-5">
          <CardTitle>Massage Details</CardTitle>
          <CardContent className="mt-3 space-y-2 text-sm leading-6">
            <p>AED 200 per hour.</p>
            <p>Available for men and women.</p>
            <p>Choose a male or female masseuse before sending the request.</p>
            <p>Requests are forwarded through WhatsApp or email for confirmation.</p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
