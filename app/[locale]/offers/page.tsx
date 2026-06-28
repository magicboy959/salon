import { connection } from "next/server";
import { ContentPage } from "@/components/sections/content-page";
import { listPublicOffers } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function OffersPage({ params }: { params: Promise<{ locale: string }> }) {
  await connection();
  const { locale } = await params;
  const offers = await listPublicOffers();
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

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={offers} locale={locale} />;
}
