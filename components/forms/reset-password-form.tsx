"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ locale, token }: { locale: string; token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Could not reset password");
      return;
    }
    router.replace(`/${locale}/login`);
  }

  return (
    <section className="py-12">
      <div className="container-shell">
        <Card className="mx-auto max-w-md">
          <CardTitle>Choose New Password</CardTitle>
          <CardContent className="mt-2">Use at least 8 characters.</CardContent>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
            <div className="space-y-2">
              <Label>New password</Label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required />
            </div>
            <div className="space-y-2">
              <Label>Confirm password</Label>
              <Input value={confirm} onChange={(event) => setConfirm(event.target.value)} type="password" minLength={8} required />
            </div>
            <Button type="submit" disabled={loading || !token} className="w-full">
              <KeyRound className="h-4 w-4" />
              {loading ? "Saving..." : "Reset password"}
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
