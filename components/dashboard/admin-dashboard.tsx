"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CircleDollarSign, RefreshCw, Scissors, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { bookingStatuses, type AdminBooking, type BookingStatus } from "@/lib/admin-booking-types";

export function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadBookings() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not load bookings");
      setBookings(payload.bookings);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: BookingStatus) {
    setSavingId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not update booking");
      setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update booking");
    } finally {
      setSavingId(null);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: bookings.length,
      today: bookings.filter((booking) => booking.date.slice(0, 10) === today).length,
      pending: bookings.filter((booking) => booking.status === "PENDING").length,
      revenue: bookings.reduce((sum, booking) => sum + booking.total, 0)
    };
  }, [bookings]);

  return (
    <section className="py-10">
      <div className="container-shell space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Bookings Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">Manage appointment requests, customer details, service totals, and booking status.</p>
          </div>
          <Button type="button" variant="outline" onClick={loadBookings} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Total bookings" value={String(stats.total)} />
          <StatCard icon={<Scissors className="h-5 w-5" />} label="Today" value={String(stats.today)} />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Pending" value={String(stats.pending)} />
          <StatCard icon={<CircleDollarSign className="h-5 w-5" />} label="Value" value={formatCurrency(stats.revenue)} />
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-gold/15 p-5">
            <CardTitle>Recent Bookings</CardTitle>
            <CardContent className="mt-1 p-0">Latest 100 appointments from the MySQL database.</CardContent>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-gold/10 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted" colSpan={8}>Loading bookings...</td>
                  </tr>
                ) : bookings.length ? (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-gold/10 align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground">{booking.customerName}</p>
                        <p className="text-xs text-muted">{booking.phone}</p>
                        <p className="text-xs text-muted">{booking.email}</p>
                      </td>
                      <td className="px-4 py-4 text-muted">{booking.services || "-"}</td>
                      <td className="px-4 py-4 text-muted">{formatDate(booking.date)}</td>
                      <td className="px-4 py-4 text-muted">{booking.appointmentType}</td>
                      <td className="px-4 py-4 text-muted">{booking.paymentMethod}</td>
                      <td className="px-4 py-4 font-semibold text-foreground">{formatCurrency(booking.total)}</td>
                      <td className="px-4 py-4"><StatusBadge status={booking.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={booking.status}
                            onChange={(event) => changeStatus(booking.id, event.target.value as BookingStatus)}
                            disabled={savingId === booking.id}
                            className="h-9 rounded-md border border-gold/25 bg-white px-2 text-xs text-foreground"
                          >
                            {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                          <a className="inline-flex h-9 items-center rounded-md border border-gold/25 px-3 text-xs font-semibold text-foreground" href={`tel:${booking.phone}`}>
                            Call
                          </a>
                          <a className="inline-flex h-9 items-center rounded-md border border-gold/25 px-3 text-xs font-semibold text-foreground" href={`https://wa.me/${booking.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                            WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted" colSpan={8}>No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
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

function StatusBadge({ status }: { status: BookingStatus }) {
  const cancelled = status === "CANCELLED";
  const completed = status === "COMPLETED";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cancelled ? "bg-red-50 text-red-700" : completed ? "bg-green-50 text-green-700" : "bg-gold/15 text-gold"}`}>
      {cancelled ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai"
  }).format(new Date(value));
}
