import { redirect } from "next/navigation";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { auth } from "@/lib/auth";
import { getCustomerDashboard } from "@/lib/customer-dashboard";

export const dynamic = "force-dynamic";

export default async function PortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/login?callbackUrl=/${locale}/portal`);

  const data = await getCustomerDashboard(session.user.email);
  return <CustomerDashboard data={data} locale={locale} />;
}
