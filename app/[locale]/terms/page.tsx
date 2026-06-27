import { PolicyPage } from "@/components/sections/policy-page";

const copy = {
  en: {
    title: "Terms and Conditions",
    subtitle: "Terms for bookings, salon services, massage, payments, cancellations, and website use.",
    effectiveDate: "Effective date: June 27, 2026",
    sections: [
      {
        title: "Bookings and Appointments",
        body: [
          "Appointments are subject to availability and are confirmed only after the salon accepts the requested date, time, service, and staff availability.",
          "Customers must provide accurate name, phone number, date, time, location, and service details. Incorrect or incomplete details may delay or cancel the booking."
        ]
      },
      {
        title: "Services and Pricing",
        body: [
          "Service prices are shown in AED and may vary for long hair, additional products, special requests, or extended service time.",
          "Massage is offered at AED 200 per hour. Manicure is AED 129 and Pedicure is AED 159. Final pricing is confirmed before service begins."
        ]
      },
      {
        title: "Home, Hotel, and Massage Services",
        body: [
          "For home or hotel services, customers must provide a complete address, room number if applicable, access instructions, parking details, and a reachable phone number.",
          "Massage customers may request a male or female masseuse. Availability depends on staff scheduling and confirmation by the salon."
        ]
      },
      {
        title: "Payments",
        body: [
          "Payments may be collected by cash, card, online payment, or another method confirmed by the salon.",
          "The salon may request advance payment or a deposit for selected services, large bookings, home service, hotel service, or no-show history."
        ]
      },
      {
        title: "Cancellations and No-Shows",
        body: [
          "Customers should cancel or reschedule as early as possible. Late cancellation, no-show, or unreachable customers may lose priority for future bookings.",
          "If staff arrives for a home or hotel booking and the customer is unavailable, a visit charge or cancellation fee may apply."
        ]
      },
      {
        title: "Customer Conduct",
        body: [
          "Customers must treat staff respectfully and follow salon safety, hygiene, and professional conduct standards.",
          "The salon may refuse or stop service if behavior is abusive, unsafe, inappropriate, or violates UAE law or salon policy."
        ]
      },
      {
        title: "Website Use",
        body: [
          "Website content, images, prices, and availability may be updated at any time.",
          "Submitting a WhatsApp or email request does not guarantee the appointment until the salon confirms it."
        ]
      },
      {
        title: "Contact",
        body: [
          "For questions about these terms, contact the salon by WhatsApp, phone, or email using the details shown on the website."
        ]
      }
    ]
  },
  ar: {
    title: "الشروط والأحكام",
    subtitle: "شروط الحجوزات وخدمات الصالون والمساج والدفع والإلغاء واستخدام الموقع.",
    effectiveDate: "تاريخ السريان: 27 يونيو 2026",
    sections: [
      {
        title: "الحجوزات والمواعيد",
        body: [
          "تخضع المواعيد للتوفر ولا يتم تأكيدها إلا بعد موافقة الصالون على التاريخ والوقت والخدمة وتوفر الموظف.",
          "يجب على العميل تقديم الاسم ورقم الهاتف والتاريخ والوقت والموقع وتفاصيل الخدمة بشكل صحيح. قد تؤدي التفاصيل غير الكاملة أو غير الصحيحة إلى تأخير أو إلغاء الحجز."
        ]
      },
      {
        title: "الخدمات والأسعار",
        body: [
          "تظهر الأسعار بالدرهم الإماراتي وقد تختلف حسب طول الشعر أو المنتجات الإضافية أو الطلبات الخاصة أو الوقت الإضافي.",
          "خدمة المساج بسعر 200 درهم للساعة. المانيكير 129 درهم والباديكير 159 درهم. يتم تأكيد السعر النهائي قبل بدء الخدمة."
        ]
      },
      {
        title: "خدمات المنزل والفندق والمساج",
        body: [
          "للخدمات المنزلية أو الفندقية يجب تقديم العنوان الكامل ورقم الغرفة عند الحاجة وتعليمات الدخول ومواقف السيارات ورقم هاتف متاح.",
          "يمكن لعميل المساج طلب معالج رجل أو معالجة امرأة، ويعتمد ذلك على توفر الموظفين وتأكيد الصالون."
        ]
      },
      {
        title: "الدفع",
        body: [
          "يمكن تحصيل الدفع نقدا أو بالبطاقة أو عبر الدفع الإلكتروني أو بأي طريقة يؤكدها الصالون.",
          "قد يطلب الصالون دفعة مقدمة أو عربون لبعض الخدمات أو الحجوزات الكبيرة أو الخدمات المنزلية أو الفندقية أو في حالات عدم الحضور السابقة."
        ]
      },
      {
        title: "الإلغاء وعدم الحضور",
        body: [
          "يجب على العميل الإلغاء أو إعادة الجدولة في أقرب وقت ممكن. قد يؤدي الإلغاء المتأخر أو عدم الحضور أو عدم الرد إلى فقدان أولوية الحجوزات المستقبلية.",
          "إذا وصل الموظف إلى حجز منزلي أو فندقي ولم يكن العميل متاحا، فقد يتم تطبيق رسوم زيارة أو رسوم إلغاء."
        ]
      },
      {
        title: "سلوك العميل",
        body: [
          "يجب على العملاء التعامل مع الموظفين باحترام واتباع معايير السلامة والنظافة والسلوك المهني في الصالون.",
          "يحق للصالون رفض أو إيقاف الخدمة إذا كان السلوك مسيئا أو غير آمن أو غير لائق أو مخالفا لقوانين دولة الإمارات أو سياسة الصالون."
        ]
      },
      {
        title: "استخدام الموقع",
        body: [
          "يمكن تحديث محتوى الموقع والصور والأسعار والتوفر في أي وقت.",
          "إرسال طلب عبر واتساب أو البريد الإلكتروني لا يضمن الموعد حتى يؤكده الصالون."
        ]
      },
      {
        title: "التواصل",
        body: ["لأي أسئلة حول هذه الشروط، تواصل مع الصالون عبر واتساب أو الهاتف أو البريد الإلكتروني الموضح في الموقع."]
      }
    ]
  }
} as const;

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = locale === "ar" ? copy.ar : copy.en;
  return <PolicyPage {...content} />;
}
