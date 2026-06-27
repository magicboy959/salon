"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
      <div>
        <p className="text-gold">500</p>
        <h1 className="mt-3 text-4xl font-bold">Something went wrong</h1>
        <Button onClick={reset} className="mt-6">Try again</Button>
      </div>
    </section>
  );
}
