import { ContentPage } from "@/components/sections/content-page";
import { reviews } from "@/lib/data";

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "التقييمات",
          subtitle: "تقييمات عملاء موثوقة مع مراجعة الإدارة وتقييمات الحلاقين والخدمات."
        }
      : {
          title: "Reviews",
          subtitle: "Verified customer reviews with moderation, barber ratings, service ratings, and admin replies."
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={reviews.map((review) => `${review.name}: ${review.text}`)} locale={locale} />;
}
