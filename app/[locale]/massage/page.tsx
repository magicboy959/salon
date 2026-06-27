import { Badge } from "@/components/ui/badge";
import { MassageOrderForm } from "@/components/forms/massage-order-form";

export default function MassagePage() {
  return (
    <>
      <section className="border-b border-gold/15 py-20">
        <div className="container-shell">
          <Badge>Massage</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">Massage Booking</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Book massage service for AED 200 per hour. Select male or female customer, male or female masseuse,
            duration, location, and preferred appointment time.
          </p>
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
