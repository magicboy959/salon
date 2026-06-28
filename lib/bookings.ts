import { randomUUID } from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { query, transaction } from "@/lib/db";
import { services } from "@/lib/data";
import type { BookingInput } from "@/lib/validations";

export type StoredBooking = {
  id: string;
  status: "PENDING";
  date: Date;
  items: Array<{
    id: string;
    serviceName: string;
    price: number;
    duration: number;
  }>;
};

type IdRow = RowDataPacket & { id: string };

async function resolveForeignId(table: "Employee" | "Branch", idOrName?: string) {
  if (!idOrName) return null;
  const rows = await query<IdRow[]>(
    table === "Employee"
      ? "SELECT Employee.id FROM Employee INNER JOIN User ON User.id = Employee.userId WHERE Employee.id = ? OR User.name = ? LIMIT 1"
      : "SELECT id FROM Branch WHERE id = ? OR name = ? LIMIT 1",
    [idOrName, idOrName]
  );
  return rows[0]?.id ?? null;
}

async function resolveCustomerId(email: string) {
  const rows = await query<IdRow[]>(
    `SELECT Customer.id
    FROM Customer
    INNER JOIN User ON User.id = Customer.userId
    WHERE User.email = ?
    LIMIT 1`,
    [email]
  );
  return rows[0]?.id ?? null;
}

export async function createStoredBooking(input: BookingInput): Promise<StoredBooking> {
  const bookingId = randomUUID();
  const appointmentDate = new Date(`${input.date}T${input.time}`);
  const status = "PENDING" as const;
  const barberId = await resolveForeignId("Employee", input.barberId);
  const branchId = await resolveForeignId("Branch", input.branchId);
  const customerId = await resolveCustomerId(input.email);
  const items = input.serviceIds.map((serviceName) => {
    const service = services.find((item) => item.name === serviceName);
    return {
      id: randomUUID(),
      serviceName,
      price: service?.price ?? 0,
      duration: service?.duration ?? 30
    };
  });

  await transaction(async (connection) => {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO Booking (
        id, customerId, customerName, email, phone, appointmentType, status, arrivalStatus, date,
        address, latitude, longitude, notes, couponCode, paymentMethod, barberId, branchId,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        bookingId,
        customerId,
        input.customerName,
        input.email,
        input.phone,
        input.appointmentType,
        status,
        input.appointmentType === "HOME" ? "SCHEDULED" : null,
        appointmentDate,
        input.address ?? null,
        input.latitude ?? null,
        input.longitude ?? null,
        input.notes ?? null,
        input.couponCode ?? null,
        input.paymentMethod,
        barberId,
        branchId
      ]
    );

    for (const item of items) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO BookingItem (
          id, bookingId, serviceName, price, duration
        ) VALUES (?, ?, ?, ?, ?)`,
        [item.id, bookingId, item.serviceName, item.price, item.duration]
      );
    }
  });

  return { id: bookingId, status, date: appointmentDate, items };
}
