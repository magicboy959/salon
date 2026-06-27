import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MassageOrderForm } from "@/components/forms/massage-order-form";

export default function MassagePage() {
  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden border-b border-gold/15">
        <Image
          src="/massage-hero.png"
          alt="Professional massage therapists preparing a spa room"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/72 to-white/10" />
        <div className="container-shell relative flex min-h-[520px] items-center py-20">
          <div>
          <Badge>Massage</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">Massage Booking</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Book massage service for AED 200 per hour. Select male or female customer, male or female masseuse,
            duration, location, and preferred appointment time.
          </p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell">
          <MassageOrderForm />
        </div>
      </section>
    </>
  );
}
