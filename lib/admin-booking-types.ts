export const bookingStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED"] as const;

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
