import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await requireAdmin();
  if (!user) redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);

  return <AdminDashboard adminUser={{ name: user.name, email: user.email, roles: user.roles }} locale={locale} />;
}
