export const siteConfig = {
  name: "Alshamy Alaswad Salon for Gents",
  shortName: "Alshamy Alaswad",
  description:
    "Luxury men's grooming, VIP barbering, home service, memberships, and premium salon care.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+971 50 000 0000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000",
  email: "bookings@alshamyalaswad.com",
  address: "Business Bay, Dubai, United Arab Emirates",
  coordinates: { lat: 25.1872, lng: 55.2767 },
  instagram: "https://instagram.com/alshamyalaswad",
  businessHours: [
    "Monday - Thursday: 10:00 - 23:00",
    "Friday - Sunday: 10:00 - 01:00"
  ]
};

export const protectedRoutes = ["/portal", "/admin", "/barber"];
