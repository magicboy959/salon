import { connection } from "next/server";
import { ContentPage } from "@/components/sections/content-page";
import { listPublicServices } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  await connection();
  const { locale } = await params;
  const services = await listPublicServices();
  const copy =
    locale === "ar"
      ? {
          title: "الخدمات",
          subtitle: "قصات الشعر، الفيد، تلوين اللحية، تلوين الشعر، التنعيم، وعلاجات كيفن مورفي مع حجز مباشر عبر واتساب."
        }
      : {
          title: "Services",
          subtitle: "Haircuts, fades, beard color, hair color, smoothing, and Kevin Murphy treatments with direct WhatsApp booking."
        };

  return (
    <ContentPage
      title={copy.title}
      subtitle={copy.subtitle}
      items={[...services]}
      image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80"
      locale={locale}
    />
  );
}
