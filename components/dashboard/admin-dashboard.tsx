"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Eye, LogOut, MessageSquare, RefreshCw, Scissors, Search, UserPlus, Wallet, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import {
  appointmentTypes,
  bookingStatusLabels,
  bookingStatuses,
  paymentMethods,
  type AdminBooking,
  type AdminBookingBarberOption,
  type AdminBookingServiceOption,
  type AppointmentType,
  type BookingStatus,
  type PaymentMethod
} from "@/lib/admin-booking-types";

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

type AdminContent = {
  services: Array<{ id: string; name: string; category: string; description: string; duration: number; price: number; active: boolean }>;
  gallery: Array<{ id: string; title: string; imageUrl: string; alt: string; category: string; published: boolean }>;
  offers: Array<{ id: string; code: string; description: string; discountPct: number; active: boolean; expiresAt: string | null }>;
  templates: Array<{ id: string; type: "email" | "whatsapp"; key: string; subject?: string; body: string }>;
};

export function AdminDashboard({ adminUser, locale }: { adminUser: { name?: string | null; email?: string | null; roles: string[] }; locale: string }) {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookingOptions, setBookingOptions] = useState<{ services: AdminBookingServiceOption[]; barbers: AdminBookingBarberOption[] }>({ services: [], barbers: [] });
  const [content, setContent] = useState<AdminContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
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
      setBookingOptions(payload.options ?? { services: [], barbers: [] });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function loadContent() {
    setContentLoading(true);
    setContentError(null);
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not load content");
      setContent(payload);
    } catch (loadError) {
      setContentError(loadError instanceof Error ? loadError.message : "Could not load content");
    } finally {
      setContentLoading(false);
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
      const changedAt = new Date().toISOString();
      setBookings((current) =>
        current.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
                statusHistory:
                  booking.status === status
                    ? booking.statusHistory
                    : [
                        {
                          id: `local-${changedAt}`,
                          oldStatus: booking.status,
                          newStatus: status,
                          createdAt: changedAt,
                          changedByName: adminUser.name ?? null,
                          changedByEmail: adminUser.email ?? null,
                          note: null
                        },
                        ...booking.statusHistory
                      ]
              }
            : booking
        )
      );
      setSelectedBooking((current) =>
        current?.id === id
          ? {
              ...current,
              status,
              statusHistory:
                current.status === status
                  ? current.statusHistory
                  : [
                      {
                        id: `local-${changedAt}`,
                        oldStatus: current.status,
                        newStatus: status,
                        createdAt: changedAt,
                        changedByName: adminUser.name ?? null,
                        changedByEmail: adminUser.email ?? null,
                        note: null
                      },
                      ...current.statusHistory
                    ]
            }
          : current
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update booking");
    } finally {
      setSavingId(null);
    }
  }

  async function updateBookingDetails(id: string, details: { date: string; appointmentType: AppointmentType; paymentMethod: PaymentMethod; address: string | null; notes: string | null; serviceNames: string[]; barberId: string | null }) {
    setSavingId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "details", id, ...details })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not update booking details");
      const changedAt = new Date().toISOString();
      const applyUpdate = (booking: AdminBooking): AdminBooking => ({
        ...booking,
        ...details,
        services: details.serviceNames.join(", "),
        total: details.serviceNames.reduce((sum, name) => sum + (bookingOptions.services.find((service) => service.name === name)?.price ?? 0), 0),
        barberName: bookingOptions.barbers.find((barber) => barber.id === details.barberId)?.name ?? null,
        statusHistory: [
          {
            id: `local-details-${changedAt}`,
            oldStatus: booking.status,
            newStatus: booking.status,
            createdAt: changedAt,
            changedByName: adminUser.name ?? null,
            changedByEmail: adminUser.email ?? null,
            note: "Booking details updated"
          },
          ...booking.statusHistory
        ]
      });
      setBookings((current) => current.map((booking) => (booking.id === id ? applyUpdate(booking) : booking)));
      setSelectedBooking((current) => (current?.id === id ? applyUpdate(current) : current));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update booking details");
    } finally {
      setSavingId(null);
    }
  }

  useEffect(() => {
    void loadBookings();
    void loadUsers();
    void loadContent();
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
        <ContentManager content={content} loading={contentLoading} error={contentError} onReload={loadContent} />
        {selectedBooking ? (
          <BookingDetailsModal
            key={selectedBooking.id}
            booking={selectedBooking}
            serviceOptions={bookingOptions.services}
            barberOptions={bookingOptions.barbers}
            onClose={() => setSelectedBooking(null)}
            onChangeStatus={changeStatus}
            onUpdateDetails={updateBookingDetails}
            saving={savingId === selectedBooking.id}
          />
        ) : null}
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

function ContentManager({
  content,
  loading,
  error,
  onReload
}: {
  content: AdminContent | null;
  loading: boolean;
  error: string | null;
  onReload: () => Promise<void>;
}) {
  const firstService = content?.services[0];
  const firstTemplate = content?.templates[0];
  const [service, setService] = useState({ id: "", name: "", category: "", description: "", duration: "30", price: "0", active: true });
  const [gallery, setGallery] = useState({ title: "", imageUrl: "", alt: "", category: "Salon", published: true });
  const [offer, setOffer] = useState({ code: "", description: "", discountPct: "10", expiresAt: "", active: true });
  const [template, setTemplate] = useState({ id: "", type: "email" as "email" | "whatsapp", subject: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (firstService && !service.id) {
      setService({
        id: firstService.id,
        name: firstService.name,
        category: firstService.category,
        description: firstService.description,
        duration: String(firstService.duration),
        price: String(firstService.price),
        active: firstService.active
      });
    }
    if (firstTemplate && !template.id) {
      setTemplate({ id: firstTemplate.id, type: firstTemplate.type, subject: firstTemplate.subject ?? "", body: firstTemplate.body });
    }
  }, [firstService, firstTemplate, service.id, template.id]);

  async function save(payload: Record<string, unknown>) {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not save content");
      setMessage("Saved");
      await onReload();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Could not save content");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Card><CardTitle>Content Manager</CardTitle><CardContent className="mt-2">Loading content...</CardContent></Card>;

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-gold/15 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Content Manager</CardTitle>
          <CardContent className="mt-1 p-0">Update service pricing, gallery items, offers, and message templates.</CardContent>
        </div>
        <Button type="button" variant="outline" onClick={onReload}><RefreshCw className="h-4 w-4" />Refresh</Button>
      </div>
      {error || message ? <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-foreground">{error ?? message}</div> : null}
      <div className="mt-5 grid gap-5 xl:grid-cols-4">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save({ action: "service", ...service, duration: Number(service.duration), price: Number(service.price) });
          }}
        >
          <h3 className="text-sm font-semibold uppercase text-muted">Service Price</h3>
          <select
            value={service.id}
            onChange={(event) => {
              const selected = content?.services.find((item) => item.id === event.target.value);
              if (selected) setService({ id: selected.id, name: selected.name, category: selected.category, description: selected.description, duration: String(selected.duration), price: String(selected.price), active: selected.active });
            }}
            className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
          >
            {content?.services.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <Input value={service.name} onChange={(event) => setService((current) => ({ ...current, name: event.target.value }))} placeholder="Service name" />
          <Input value={service.category} onChange={(event) => setService((current) => ({ ...current, category: event.target.value }))} placeholder="Category" />
          <Input value={service.price} onChange={(event) => setService((current) => ({ ...current, price: event.target.value }))} type="number" min="0" step="0.01" placeholder="Price" />
          <Input value={service.duration} onChange={(event) => setService((current) => ({ ...current, duration: event.target.value }))} type="number" min="5" placeholder="Minutes" />
          <Textarea value={service.description} onChange={(event) => setService((current) => ({ ...current, description: event.target.value }))} maxLength={191} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={service.active} onChange={(event) => setService((current) => ({ ...current, active: event.target.checked }))} />Active</label>
          <Button type="submit" disabled={saving} className="w-full">Save service</Button>
        </form>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save({ action: "gallery", ...gallery });
            setGallery({ title: "", imageUrl: "", alt: "", category: "Salon", published: true });
          }}
        >
          <h3 className="text-sm font-semibold uppercase text-muted">Gallery Picture</h3>
          <Input value={gallery.title} onChange={(event) => setGallery((current) => ({ ...current, title: event.target.value }))} placeholder="Title" required />
          <Input value={gallery.imageUrl} onChange={(event) => setGallery((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Image URL or /gallery/file.jpg" required />
          <Input value={gallery.alt} onChange={(event) => setGallery((current) => ({ ...current, alt: event.target.value }))} placeholder="Alt text" required />
          <Input value={gallery.category} onChange={(event) => setGallery((current) => ({ ...current, category: event.target.value }))} placeholder="Category" required />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={gallery.published} onChange={(event) => setGallery((current) => ({ ...current, published: event.target.checked }))} />Published</label>
          <Button type="submit" disabled={saving} className="w-full">Add picture</Button>
        </form>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save({ action: "offer", ...offer, discountPct: Number(offer.discountPct), expiresAt: offer.expiresAt || null });
          }}
        >
          <h3 className="text-sm font-semibold uppercase text-muted">Offer</h3>
          <Input value={offer.code} onChange={(event) => setOffer((current) => ({ ...current, code: event.target.value }))} placeholder="Code" required />
          <Input value={offer.discountPct} onChange={(event) => setOffer((current) => ({ ...current, discountPct: event.target.value }))} type="number" min="1" max="100" placeholder="Discount %" required />
          <Input value={offer.expiresAt} onChange={(event) => setOffer((current) => ({ ...current, expiresAt: event.target.value }))} type="date" />
          <Textarea value={offer.description} onChange={(event) => setOffer((current) => ({ ...current, description: event.target.value }))} placeholder="Offer description" maxLength={191} required />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={offer.active} onChange={(event) => setOffer((current) => ({ ...current, active: event.target.checked }))} />Active</label>
          <Button type="submit" disabled={saving} className="w-full">Save offer</Button>
        </form>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save({ action: "template", ...template });
          }}
        >
          <h3 className="text-sm font-semibold uppercase text-muted">Templates</h3>
          <select
            value={template.id}
            onChange={(event) => {
              const selected = content?.templates.find((item) => item.id === event.target.value);
              if (selected) setTemplate({ id: selected.id, type: selected.type, subject: selected.subject ?? "", body: selected.body });
            }}
            className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
          >
            {content?.templates.map((item) => <option key={item.id} value={item.id}>{item.type}: {item.key}</option>)}
          </select>
          {template.type === "email" ? <Input value={template.subject} onChange={(event) => setTemplate((current) => ({ ...current, subject: event.target.value }))} placeholder="Subject" /> : null}
          <Textarea value={template.body} onChange={(event) => setTemplate((current) => ({ ...current, body: event.target.value }))} maxLength={191} />
          <Button type="submit" disabled={saving || !template.id} className="w-full">Save template</Button>
        </form>
      </div>
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
  serviceOptions,
  barberOptions,
  onClose,
  onChangeStatus,
  onUpdateDetails,
  saving
}: {
  booking: AdminBooking;
  serviceOptions: AdminBookingServiceOption[];
  barberOptions: AdminBookingBarberOption[];
  onClose: () => void;
  onChangeStatus: (id: string, status: BookingStatus) => Promise<void>;
  onUpdateDetails: (id: string, details: { date: string; appointmentType: AppointmentType; paymentMethod: PaymentMethod; address: string | null; notes: string | null; serviceNames: string[]; barberId: string | null }) => Promise<void>;
  saving: boolean;
}) {
  const [editForm, setEditForm] = useState(() => ({
    date: toDateTimeLocal(booking.date),
    appointmentType: booking.appointmentType,
    paymentMethod: booking.paymentMethod,
    serviceName: booking.serviceNames[0] ?? serviceOptions[0]?.name ?? "",
    barberId: booking.barberId ?? "",
    address: booking.address ?? "",
    notes: booking.notes ?? ""
  }));

  async function submitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onUpdateDetails(booking.id, {
      date: new Date(editForm.date).toISOString(),
      appointmentType: editForm.appointmentType,
      paymentMethod: editForm.paymentMethod,
      serviceNames: [editForm.serviceName].filter(Boolean),
      barberId: editForm.barberId || null,
      address: editForm.address.trim() || null,
      notes: editForm.notes.trim() || null
    });
  }

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
          <Detail label="Barber" value={booking.barberName || "Any available barber"} />
          <Detail label="Appointment type" value={booking.appointmentType} />
          <Detail label="Payment" value={booking.paymentMethod} />
          <Detail label="Total" value={formatCurrency(booking.total)} />
          <Detail label="Address" value={booking.address || "-"} className="md:col-span-2" />
          <Detail label="Notes" value={booking.notes || "-"} className="md:col-span-2" />
        </div>
        <form onSubmit={submitEdit} className="border-t border-gold/15 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase text-muted">Edit Booking</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Date and time">
              <Input value={editForm.date} onChange={(event) => setEditForm((current) => ({ ...current, date: event.target.value }))} type="datetime-local" required />
            </Field>
            <Field label="Appointment type">
              <select
                value={editForm.appointmentType}
                onChange={(event) => setEditForm((current) => ({ ...current, appointmentType: event.target.value as AppointmentType }))}
                className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
              >
                {appointmentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </Field>
            <Field label="Payment method">
              <select
                value={editForm.paymentMethod}
                onChange={(event) => setEditForm((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod }))}
                className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
              >
                {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
              </select>
            </Field>
            <Field label="Service">
              <select
                value={editForm.serviceName}
                onChange={(event) => setEditForm((current) => ({ ...current, serviceName: event.target.value }))}
                className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
                required
              >
                {serviceOptions.map((service) => <option key={service.name} value={service.name}>{service.name} - {formatCurrency(service.price)}</option>)}
              </select>
            </Field>
            <Field label="Barber">
              <select
                value={editForm.barberId}
                onChange={(event) => setEditForm((current) => ({ ...current, barberId: event.target.value }))}
                className="h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground"
              >
                <option value="">Any available barber</option>
                {barberOptions.map((barber) => <option key={barber.id} value={barber.id}>{barber.name}</option>)}
              </select>
            </Field>
            <Field label="Address">
              <Input value={editForm.address} onChange={(event) => setEditForm((current) => ({ ...current, address: event.target.value }))} />
            </Field>
            <Field label="Notes">
              <Input value={editForm.notes} onChange={(event) => setEditForm((current) => ({ ...current, notes: event.target.value }))} />
            </Field>
            <div className="flex items-end">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
        <div className="border-t border-gold/15 p-5">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-semibold uppercase text-muted">Status Timeline</h3>
          </div>
          <div className="mt-4 space-y-3">
            {booking.statusHistory.length ? (
              booking.statusHistory.map((event) => (
                <div key={event.id} className="rounded-md border border-gold/15 bg-gold/5 p-3">
                  <p className="text-sm font-semibold text-foreground">
                    {event.oldStatus === event.newStatus ? "Booking details updated" : `${bookingStatusLabels[event.oldStatus]} to ${bookingStatusLabels[event.newStatus]}`}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(event.createdAt)} by {event.changedByName || event.changedByEmail || "System"}
                  </p>
                  {event.note ? <p className="mt-2 text-sm text-muted">{event.note}</p> : null}
                </div>
              ))
            ) : (
              <p className="rounded-md border border-gold/15 bg-gold/5 p-3 text-sm text-muted">No status changes recorded yet.</p>
            )}
          </div>
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
      : `Hello ${booking.customerName}, reminder for your appointment on ${formatDate(booking.date)} at Alshanab Al Aswad Gents Salon.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai"
  }).format(new Date(value));
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
