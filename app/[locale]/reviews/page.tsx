import { ContentPage } from "@/components/sections/content-page";
import { reviews } from "@/lib/data";

export default function ReviewsPage() {
  return (
    <ContentPage
      title="Reviews"
      subtitle="Verified customer reviews with moderation, barber ratings, service ratings, and admin replies."
      items={reviews.map((review) => `${review.name}: ${review.text}`)}
    />
  );
}
