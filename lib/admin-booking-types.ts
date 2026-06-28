export const bookingStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export type AdminBooking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  appointmentType: "SALON" | "HOME";
  status: BookingStatus;
  date: string;
  paymentMethod: string;
  address: string | null;
  notes: string | null;
  total: number;
  services: string;
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING: "New",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
  NO_SHOW: "No Show"
};
