import { barberModules } from "@/config/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function BarberPage() {
  return <DashboardShell title="Barber Portal" modules={barberModules} />;
}
