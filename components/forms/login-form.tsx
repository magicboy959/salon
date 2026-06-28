"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    const safeCallbackUrl = callbackUrl?.startsWith("/") ? callbackUrl : `/${locale}/admin`;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: safeCallbackUrl
      });

      if (!result?.ok || result.error) {
        setError("Invalid email or password");
        return;
      }

      router.replace(safeCallbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Login request failed", error);
      setError("Login is unavailable right now. Check the server auth URL settings and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12">
      <div className="container-shell">
        <Card className="mx-auto max-w-md">
          <CardTitle>Admin Login</CardTitle>
          <CardContent className="mt-2">Sign in to manage bookings, users, and store credit.</CardContent>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-muted">
              New customer? <Link className="font-semibold text-gold" href={`/${locale}/register`}>Create account</Link>
            </p>
            <p className="text-center text-sm text-muted">
              <Link className="font-semibold text-gold" href={`/${locale}/forgot-password`}>Forgot password?</Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}
