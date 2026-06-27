import { ContentPage } from "@/components/sections/content-page";

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      subtitle="Privacy-first handling for accounts, bookings, addresses, GPS, payments, notifications, analytics, and marketing consent."
      items={["Data Collection", "Legal Basis", "Retention", "Security", "Analytics", "Customer Rights"]}
    />
  );
}
