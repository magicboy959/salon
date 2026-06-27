import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MassageOrderForm } from "@/components/forms/massage-order-form";

const massageCopy = {
  en: {
    badge: "Massage",
    title: "Massage Booking",
    subtitle:
      "Book massage service for AED 200 per hour. Select male or female customer, male or female masseuse, duration, location, and preferred appointment time.",
    heroAlt: "Professional massage therapists preparing a spa room",
    form: {
      messageTitle: "Massage booking request",
      emailSubject: "Massage booking request",
      labels: {
        name: "Full name",
        phone: "Phone",
        email: "Email",
        date: "Date",
        time: "Time",
        duration: "Duration",
        location: "Location",
        customer: "Customer",
        masseuse: "Masseuse",
        address: "Address",
        notes: "Notes"
      },
      placeholders: {
        name: "Your name",
        phone: "+971...",
        email: "name@example.com",
        address: "Required for home or hotel service",
        notes: "Preferred pressure, room number, parking notes, or special requests..."
      },
      options: {
        customerTypes: ["Male customer", "Female customer"],
        masseuses: ["Male masseuse", "Female masseuse"],
        locations: ["Salon", "Home service", "Hotel"],
        durations: ["1 hour - AED 200", "2 hours - AED 400", "3 hours - AED 600"]
      },
      messageLabels: {
        name: "Name",
        phone: "Phone",
        email: "Email",
        customer: "Customer",
        masseuse: "Preferred masseuse",
        location: "Location",
        date: "Date",
        time: "Time",
        duration: "Duration",
        total: "Estimated total",
        address: "Address",
        notes: "Notes",
        hourUnit: "hour(s)"
      },
      actions: {
        whatsapp: "Send on WhatsApp",
        email: "Send by Email"
      },
      details: {
        title: "Massage Details",
        lines: [
          "AED 200 per hour.",
          "Available for men and women.",
          "Choose a male or female masseuse before sending the request.",
          "Requests are forwarded through WhatsApp or email for confirmation."
        ]
      }
    }
  },
  ar: {
    badge: "المساج",
    title: "حجز المساج",
    subtitle:
      "احجز خدمة المساج بسعر 200 درهم للساعة. اختر العميل رجل أو امرأة، والمعالج رجل أو امرأة، والمدة، والموقع، ووقت الموعد المناسب.",
    heroAlt: "معالجتا مساج محترفتان تجهزان غرفة سبا",
    form: {
      messageTitle: "طلب حجز مساج",
      emailSubject: "طلب حجز مساج",
      labels: {
        name: "الاسم الكامل",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        date: "التاريخ",
        time: "الوقت",
        duration: "المدة",
        location: "الموقع",
        customer: "العميل",
        masseuse: "المعالج",
        address: "العنوان",
        notes: "ملاحظات"
      },
      placeholders: {
        name: "اسمك",
        phone: "+971...",
        email: "name@example.com",
        address: "مطلوب لخدمة المنزل أو الفندق",
        notes: "درجة الضغط، رقم الغرفة، ملاحظات المواقف، أو أي طلبات خاصة..."
      },
      options: {
        customerTypes: ["عميل رجل", "عميلة امرأة"],
        masseuses: ["معالج رجل", "معالجة امرأة"],
        locations: ["الصالون", "خدمة منزلية", "فندق"],
        durations: ["ساعة واحدة - 200 درهم", "ساعتان - 400 درهم", "3 ساعات - 600 درهم"]
      },
      messageLabels: {
        name: "الاسم",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        customer: "العميل",
        masseuse: "المعالج المطلوب",
        location: "الموقع",
        date: "التاريخ",
        time: "الوقت",
        duration: "المدة",
        total: "الإجمالي التقريبي",
        address: "العنوان",
        notes: "ملاحظات",
        hourUnit: "ساعة"
      },
      actions: {
        whatsapp: "إرسال عبر واتساب",
        email: "إرسال عبر البريد"
      },
      details: {
        title: "تفاصيل المساج",
        lines: [
          "200 درهم للساعة.",
          "الخدمة متاحة للرجال والنساء.",
          "يمكن اختيار معالج رجل أو معالجة امرأة قبل إرسال الطلب.",
          "يتم إرسال الطلب عبر واتساب أو البريد الإلكتروني للتأكيد."
        ]
      }
    }
  }
} as const;

export default async function MassagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = locale === "ar" ? massageCopy.ar : massageCopy.en;

  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden border-b border-gold/15">
        <Image
          src="/massage-hero.png"
          alt={copy.heroAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/72 to-white/10 rtl:bg-gradient-to-l" />
        <div className="container-shell relative flex min-h-[520px] items-center py-20">
          <div>
            <Badge>{copy.badge}</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">{copy.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{copy.subtitle}</p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell">
          <MassageOrderForm copy={copy.form} />
        </div>
      </section>
    </>
  );
}
