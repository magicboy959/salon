"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CalendarCheck, CreditCard, LogIn, ShieldCheck } from "lucide-react";
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
    const safeCallbackUrl = callbackUrl?.startsWith("/") ? callbackUrl : `/${locale}/portal`;

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
    <section className="py-12 md:py-16">
      <div className="container-shell grid items-stretch gap-6 lg:grid-cols-[1fr_440px]">
        <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-[url('/gallery/salon-chair-portrait.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/42 to-transparent" />
          <div className="relative flex h-full max-w-xl flex-col justify-end p-8 text-white md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-soft">Customer portal</p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Welcome back</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/82">
              Sign in to manage appointments, review booking history, and keep your salon preferences ready for every visit.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/88 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-gold-soft" />
                Bookings
              </span>
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gold-soft" />
                Store credit
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold-soft" />
                Secure access
              </span>
            </div>
          </div>
        </div>
        <Card className="flex flex-col justify-center">
          <CardTitle>Sign in</CardTitle>
          <CardContent className="mt-2">Access your customer account with your email and password.</CardContent>
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
