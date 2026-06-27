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

type MassageOrderCopy = {
  messageTitle: string;
  emailSubject: string;
  labels: {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    customer: string;
    masseuse: string;
    address: string;
    notes: string;
  };
  placeholders: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  options: {
    customerTypes: readonly string[];
    masseuses: readonly string[];
    locations: readonly string[];
    durations: readonly string[];
  };
  messageLabels: {
    name: string;
    phone: string;
    email: string;
    customer: string;
    masseuse: string;
    location: string;
    date: string;
    time: string;
    duration: string;
    total: string;
    address: string;
    notes: string;
    hourUnit: string;
  };
  actions: {
    whatsapp: string;
    email: string;
  };
  details: {
    title: string;
    lines: readonly string[];
  };
};

export function MassageOrderForm({ copy }: { copy: MassageOrderCopy }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    hours: "1",
    customerType: copy.options.customerTypes[0],
    masseuse: copy.options.masseuses[0],
    location: copy.options.locations[0],
    address: "",
    notes: ""
  });

  const message = useMemo(() => {
    const total = Number(form.hours || 1) * 200;
    return [
      copy.messageTitle,
      `${copy.messageLabels.name}: ${form.name || "-"}`,
      `${copy.messageLabels.phone}: ${form.phone || "-"}`,
      `${copy.messageLabels.email}: ${form.email || "-"}`,
      `${copy.messageLabels.customer}: ${form.customerType}`,
      `${copy.messageLabels.masseuse}: ${form.masseuse}`,
      `${copy.messageLabels.location}: ${form.location}`,
      `${copy.messageLabels.date}: ${form.date || "-"}`,
      `${copy.messageLabels.time}: ${form.time || "-"}`,
      `${copy.messageLabels.duration}: ${form.hours} ${copy.messageLabels.hourUnit}`,
      `${copy.messageLabels.total}: AED ${total}`,
      `${copy.messageLabels.address}: ${form.address || "-"}`,
      `${copy.messageLabels.notes}: ${form.notes || "-"}`
    ].join("\n");
  }, [copy, form]);

  const emailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(message)}`;

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <form className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={copy.labels.name}>
              <Input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder={copy.placeholders.name} />
            </Field>
            <Field label={copy.labels.phone}>
              <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder={copy.placeholders.phone} />
            </Field>
          </div>
          <Field label={copy.labels.email}>
            <Input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" placeholder={copy.placeholders.email} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={copy.labels.date}>
              <Input value={form.date} onChange={(event) => update("date", event.target.value)} type="date" />
            </Field>
            <Field label={copy.labels.time}>
              <Input value={form.time} onChange={(event) => update("time", event.target.value)} type="time" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={copy.labels.duration}>
              <select value={form.hours} onChange={(event) => update("hours", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                {copy.options.durations.map((label, index) => (
                  <option key={label} value={String(index + 1)}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={copy.labels.location}>
              <select value={form.location} onChange={(event) => update("location", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                {copy.options.locations.map((location) => (
                  <option key={location}>{location}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={copy.labels.customer}>
              <select value={form.customerType} onChange={(event) => update("customerType", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                {copy.options.customerTypes.map((customerType) => (
                  <option key={customerType}>{customerType}</option>
                ))}
              </select>
            </Field>
            <Field label={copy.labels.masseuse}>
              <select value={form.masseuse} onChange={(event) => update("masseuse", event.target.value)} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                {copy.options.masseuses.map((masseuse) => (
                  <option key={masseuse}>{masseuse}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label={copy.labels.address}>
            <Input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder={copy.placeholders.address} />
          </Field>
          <Field label={copy.labels.notes}>
            <Textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder={copy.placeholders.notes} />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                {copy.actions.whatsapp}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={emailHref}>
                <Mail className="h-4 w-4" />
                {copy.actions.email}
              </a>
            </Button>
          </div>
        </form>
        <div className="rounded-lg border border-gold/20 bg-white/70 p-5">
          <CardTitle>{copy.details.title}</CardTitle>
          <CardContent className="mt-3 space-y-2 text-sm leading-6">
            {copy.details.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
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
