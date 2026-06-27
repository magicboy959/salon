import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
      <div>
        <p className="text-gold">404</p>
        <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
        <Button asChild className="mt-6">
          <Link href="/en">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
