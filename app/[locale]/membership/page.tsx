import { ContentPage } from "@/components/sections/content-page";
import { memberships } from "@/lib/data";

export default function MembershipPage() {
  return (
    <ContentPage
      title="Membership"
      subtitle="Recurring grooming plans with VIP benefits, rewards, invoices, and membership payment support."
      items={memberships.map((plan) => `${plan.name} - AED ${plan.price}/month`)}
    />
  );
}
