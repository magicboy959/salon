import { Scissors, Sparkles, Crown, Home, Gem, ShieldCheck } from "lucide-react";

export const services = [
  { name: "Haircut", category: "Hair", duration: 35, price: 95 },
  { name: "Fade", category: "Hair", duration: 40, price: 115 },
  { name: "Kids Haircut", category: "Hair", duration: 30, price: 75 },
  { name: "Hair Wash", category: "Hair", duration: 15, price: 35 },
  { name: "Hair Treatment", category: "Hair", duration: 45, price: 180 },
  { name: "Hair Spa", category: "Hair", duration: 60, price: 220 },
  { name: "Hair Coloring", category: "Hair", duration: 90, price: 280 },
  { name: "Keratin", category: "Treatment", duration: 120, price: 450 },
  { name: "Beard Trim", category: "Beard", duration: 20, price: 55 },
  { name: "Beard Styling", category: "Beard", duration: 30, price: 80 },
  { name: "Facial", category: "Skin", duration: 45, price: 190 },
  { name: "Waxing", category: "Skin", duration: 30, price: 120 },
  { name: "Head Massage", category: "Wellness", duration: 25, price: 95 },
  { name: "VIP Grooming", category: "Signature", duration: 120, price: 620 },
  { name: "Wedding Groom Package", category: "Signature", duration: 180, price: 1200 },
  { name: "Corporate Grooming", category: "Signature", duration: 90, price: 390 },
  { name: "Home Service", category: "Mobile", duration: 90, price: 520 }
] as const;

export const serviceHighlights = [
  { icon: Scissors, title: "Precision Cuts", text: "Consultation-led grooming with sharp finishing." },
  { icon: Crown, title: "VIP Rooms", text: "Private suites for members, grooms, and executives." },
  { icon: Home, title: "Home Service", text: "A barber arrives with sanitized tools and live status." },
  { icon: Gem, title: "Luxury Products", text: "Premium hair, beard, and skin care selected for men." }
] as const;

export const barbers = [
  {
    name: "Omar Alshamy",
    title: "Master Barber",
    rating: 4.98,
    specialties: ["Fade", "VIP Grooming", "Wedding"],
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Karim Haddad",
    title: "Beard Architect",
    rating: 4.94,
    specialties: ["Beard Styling", "Facial", "Hair Spa"],
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Yousef Nasser",
    title: "Home Service Lead",
    rating: 4.96,
    specialties: ["Home Service", "Corporate", "Kids"],
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80"
  }
] as const;

export const gallery = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1622286346003-c5c7e63b1088?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1593702288056-7927b442d653?auto=format&fit=crop&w=1000&q=80"
] as const;

export const offers = [
  { title: "Executive Morning", detail: "Haircut, beard trim, wash, and coffee before noon.", price: 165 },
  { title: "Wedding Groom", detail: "Private suite, facial, styling, beard, and photo-ready finish.", price: 1200 },
  { title: "Home VIP", detail: "Two-service mobile booking with arrival tracking.", price: 520 }
] as const;

export const memberships = [
  { name: "Black", price: 399, features: ["4 haircuts", "Priority booking", "5% products"] },
  { name: "Gold", price: 699, features: ["8 services", "VIP room", "10% products", "Guest pass"] },
  { name: "Royal", price: 1199, features: ["Unlimited trims", "Home visit credit", "Concierge"] }
] as const;

export const reviews = [
  { name: "Fahad A.", text: "The finish, timing, and private-room service are excellent.", rating: 5 },
  { name: "Mohammed K.", text: "Best home barber booking I have used in Dubai.", rating: 5 },
  { name: "Sultan M.", text: "Premium products and a team that knows men's grooming.", rating: 5 }
] as const;

export const stats = [
  { label: "Monthly Bookings", value: "2.8k+" },
  { label: "Master Barbers", value: "18" },
  { label: "Average Rating", value: "4.9" },
  { label: "VIP Members", value: "740+" }
] as const;

export const whyChooseUs = [
  { icon: ShieldCheck, title: "Sanitized and secure", text: "Tool sterilization, encrypted accounts, and verified staff." },
  { icon: Sparkles, title: "Detailed experience", text: "Every visit is tracked from preference to invoice." },
  { icon: Crown, title: "Luxury without friction", text: "Book salon, home, package, membership, or corporate grooming." }
] as const;

export const blogPosts = [
  {
    slug: "perfect-fade-guide",
    title: "How to Choose the Perfect Fade",
    excerpt: "A practical guide to face shape, hair density, and maintenance."
  },
  {
    slug: "beard-care-dubai",
    title: "Beard Care in Dubai Weather",
    excerpt: "Hydration, oils, and trim cadence for a sharper beard."
  },
  {
    slug: "wedding-groom-timeline",
    title: "Wedding Groom Timeline",
    excerpt: "When to book facials, color, beard shaping, and final styling."
  }
] as const;

export const faqs = [
  ["Can I book multiple services?", "Yes. The booking flow supports multiple services, packages, coupons, taxes, invoices, and payment status."],
  ["Do you provide home service?", "Yes. Customers can enter address details, GPS coordinates, notes, barber choice, arrival status, and payment."],
  ["Which languages are supported?", "English and Arabic with localized SEO, RTL/LTR layouts, and translated metadata."],
  ["Can businesses book corporate grooming?", "Yes. Corporate grooming supports scheduled teams, recurring invoices, and admin reporting."]
] as const;
