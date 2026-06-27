export const siteConfig = {
  name: "Alshamy Alaswad Salon for Gents",
  shortName: "Alshamy Alaswad",
  description:
    "Luxury men's grooming, VIP barbering, home service, memberships, and premium salon care.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+971 50 801 2791",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971508012791",
  email: "bookings@alshamyalaswad.com",
  address: "Dubai Satwa, Star Building, Shop Number 41",
  mapUrl: "https://share.google/mDYMcb0ng2eF408TC",
  coordinates: { lat: 25.1872, lng: 55.2767 },
  instagram: "https://instagram.com/alshamyalaswad",
  businessHours: [
    "Monday - Thursday: 10:00 - 23:00",
    "Friday - Sunday: 10:00 - 01:00"
  ]
};

export const protectedRoutes = ["/portal", "/admin", "/barber"];
