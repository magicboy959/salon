import { ContentPage } from "@/components/sections/content-page";
import { barbers } from "@/lib/data";

export default async function BarbersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "الحلاقون",
          subtitle: "حلاقون محترفون مع التخصصات والتقييمات والتوفر وجداول الحجوزات."
        }
      : {
          title: "Barbers",
          subtitle: "Master barbers with specialties, ratings, availability, leave requests, commissions, and booking calendars."
        };

  return (
    <ContentPage
      title={copy.title}
      subtitle={copy.subtitle}
      items={barbers.map((barber) => `${barber.name} - ${barber.title} - ${barber.rating}`)}
      image="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80"
      locale={locale}
    />
  );
}
