import { ContentPage } from "@/components/sections/content-page";
import { faqs } from "@/lib/data";

export default function FaqPage() {
  return (
    <ContentPage
      title="FAQ"
      subtitle="Answers for booking, home service, memberships, payments, cancellations, privacy, and corporate grooming."
      items={faqs.map(([question, answer]) => `${question} - ${answer}`)}
    />
  );
}
