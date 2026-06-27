import { ContentPage } from "@/components/sections/content-page";

export default async function HomeServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "الخدمة المنزلية",
          subtitle: "احجز حلاقا في المنزل مع العنوان والموقع وخرائط جوجل وحالة الوصول والتتبع والدفع والتنبيهات.",
          items: ["العنوان", "الموقع", "خرائط جوجل", "التاريخ", "الوقت", "الحلاق", "ملاحظات", "الدفع", "حالة الوصول", "التتبع", "التنبيهات"]
        }
      : {
          title: "Home Services",
          subtitle: "Book a barber at home with address capture, GPS coordinates, Google Maps, arrival status, tracking, payment, and notifications.",
          items: ["Address", "GPS", "Google Maps", "Date", "Time", "Barber", "Notes", "Payment", "Arrival Status", "Tracking", "Notifications"]
        };

  return (
    <ContentPage
      title={copy.title}
      subtitle={copy.subtitle}
      items={copy.items}
      image="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80"
      locale={locale}
    />
  );
}
