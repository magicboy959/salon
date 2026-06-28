import type { RowDataPacket } from "mysql2";
import { query } from "@/lib/db";

type CustomerSummaryRow = RowDataPacket & {
  userId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  rewardPoints: number | null;
  creditBalance: string | number | null;
};

type CustomerBookingRow = RowDataPacket & {
  id: string;
  customerName: string;
  appointmentType: "SALON" | "HOME";
  status: string;
  date: Date | string;
  paymentMethod: string;
  address: string | null;
  total: string | number | null;
  services: string | null;
};

export async function getCustomerDashboard(email: string) {
  const [summary] = await query<CustomerSummaryRow[]>(
    `SELECT
      User.id AS userId,
      User.name,
      User.email,
      User.phone,
      COALESCE(Customer.rewardPoints, 0) AS rewardPoints,
      COALESCE(StoreCreditAccount.balance, 0) AS creditBalance
    FROM User
    LEFT JOIN Customer ON Customer.userId = User.id
    LEFT JOIN StoreCreditAccount ON StoreCreditAccount.userId = User.id
    WHERE User.email = ?
    LIMIT 1`,
    [email]
  );

  const bookings = await query<CustomerBookingRow[]>(
    `SELECT
      Booking.id,
      Booking.customerName,
      Booking.appointmentType,
      Booking.status,
      Booking.date,
      Booking.paymentMethod,
      Booking.address,
      COALESCE(SUM(BookingItem.price), 0) AS total,
      COALESCE(GROUP_CONCAT(BookingItem.serviceName ORDER BY BookingItem.serviceName SEPARATOR ', '), '') AS services
    FROM Booking
    LEFT JOIN BookingItem ON BookingItem.bookingId = Booking.id
    WHERE Booking.email = ? OR Booking.customerId = (
      SELECT Customer.id
      FROM Customer
      INNER JOIN User ON User.id = Customer.userId
      WHERE User.email = ?
      LIMIT 1
    )
    GROUP BY Booking.id
    ORDER BY Booking.date DESC
    LIMIT 50`,
    [email, email]
  );

  return {
    profile: summary
      ? {
          name: summary.name,
          email: summary.email,
          phone: summary.phone,
          rewardPoints: Number(summary.rewardPoints ?? 0),
          creditBalance: Number(summary.creditBalance ?? 0)
        }
      : {
          name: null,
          email,
          phone: null,
          rewardPoints: 0,
          creditBalance: 0
        },
    bookings: bookings.map((booking) => ({
      id: booking.id,
      customerName: booking.customerName,
      appointmentType: booking.appointmentType,
      status: booking.status,
      date: booking.date instanceof Date ? booking.date.toISOString() : new Date(booking.date).toISOString(),
      paymentMethod: booking.paymentMethod,
      address: booking.address,
      total: Number(booking.total ?? 0),
      services: booking.services ?? ""
    }))
  };
}

export async function updateCustomerProfile(email: string, input: { name: string; phone?: string | null }) {
  await query("UPDATE User SET name = ?, phone = ?, updatedAt = NOW(3) WHERE email = ?", [
    input.name,
    input.phone?.trim() || null,
    email
  ]);
}
