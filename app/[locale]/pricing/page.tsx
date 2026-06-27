import { ContentPage } from "@/components/sections/content-page";
import { services } from "@/lib/data";

export default function PricingPage() {
  return (
    <ContentPage
      title="Pricing"
      subtitle="Transparent AED pricing for every salon service with duration, detail, and WhatsApp booking."
      items={[...services]}
    />
  );
}
