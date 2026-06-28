export const siteConfig = {
  name: "Alshanab Alaswad Salon",
  shortName: "Alshanab Alaswad",
  description:
    "Luxury men's grooming, VIP barbering, home service, memberships, and premium salon care.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.alshanabalaswadsalon.com",
  phone: "+971 50 801 2791",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971508012791",
  email: "bookings@alshanabalaswadsalon.com",
  address: "Dubai Satwa, Star Building, Shop Number 41",
  mapUrl: "https://share.google/mDYMcb0ng2eF408TC",
  coordinates: { lat: 25.1872, lng: 55.2767 },
  instagram: "https://instagram.com/alshanabalaswadsalon",
  businessHours: [
    "Monday - Thursday: 10:00 - 23:00",
    "Friday - Sunday: 10:00 - 01:00"
  ]
};

export const protectedRoutes = ["/portal", "/admin", "/barber"];
