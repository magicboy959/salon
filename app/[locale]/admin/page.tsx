import { adminModules } from "@/config/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminPage() {
  return <DashboardShell title="Admin Dashboard" modules={adminModules} />;
}
