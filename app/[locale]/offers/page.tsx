import { ContentPage } from "@/components/sections/content-page";
import { offers } from "@/lib/data";

export default function OffersPage() {
  return (
    <ContentPage
      title="Offers"
      subtitle="Seasonal offers, coupons, gift cards, taxes, invoices, and loyalty rewards managed from admin."
      items={offers.map((offer) => `${offer.title} - AED ${offer.price}`)}
    />
  );
}
