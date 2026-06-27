"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
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
    <section className="py-12">
      <div className="container-shell">
        <Card className="mx-auto max-w-md">
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
