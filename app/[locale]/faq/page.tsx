import { ContentPage } from "@/components/sections/content-page";
import { faqs } from "@/lib/data";

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "الأسئلة الشائعة",
          subtitle: "إجابات حول الحجز، الخدمة المنزلية، العضويات، الدفع، الإلغاء، الخصوصية، وحجوزات الشركات."
        }
      : {
          title: "FAQ",
          subtitle: "Answers for booking, home service, memberships, payments, cancellations, privacy, and corporate grooming."
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={faqs.map(([question, answer]) => `${question} - ${answer}`)} locale={locale} />;
}
