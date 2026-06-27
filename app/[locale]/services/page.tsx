import { ContentPage } from "@/components/sections/content-page";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <ContentPage
      title="Services"
      subtitle="Hair, beard, treatment, skin, wellness, VIP, wedding, corporate, and home grooming services."
      items={services.map((service) => `${service.name} - ${service.duration} min - AED ${service.price}`)}
      image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
