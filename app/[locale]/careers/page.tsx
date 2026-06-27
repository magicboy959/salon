import { ContentPage } from "@/components/sections/content-page";

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "الوظائف",
          subtitle: "نستقبل طلبات الحلاقين المحترفين وموظفي الاستقبال ومديري الفروع ومتخصصي الخدمة المنزلية وفريق الدعم.",
          items: ["حلاق محترف", "حلاق خدمة منزلية", "موظف استقبال", "مدير فرع", "مسؤول مخزون", "تنفيذي تسويق"]
        }
      : {
          title: "Careers",
          subtitle: "Recruit master barbers, receptionists, branch managers, home-service specialists, and support staff.",
          items: ["Master Barber", "Home Service Barber", "Receptionist", "Branch Manager", "Inventory Lead", "Marketing Executive"]
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={copy.items} locale={locale} />;
}
