import { PolicyPage } from "@/components/sections/policy-page";

const copy = {
  en: {
    title: "Refund Policy",
    subtitle: "Refund and cancellation rules for salon, massage, home, hotel, package, and prepaid services.",
    effectiveDate: "Effective date: June 27, 2026",
    sections: [
      {
        title: "General Rule",
        body: [
          "Refunds are reviewed case by case. Approved refunds are returned through the original payment method where possible.",
          "Cash payments may be refunded in cash or converted to salon credit at the salon's discretion."
        ]
      },
      {
        title: "Before the Appointment",
        body: [
          "If you cancel before staff time, products, or travel are reserved, prepaid amounts may be refunded or moved to a new appointment.",
          "Deposits for special bookings, large bookings, home service, hotel service, or selected staff may be non-refundable if cancellation is late."
        ]
      },
      {
        title: "Late Cancellation and No-Show",
        body: [
          "Late cancellations and no-shows may not qualify for a refund.",
          "If staff travels to a home or hotel booking and the customer is unavailable, travel and visit costs may be deducted from any prepaid amount."
        ]
      },
      {
        title: "After Service Starts",
        body: [
          "Once a service has started or has been completed, refunds are generally not available.",
          "If there is a service concern, tell the salon immediately so the team can inspect the result and offer a reasonable correction where appropriate."
        ]
      },
      {
        title: "Packages, Memberships, and Offers",
        body: [
          "Promotional offers, discounted packages, memberships, and gift cards may be non-refundable unless otherwise confirmed in writing.",
          "Unused credit may be transferred, extended, or converted only if approved by the salon."
        ]
      },
      {
        title: "Processing Time",
        body: [
          "Approved card or online refunds may take several business days depending on the payment provider and bank.",
          "The salon is not responsible for bank delays after the refund has been submitted."
        ]
      },
      {
        title: "How to Request a Refund",
        body: [
          "To request a refund, contact the salon with your name, phone number, appointment date, service, amount paid, and reason for the request.",
          "Refund requests should be made as soon as possible after the issue occurs."
        ]
      }
    ]
  },
  ar: {
    title: "سياسة الاسترداد",
    subtitle: "قواعد الاسترداد والإلغاء لخدمات الصالون والمساج والمنزل والفندق والباقات والخدمات المدفوعة مسبقا.",
    effectiveDate: "تاريخ السريان: 27 يونيو 2026",
    sections: [
      {
        title: "القاعدة العامة",
        body: [
          "تتم مراجعة طلبات الاسترداد حسب كل حالة. يتم إعادة المبالغ المعتمدة إلى طريقة الدفع الأصلية متى أمكن.",
          "قد يتم استرداد المدفوعات النقدية نقدا أو تحويلها إلى رصيد في الصالون حسب تقدير الصالون."
        ]
      },
      {
        title: "قبل الموعد",
        body: [
          "إذا تم الإلغاء قبل حجز وقت الموظف أو المنتجات أو الانتقال، فقد يتم استرداد المبلغ المدفوع مسبقا أو نقله إلى موعد جديد.",
          "قد تكون العربونات للحجوزات الخاصة أو الكبيرة أو الخدمة المنزلية أو الفندقية أو اختيار موظف معين غير قابلة للاسترداد عند الإلغاء المتأخر."
        ]
      },
      {
        title: "الإلغاء المتأخر وعدم الحضور",
        body: [
          "قد لا تكون الإلغاءات المتأخرة أو عدم الحضور مؤهلة للاسترداد.",
          "إذا انتقل الموظف إلى حجز منزلي أو فندقي ولم يكن العميل متاحا، فقد يتم خصم تكاليف الانتقال والزيارة من أي مبلغ مدفوع مسبقا."
        ]
      },
      {
        title: "بعد بدء الخدمة",
        body: [
          "بعد بدء الخدمة أو إكمالها، لا تتوفر المبالغ المستردة عادة.",
          "إذا كانت هناك ملاحظة على الخدمة، يجب إبلاغ الصالون فورا حتى يتمكن الفريق من فحص النتيجة وتقديم تصحيح مناسب عند الإمكان."
        ]
      },
      {
        title: "الباقات والعضويات والعروض",
        body: [
          "قد تكون العروض الترويجية والباقات المخفضة والعضويات وبطاقات الهدايا غير قابلة للاسترداد ما لم يتم تأكيد غير ذلك كتابيا.",
          "يمكن نقل الرصيد غير المستخدم أو تمديده أو تحويله فقط بموافقة الصالون."
        ]
      },
      {
        title: "مدة المعالجة",
        body: [
          "قد تستغرق المبالغ المستردة المعتمدة عبر البطاقة أو الدفع الإلكتروني عدة أيام عمل حسب مزود الدفع والبنك.",
          "الصالون غير مسؤول عن تأخير البنك بعد إرسال طلب الاسترداد."
        ]
      },
      {
        title: "طريقة طلب الاسترداد",
        body: [
          "لطلب الاسترداد، تواصل مع الصالون واذكر الاسم ورقم الهاتف وتاريخ الموعد والخدمة والمبلغ المدفوع وسبب الطلب.",
          "يجب تقديم طلبات الاسترداد في أقرب وقت ممكن بعد حدوث المشكلة."
        ]
      }
    ]
  }
} as const;

export default async function RefundPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = locale === "ar" ? copy.ar : copy.en;
  return <PolicyPage {...content} />;
}
