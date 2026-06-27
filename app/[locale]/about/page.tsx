import { ContentPage } from "@/components/sections/content-page";

export default function AboutPage() {
  return (
    <ContentPage
      title="About"
      subtitle="A luxury men's salon built around precise grooming, private service, sanitized tools, and hospitality."
      items={["Brand Story", "Luxury Standards", "Sanitization", "VIP Experience", "Team Culture", "Careers Pipeline"]}
      image="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
