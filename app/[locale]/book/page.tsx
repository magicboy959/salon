import { BookingForm } from "@/components/forms/booking-form";

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "حجز موعد",
          subtitle:
            "احجز خدمة في الصالون أو خدمة منزلية مع اختيار الخدمة والحلاق والعنوان والحقول الجاهزة للموقع وطريقة الدفع والتنبيهات والفواتير والإلغاء وإعادة الجدولة."
        }
      : {
          title: "Book Appointment",
          subtitle:
            "Book salon or home service with service selection, barber preference, address, GPS-ready fields, payment method, notifications, invoice creation, cancellation, and rescheduling support."
        };

  return (
    <section className="py-16">
      <div className="container-shell">
        <h1 className="text-5xl font-bold text-foreground">{copy.title}</h1>
        <p className="mb-8 mt-4 max-w-3xl text-muted">{copy.subtitle}</p>
        <BookingForm locale={locale} />
      </div>
    </section>
  );
}
