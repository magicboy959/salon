import { ContentPage } from "@/components/sections/content-page";

export default function CareersPage() {
  return (
    <ContentPage
      title="Careers"
      subtitle="Recruit master barbers, receptionists, branch managers, home-service specialists, and support staff."
      items={["Master Barber", "Home Service Barber", "Receptionist", "Branch Manager", "Inventory Lead", "Marketing Executive"]}
    />
  );
}
