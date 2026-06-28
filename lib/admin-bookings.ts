import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { query } from "@/lib/db";
import type { BookingStatus, BookingStatusHistory } from "@/lib/admin-booking-types";

type BookingRow = RowDataPacket & {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  appointmentType: "SALON" | "HOME";
  status: BookingStatus;
  date: Date;
  paymentMethod: string;
  address: string | null;
  notes: string | null;
  total: string | number | null;
  services: string | null;
};

type StatusHistoryRow = RowDataPacket & {
  id: string;
  bookingId: string;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
  createdAt: Date | string;
  changedByName: string | null;
  changedByEmail: string | null;
  note: string | null;
};

export async function listAdminBookings() {
  const rows = await query<BookingRow[]>(
    `SELECT
      Booking.id,
      Booking.customerName,
      Booking.email,
      Booking.phone,
      Booking.appointmentType,
      Booking.status,
      Booking.date,
      Booking.paymentMethod,
      Booking.address,
      Booking.notes,
      COALESCE(SUM(BookingItem.price), 0) AS total,
      COALESCE(GROUP_CONCAT(BookingItem.serviceName ORDER BY BookingItem.serviceName SEPARATOR ', '), '') AS services
    FROM Booking
    LEFT JOIN BookingItem ON BookingItem.bookingId = Booking.id
    GROUP BY Booking.id
    ORDER BY Booking.date DESC
    LIMIT 100`
  );

  const historyRows = rows.length
    ? await query<StatusHistoryRow[]>(
        `SELECT
          BookingStatusLog.id,
          BookingStatusLog.bookingId,
          BookingStatusLog.oldStatus,
          BookingStatusLog.newStatus,
          BookingStatusLog.createdAt,
          BookingStatusLog.note,
          User.name AS changedByName,
          User.email AS changedByEmail
        FROM BookingStatusLog
        LEFT JOIN User ON User.id = BookingStatusLog.changedByUserId
        WHERE BookingStatusLog.bookingId IN (?)
        ORDER BY BookingStatusLog.createdAt DESC`,
        [rows.map((row) => row.id)]
      )
    : [];
  const historyByBooking = historyRows.reduce<Record<string, BookingStatusHistory[]>>((acc, row) => {
    acc[row.bookingId] ??= [];
    acc[row.bookingId].push({
      id: row.id,
      oldStatus: row.oldStatus,
      newStatus: row.newStatus,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString(),
      changedByName: row.changedByName,
      changedByEmail: row.changedByEmail,
      note: row.note
    });
    return acc;
  }, {});

  return rows.map((row) => ({
    id: row.id,
    customerName: row.customerName,
    email: row.email,
    phone: row.phone,
    appointmentType: row.appointmentType,
    status: row.status,
    date: row.date instanceof Date ? row.date.toISOString() : new Date(row.date).toISOString(),
    paymentMethod: row.paymentMethod,
    address: row.address,
    notes: row.notes,
    total: Number(row.total ?? 0),
    services: row.services ?? "",
    statusHistory: historyByBooking[row.id] ?? []
  }));
}

type StatusRow = RowDataPacket & { status: BookingStatus };

export async function updateBookingStatus(id: string, status: BookingStatus, changedByUserId?: string) {
  const rows = await query<StatusRow[]>("SELECT status FROM Booking WHERE id = ? LIMIT 1", [id]);
  const previousStatus = rows[0]?.status;
  if (!previousStatus) return 0;

  const result = await query<ResultSetHeader>("UPDATE Booking SET status = ?, updatedAt = NOW(3) WHERE id = ?", [status, id]);

  if (result.affectedRows && previousStatus !== status) {
    await query<ResultSetHeader>(
      "INSERT INTO BookingStatusLog (id, bookingId, changedByUserId, oldStatus, newStatus, createdAt) VALUES (UUID(), ?, ?, ?, ?, NOW(3))",
      [id, changedByUserId ?? null, previousStatus, status]
    );
  }

  return result.affectedRows;
}
