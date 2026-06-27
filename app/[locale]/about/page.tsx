import { ContentPage } from "@/components/sections/content-page";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "من نحن",
          subtitle: "صالون رجالي فاخر مبني على العناية الدقيقة والخدمة الخاصة والأدوات المعقمة والضيافة.",
          items: ["قصة العلامة", "معايير الفخامة", "التعقيم", "تجربة VIP", "ثقافة الفريق", "فرص العمل"]
        }
      : {
          title: "About",
          subtitle: "A luxury men's salon built around precise grooming, private service, sanitized tools, and hospitality.",
          items: ["Brand Story", "Luxury Standards", "Sanitization", "VIP Experience", "Team Culture", "Careers Pipeline"]
        };

  return (
    <ContentPage
      title={copy.title}
      subtitle={copy.subtitle}
      items={copy.items}
      image="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1600&q=80"
      locale={locale}
    />
  );
}
