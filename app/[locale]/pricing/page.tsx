import { ContentPage } from "@/components/sections/content-page";
import { services } from "@/lib/data";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "الأسعار",
          subtitle: "أسعار واضحة بالدرهم لكل خدمة مع المدة والتفاصيل والحجز عبر واتساب."
        }
      : {
          title: "Pricing",
          subtitle: "Transparent AED pricing for every salon service with duration, detail, and WhatsApp booking."
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={[...services]} locale={locale} />;
}
