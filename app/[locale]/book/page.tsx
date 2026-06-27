import { BookingForm } from "@/components/forms/booking-form";

export default function BookPage() {
  return (
    <section className="py-16">
      <div className="container-shell">
        <h1 className="text-5xl font-bold text-foreground">Book Appointment</h1>
        <p className="mb-8 mt-4 max-w-3xl text-muted">
          Book salon or home service with service selection, barber preference, address, GPS-ready
          fields, payment method, notifications, invoice creation, cancellation, and rescheduling support.
        </p>
        <BookingForm />
      </div>
    </section>
  );
}
