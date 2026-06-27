import { ContentPage } from "@/components/sections/content-page";

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms"
      subtitle="Terms for appointments, home service, payment, cancellation, rescheduling, memberships, rewards, and acceptable use."
      items={["Appointments", "Cancellations", "Payments", "Home Service", "Memberships", "Liability"]}
    />
  );
}
