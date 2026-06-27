import { ContentPage } from "@/components/sections/content-page";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <ContentPage
      title="Services"
      subtitle="Haircuts, fades, beard color, hair color, smoothing, and Kevin Murphy treatments with direct WhatsApp booking."
      items={[...services]}
      image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
