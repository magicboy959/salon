"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CircleDollarSign, RefreshCw, Scissors, UserPlus, Wallet, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { bookingStatuses, type AdminBooking, type BookingStatus } from "@/lib/admin-booking-types";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  roles: string;
  creditBalance: number;
  createdAt: string;
};

export function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", password: "", role: "ADMIN" });
  const [credit, setCredit] = useState({ userId: "", amount: "", note: "" });

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

  async function loadUsers() {
    setUsersLoading(true);
    setUserError(null);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not load users");
      setUsers(payload.users);
      setCredit((current) => ({ ...current, userId: current.userId || payload.users[0]?.id || "" }));
    } catch (loadError) {
      setUserError(loadError instanceof Error ? loadError.message : "Could not load users");
    } finally {
      setUsersLoading(false);
    }
  }

  async function createDashboardUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUserError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not create user");
      setNewUser({ name: "", email: "", phone: "", password: "", role: "ADMIN" });
      await loadUsers();
    } catch (createError) {
      setUserError(createError instanceof Error ? createError.message : "Could not create user");
    }
  }

  async function addCredit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUserError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credit)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not add store credit");
      setCredit((current) => ({ ...current, amount: "", note: "" }));
      await loadUsers();
    } catch (creditError) {
      setUserError(creditError instanceof Error ? creditError.message : "Could not add store credit");
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
    void loadUsers();
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

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-gold/15 p-5">
              <div>
                <CardTitle>Users & Store Credit</CardTitle>
                <CardContent className="mt-1 p-0">Admins, customers, roles, and current credit balance.</CardContent>
              </div>
              <Button type="button" variant="outline" onClick={loadUsers} disabled={usersLoading}>
                <RefreshCw className={usersLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                Refresh
              </Button>
            </div>
            {userError ? <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{userError}</div> : null}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gold/10 text-xs uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3">Credit</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr><td className="px-4 py-8 text-center text-muted" colSpan={5}>Loading users...</td></tr>
                  ) : users.length ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-t border-gold/10">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">{user.name || "-"}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </td>
                        <td className="px-4 py-4 text-muted">{user.phone || "-"}</td>
                        <td className="px-4 py-4 text-muted">{user.roles || "-"}</td>
                        <td className="px-4 py-4 font-semibold text-foreground">{formatCurrency(user.creditBalance)}</td>
                        <td className="px-4 py-4 text-muted">{new Date(user.createdAt).toLocaleDateString("en-AE")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td className="px-4 py-8 text-center text-muted" colSpan={5}>No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-5">
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/15 text-gold"><UserPlus className="h-5 w-5" /></div>
                <CardTitle>Create User</CardTitle>
              </div>
              <form onSubmit={createDashboardUser} className="mt-5 grid gap-3">
                <Field label="Name"><Input value={newUser.name} onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))} required /></Field>
                <Field label="Email"><Input value={newUser.email} onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))} type="email" required /></Field>
                <Field label="Phone"><Input value={newUser.phone} onChange={(event) => setNewUser((current) => ({ ...current, phone: event.target.value }))} /></Field>
                <Field label="Password"><Input value={newUser.password} onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))} type="password" minLength={8} required /></Field>
                <Field label="Role">
                  <select value={newUser.role} onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="BARBER">Barber</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </Field>
                <Button type="submit"><UserPlus className="h-4 w-4" />Create</Button>
              </form>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/15 text-gold"><Wallet className="h-5 w-5" /></div>
                <CardTitle>Add Store Credit</CardTitle>
              </div>
              <form onSubmit={addCredit} className="mt-5 grid gap-3">
                <Field label="User">
                  <select value={credit.userId} onChange={(event) => setCredit((current) => ({ ...current, userId: event.target.value }))} className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground" required>
                    {users.map((user) => <option key={user.id} value={user.id}>{user.name || user.email} - {formatCurrency(user.creditBalance)}</option>)}
                  </select>
                </Field>
                <Field label="Amount"><Input value={credit.amount} onChange={(event) => setCredit((current) => ({ ...current, amount: event.target.value }))} type="number" min="1" step="0.01" required /></Field>
                <Field label="Note"><Input value={credit.note} onChange={(event) => setCredit((current) => ({ ...current, note: event.target.value }))} placeholder="Reason or receipt number" /></Field>
                <Button type="submit"><Wallet className="h-4 w-4" />Add credit</Button>
              </form>
            </Card>
          </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
