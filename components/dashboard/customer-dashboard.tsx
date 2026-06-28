import Link from "next/link";
import { CalendarDays, Gift, Scissors, Wallet } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingStatusLabels, type BookingStatus } from "@/lib/admin-booking-types";
import { formatCurrency } from "@/lib/utils";

type CustomerDashboardData = Awaited<ReturnType<typeof import("@/lib/customer-dashboard").getCustomerDashboard>>;

export function CustomerDashboard({ data, locale }: { data: CustomerDashboardData; locale: string }) {
  const upcoming = data.bookings.filter((booking) => new Date(booking.date).getTime() >= Date.now() && !["CANCELLED", "NO_SHOW"].includes(booking.status));
  const completed = data.bookings.filter((booking) => booking.status === "COMPLETED").length;

  return (
    <section className="py-10">
      <div className="container-shell space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Customer Portal</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">My Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">Track appointments, store credit, reward points, and account details.</p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/book`}>Book appointment</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Upcoming" value={String(upcoming.length)} />
          <StatCard icon={<Scissors className="h-5 w-5" />} label="Completed" value={String(completed)} />
          <StatCard icon={<Wallet className="h-5 w-5" />} label="Store credit" value={formatCurrency(data.profile.creditBalance)} />
          <StatCard icon={<Gift className="h-5 w-5" />} label="Reward points" value={String(data.profile.rewardPoints)} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-gold/15 p-5">
              <CardTitle>My Bookings</CardTitle>
              <CardContent className="mt-1 p-0">Latest appointments connected to {data.profile.email}.</CardContent>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gold/10 text-xs uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.length ? (
                    data.bookings.map((booking) => (
                      <tr key={booking.id} className="border-t border-gold/10">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">{booking.services || "Service pending"}</p>
                          {booking.address ? <p className="mt-1 text-xs text-muted">{booking.address}</p> : null}
                        </td>
                        <td className="px-4 py-4 text-muted">{formatDate(booking.date)}</td>
                        <td className="px-4 py-4 text-muted">{booking.appointmentType}</td>
                        <td className="px-4 py-4"><StatusBadge status={booking.status} /></td>
                        <td className="px-4 py-4 font-semibold text-foreground">{formatCurrency(booking.total)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-center text-muted" colSpan={5}>No bookings found for this email yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardTitle>Profile</CardTitle>
            <div className="mt-5 space-y-3">
              <Detail label="Name" value={data.profile.name || "-"} />
              <Detail label="Email" value={data.profile.email || "-"} />
              <Detail label="Phone" value={data.profile.phone || "-"} />
              <Detail label="Store credit" value={formatCurrency(data.profile.creditBalance)} />
              <Detail label="Reward points" value={String(data.profile.rewardPoints)} />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/15 text-gold">{icon}</div>
      <p className="mt-4 text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gold/15 bg-gold/5 p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = bookingStatusLabels[status as BookingStatus] ?? status;
  return <span className="inline-flex rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">{label}</span>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai"
  }).format(new Date(value));
}
