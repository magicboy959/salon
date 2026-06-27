import { ContentPage } from "@/components/sections/content-page";
import { siteConfig } from "@/config/site";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "تواصل معنا",
          subtitle: `${siteConfig.address}. تواصل مع الصالون عبر الهاتف أو البريد الإلكتروني أو واتساب أو خرائط جوجل.`,
          items: [siteConfig.phone, siteConfig.email, siteConfig.address, "خرائط جوجل", "واتساب بزنس", "جاهز للتحليلات"]
        }
      : {
          title: "Contact",
          subtitle: `${siteConfig.address}. Reach the concierge by phone, email, WhatsApp, or Google Maps.`,
          items: [siteConfig.phone, siteConfig.email, siteConfig.address, "Google Maps", "WhatsApp Business", "Meta Pixel Ready"]
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={copy.items} locale={locale} />;
}
