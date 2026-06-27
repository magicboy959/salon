import { ContentPage } from "@/components/sections/content-page";
import { services } from "@/lib/data";

export default function PricingPage() {
  return (
    <ContentPage
      title="Pricing"
      subtitle="Transparent AED pricing with taxes, packages, coupons, gift cards, and optional Stripe payment."
      items={services.map((service) => `${service.name}: AED ${service.price}`)}
    />
  );
}
