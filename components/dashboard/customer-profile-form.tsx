"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export function CustomerProfileForm({
  profile
}: {
  profile: { name: string | null; email: string | null; phone: string | null; creditBalance: number; rewardPoints: number };
}) {
  const [form, setForm] = useState({ name: profile.name ?? "", phone: profile.phone ?? "" });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not update profile");
      setMessage("Profile updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <Field label="Name">
        <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
      </Field>
      <Field label="Email">
        <Input value={profile.email ?? ""} disabled />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Detail label="Store credit" value={formatCurrency(profile.creditBalance)} />
        <Detail label="Reward points" value={String(profile.rewardPoints)} />
      </div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving..." : "Save profile"}</Button>
      {message ? <p className="text-sm font-semibold text-gold">{message}</p> : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gold/15 bg-gold/5 p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
