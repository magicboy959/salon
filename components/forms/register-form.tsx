"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift, Scissors, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "Registration failed");
      router.push(`/${locale}/login`);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container-shell grid items-stretch gap-6 lg:grid-cols-[1fr_440px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[url('/gallery/classic-cut-profile.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/46 to-transparent" />
          <div className="relative flex h-full max-w-xl flex-col justify-end p-8 text-white md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-soft">Customer account</p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Create your profile</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/82">
              Save your details once, speed through future bookings, and keep membership benefits connected to your visits.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/88 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-gold-soft" />
                Faster booking
              </span>
              <span className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-gold-soft" />
                Rewards ready
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold-soft" />
                VIP service
              </span>
            </div>
          </div>
        </div>
        <Card className="flex flex-col justify-center">
          <CardTitle>Create Account</CardTitle>
          <CardContent className="mt-2">Register as a customer for bookings and store credit.</CardContent>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={form.password} onChange={(event) => update("password", event.target.value)} type="password" autoComplete="new-password" minLength={8} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted">
              Already registered? <Link className="font-semibold text-gold" href={`/${locale}/login`}>Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}
