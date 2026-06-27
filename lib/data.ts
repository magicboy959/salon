import { Scissors, Sparkles, Crown, Home, Gem, ShieldCheck } from "lucide-react";

export const services = [
  {
    name: "The Cut",
    category: "Hair",
    duration: 30,
    price: 140,
    priceLabel: "AED 140",
    detail: "A wash, cut and dry to complete your grooming look.",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Skin Fade",
    category: "Hair",
    duration: 30,
    price: 160,
    priceLabel: "AED 160",
    detail: "A close skin fade finished with clean detailing and styling.",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Fade & Shave",
    category: "Hair & Beard",
    duration: 30,
    price: 150,
    priceLabel: "AED 150",
    detail: "Fade service paired with a sharp shave for a complete finish.",
    image: "https://images.unsplash.com/photo-1622286346003-c5c7e63b1088?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Beard Color",
    category: "Color",
    duration: 30,
    price: 141,
    priceLabel: "AED 141",
    detail: "Targeted beard color refresh for a fuller, cleaner look.",
    image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Beard & Moustache Color",
    category: "Color",
    duration: 30,
    price: 202,
    priceLabel: "AED 202",
    detail: "Color service for beard and moustache with a natural finish.",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "The Urban Look",
    category: "Styling",
    duration: 30,
    price: 81,
    priceLabel: "AED 81",
    detail: "Quick grooming and styling for a fresh everyday look.",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "The Colour",
    category: "Color",
    duration: 45,
    price: 364,
    priceLabel: "From AED 364",
    detail: "Professional hair color consultation and application.",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Brazilian Blow Out",
    category: "Treatment",
    duration: 60,
    price: 809,
    priceLabel: "From AED 809",
    detail: "Smoothing blow out treatment. Medium length starts at 60 minutes.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Finishing Touch",
    category: "Styling",
    duration: 5,
    price: 30,
    priceLabel: "AED 30",
    detail: "Fast clean-up for edges, neckline, and final polish.",
    image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Therapeutic Hair Treatment",
    category: "Treatment",
    duration: 20,
    price: 104,
    priceLabel: "AED 104",
    detail: "Focused hair treatment to support scalp comfort and hair condition.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kevin Murphy Treat Me Strength",
    category: "Treatment",
    duration: 20,
    price: 289,
    priceLabel: "AED 289",
    detail: "New strengthening treatment for hair that needs extra support.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kevin Murphy Treat Me Hydrate",
    category: "Treatment",
    duration: 15,
    price: 173,
    priceLabel: "AED 173",
    detail: "New hydration treatment for softer, healthier-looking hair.",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kevin Murphy Treat Me Anti-Ageing",
    category: "Treatment",
    duration: 15,
    price: 173,
    priceLabel: "AED 173",
    detail: "New anti-ageing hair treatment for a refreshed finish.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kevin Murphy Treat Me Repair",
    category: "Treatment",
    duration: 15,
    price: 173,
    priceLabel: "AED 173",
    detail: "New repair treatment for stressed or damaged hair.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "White Hair Color - Short",
    category: "Color",
    duration: 30,
    price: 110,
    priceLabel: "From AED 110",
    detail: "Short-hair white color coverage with a clean natural result.",
    image: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kids Cut",
    category: "Hair",
    duration: 15,
    price: 95,
    priceLabel: "AED 95",
    detail: "Haircut for children under 10.",
    image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&w=900&q=80"
  }
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
