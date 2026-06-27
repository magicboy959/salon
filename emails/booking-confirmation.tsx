import * as React from "react";

export function BookingConfirmationEmail({
  customerName,
  serviceSummary,
  dateTime
}: {
  customerName: string;
  serviceSummary: string;
  dateTime: string;
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#050505", color: "#f8f5ef", padding: 32 }}>
      <h1 style={{ color: "#d6b35a" }}>Appointment confirmed</h1>
      <p>{customerName}, your appointment for {serviceSummary} is confirmed.</p>
      <p>{dateTime}</p>
    </div>
  );
}
