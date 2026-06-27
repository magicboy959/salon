import { ContentPage } from "@/components/sections/content-page";
import { offers } from "@/lib/data";

export default async function OffersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "العروض",
          subtitle: "عروض موسمية وكوبونات وبطاقات هدايا وفواتير ومكافآت ولاء."
        }
      : {
          title: "Offers",
          subtitle: "Seasonal offers, coupons, gift cards, taxes, invoices, and loyalty rewards managed from admin."
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={offers.map((offer) => `${offer.title} - AED ${offer.price}`)} locale={locale} />;
}
