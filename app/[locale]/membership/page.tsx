import { ContentPage } from "@/components/sections/content-page";
import { memberships } from "@/lib/data";

export default async function MembershipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "العضوية",
          subtitle: "خطط عناية متكررة مع مزايا VIP ومكافآت وفواتير ودعم دفع العضوية."
        }
      : {
          title: "Membership",
          subtitle: "Recurring grooming plans with VIP benefits, rewards, invoices, and membership payment support."
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={memberships.map((plan) => `${plan.name} - AED ${plan.price}/month`)} locale={locale} />;
}
