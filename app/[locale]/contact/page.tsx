import { ContentPage } from "@/components/sections/content-page";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      subtitle={`${siteConfig.address}. Reach the concierge by phone, email, WhatsApp, or Google Maps.`}
      items={[siteConfig.phone, siteConfig.email, siteConfig.address, "Google Maps", "WhatsApp Business", "Meta Pixel Ready"]}
    />
  );
}
