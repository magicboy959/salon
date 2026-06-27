import { customerModules } from "@/config/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function PortalPage() {
  return <DashboardShell title="Customer Portal" modules={customerModules} />;
}
