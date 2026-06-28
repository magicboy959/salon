"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setMessage("If an account exists for that email, a reset link has been sent.");
    setLoading(false);
  }

  return (
    <section className="py-12">
      <div className="container-shell">
        <Card className="mx-auto max-w-md">
          <CardTitle>Reset Password</CardTitle>
          <CardContent className="mt-2">Enter your account email and we will send a secure reset link.</CardContent>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {message ? <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div> : null}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <KeyRound className="h-4 w-4" />
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-muted">
              <Link className="font-semibold text-gold" href={`/${locale}/login`}>Back to login</Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}
