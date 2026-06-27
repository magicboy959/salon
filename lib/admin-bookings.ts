import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { query } from "@/lib/db";
import type { BookingStatus } from "@/lib/admin-booking-types";

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
    services: row.services ?? ""
  }));
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const result = await query<ResultSetHeader>("UPDATE Booking SET status = ?, updatedAt = NOW(3) WHERE id = ?", [status, id]);
  return result.affectedRows;
}
