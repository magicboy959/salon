"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { CalendarDays, CheckCircle2, CircleDollarSign, Eye, LogOut, MessageSquare, RefreshCw, Scissors, Search, UserPlus, Wallet, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { bookingStatusLabels, bookingStatuses, type AdminBooking, type BookingStatus } from "@/lib/admin-booking-types";

const userRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "BARBER", "CUSTOMER"] as const;

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  roles: string;
  creditBalance: number;
  createdAt: string;
};

export function AdminDashboard({ adminUser, locale }: { adminUser: { name?: string | null; email?: string | null; roles: string[] }; locale: string }) {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [filters, setFilters] = useState({ search: "", status: "ALL", date: "" });
  const [userSearch, setUserSearch] = useState("");
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

  async function changeUserRole(userId: string, role: string) {
    setSavingId(userId);
    setUserError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "role", userId, role })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not update user role");
      setUsers((current) => current.map((user) => (user.id === userId ? { ...user, roles: role } : user)));
    } catch (roleError) {
      setUserError(roleError instanceof Error ? roleError.message : "Could not update user role");
    } finally {
      setSavingId(null);
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
      active: bookings.filter((booking) => ["PENDING", "CONFIRMED", "IN_PROGRESS", "RESCHEDULED"].includes(booking.status)).length,
      revenue: bookings.reduce((sum, booking) => sum + booking.total, 0)
    };
  }, [bookings]);

  const userStats = useMemo(() => ({
    total: users.length,
    customers: users.filter((user) => user.roles.includes("CUSTOMER")).length,
    staff: users.filter((user) => ["SUPER_ADMIN", "ADMIN", "MANAGER", "BARBER"].some((role) => user.roles.includes(role))).length,
    credit: users.reduce((sum, user) => sum + user.creditBalance, 0)
  }), [users]);

  const filteredBookings = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch = !search || [booking.customerName, booking.phone, booking.email, booking.services].some((value) => value.toLowerCase().includes(search));
      const matchesStatus = filters.status === "ALL" || booking.status === filters.status;
      const matchesDate = !filters.date || booking.date.slice(0, 10) === filters.date;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, filters]);

  const filteredUsers = useMemo(() => {
    const search = userSearch.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) => [user.name ?? "", user.email ?? "", user.phone ?? "", user.roles].some((value) => value.toLowerCase().includes(search)));
  }, [users, userSearch]);

  return (
    <section className="py-10">
      <div className="container-shell space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Bookings Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">Manage appointment requests, customer details, service totals, and booking status.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-lg border border-gold/20 bg-white/80 px-4 py-2 text-sm">
              <p className="font-semibold text-foreground">{adminUser.name || adminUser.email}</p>
              <p className="text-xs text-muted">{adminUser.roles.join(", ")}</p>
            </div>
            <Button type="button" variant="outline" onClick={loadBookings} disabled={loading}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Refresh
            </Button>
            <Button type="button" variant="dark" onClick={() => signOut({ callbackUrl: `/${locale}/login` })}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Total bookings" value={String(stats.total)} />
          <StatCard icon={<Scissors className="h-5 w-5" />} label="Today" value={String(stats.today)} />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Active workflow" value={String(stats.active)} />
          <StatCard icon={<CircleDollarSign className="h-5 w-5" />} label="Value" value={formatCurrency(stats.revenue)} />
        </div>

        <Card className="overflow-hidden p-0">
          <div className="space-y-5 border-b border-gold/15 p-5">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardContent className="mt-1 p-0">Latest 100 appointments from the MySQL database.</CardContent>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  className="pl-9"
                  placeholder="Search name, phone, email, service"
                />
              </div>
              <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="h-11 rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground">
                <option value="ALL">All statuses</option>
                {bookingStatuses.map((status) => <option key={status} value={status}>{bookingStatusLabels[status]}</option>)}
              </select>
              <Input value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} type="date" />
              <Button type="button" variant="outline" onClick={() => setFilters({ search: "", status: "ALL", date: "" })}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
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
                ) : filteredBookings.length ? (
                  filteredBookings.map((booking) => (
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
                            {bookingStatuses.map((status) => <option key={status} value={status}>{bookingStatusLabels[status]}</option>)}
                          </select>
                          <a className="inline-flex h-9 items-center rounded-md border border-gold/25 px-3 text-xs font-semibold text-foreground" href={`tel:${booking.phone}`}>
                            Call
                          </a>
                          <a className="inline-flex h-9 items-center rounded-md border border-gold/25 px-3 text-xs font-semibold text-foreground" href={`https://wa.me/${booking.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                            WhatsApp
                          </a>
                          <a className="inline-flex h-9 items-center rounded-md border border-gold/25 px-3 text-xs font-semibold text-foreground" href={whatsappUrl(booking, "confirm")} target="_blank" rel="noreferrer">
                            Confirm
                          </a>
                          <Button type="button" variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted" colSpan={8}>No bookings match the current filters.</td>
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
                <CardTitle>User Dashboard</CardTitle>
                <CardContent className="mt-1 p-0">Admins, staff, customers, roles, and current credit balance.</CardContent>
              </div>
              <Button type="button" variant="outline" onClick={loadUsers} disabled={usersLoading}>
                <RefreshCw className={usersLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                Refresh
              </Button>
            </div>
            {userError ? <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{userError}</div> : null}
            <div className="grid gap-3 border-b border-gold/15 p-5 sm:grid-cols-4">
              <MiniStat label="Users" value={String(userStats.total)} />
              <MiniStat label="Customers" value={String(userStats.customers)} />
              <MiniStat label="Staff" value={String(userStats.staff)} />
              <MiniStat label="Credit" value={formatCurrency(userStats.credit)} />
              <div className="relative sm:col-span-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} className="pl-9" placeholder="Search users by name, email, phone, or role" />
              </div>
            </div>
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
                  ) : filteredUsers.length ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t border-gold/10">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">{user.name || "-"}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </td>
                        <td className="px-4 py-4 text-muted">{user.phone || "-"}</td>
                        <td className="px-4 py-4">
                          <select
                            value={(user.roles.split(", ")[0] || "CUSTOMER")}
                            onChange={(event) => changeUserRole(user.id, event.target.value)}
                            disabled={savingId === user.id}
                            className="h-9 rounded-md border border-gold/25 bg-white px-2 text-xs text-foreground"
                          >
                            {userRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-4 font-semibold text-foreground">{formatCurrency(user.creditBalance)}</td>
                        <td className="px-4 py-4 text-muted">{new Date(user.createdAt).toLocaleDateString("en-AE")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td className="px-4 py-8 text-center text-muted" colSpan={5}>No users match the current search.</td></tr>
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
                    {userRoles.map((role) => <option key={role} value={role}>{role}</option>)}
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
        {selectedBooking ? <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onChangeStatus={changeStatus} saving={savingId === selectedBooking.id} /> : null}
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gold/15 bg-gold/5 p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const cancelled = status === "CANCELLED";
  const completed = status === "COMPLETED";
  const noShow = status === "NO_SHOW";
  const active = status === "CONFIRMED" || status === "IN_PROGRESS";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cancelled || noShow ? "bg-red-50 text-red-700" : completed ? "bg-green-50 text-green-700" : active ? "bg-blue-50 text-blue-700" : "bg-gold/15 text-gold"}`}>
      {cancelled ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
      {bookingStatusLabels[status]}
    </span>
  );
}

function BookingDetailsModal({
  booking,
  onClose,
  onChangeStatus,
  saving
}: {
  booking: AdminBooking;
  onClose: () => void;
  onChangeStatus: (id: string, status: BookingStatus) => Promise<void>;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gold/15 p-5">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Booking Details</p>
            <h2 className="mt-1 text-2xl font-bold text-foreground">{booking.customerName}</h2>
            <p className="mt-1 text-sm text-muted">{booking.services || "No service selected"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-muted hover:bg-gold/10 hover:text-foreground" aria-label="Close details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Detail label="Phone" value={booking.phone} />
          <Detail label="Email" value={booking.email} />
          <Detail label="Date" value={formatDate(booking.date)} />
          <Detail label="Appointment type" value={booking.appointmentType} />
          <Detail label="Payment" value={booking.paymentMethod} />
          <Detail label="Total" value={formatCurrency(booking.total)} />
          <Detail label="Address" value={booking.address || "-"} className="md:col-span-2" />
          <Detail label="Notes" value={booking.notes || "-"} className="md:col-span-2" />
        </div>
        <div className="border-t border-gold/15 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={booking.status} />
              <select
                value={booking.status}
                onChange={(event) => onChangeStatus(booking.id, event.target.value as BookingStatus)}
                disabled={saving}
                className="h-10 rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
              >
                {bookingStatuses.map((status) => <option key={status} value={status}>{bookingStatusLabels[status]}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gold/40 px-4 text-sm font-semibold text-foreground hover:bg-gold/10" href={whatsappUrl(booking, "confirm")} target="_blank" rel="noreferrer">
                <MessageSquare className="h-4 w-4" />
                Confirm
              </a>
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gold/40 px-4 text-sm font-semibold text-foreground hover:bg-gold/10" href={whatsappUrl(booking, "remind")} target="_blank" rel="noreferrer">
                <MessageSquare className="h-4 w-4" />
                Reminder
              </a>
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gold/40 px-4 text-sm font-semibold text-foreground hover:bg-gold/10" href={`tel:${booking.phone}`}>
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-md border border-gold/15 bg-gold/5 p-3 ${className}`}>
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function whatsappUrl(booking: AdminBooking, type: "confirm" | "remind") {
  const phone = booking.phone.replace(/\D/g, "");
  const message =
    type === "confirm"
      ? `Hello ${booking.customerName}, your booking for ${booking.services || "your service"} is confirmed for ${formatDate(booking.date)}.`
      : `Hello ${booking.customerName}, reminder for your appointment on ${formatDate(booking.date)} at Alshanab Alaswad Gents Salon.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
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
