import { ContentPage } from "@/components/sections/content-page";

export default function HomeServicesPage() {
  return (
    <ContentPage
      title="Home Services"
      subtitle="Book a barber at home with address capture, GPS coordinates, Google Maps, arrival status, tracking, payment, and notifications."
      items={["Address", "GPS", "Google Maps", "Date", "Time", "Barber", "Notes", "Payment", "Arrival Status", "Tracking", "Notifications"]}
      image="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
