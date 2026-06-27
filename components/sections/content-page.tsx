import Image from "next/image";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { whatsappBookingUrl } from "@/services/notifications";

type ContentItem =
  | string
  | {
      name: string;
      category: string;
      duration: number;
      priceLabel?: string;
      price: number;
      detail: string;
      image?: string;
    };

export function ContentPage({
  title,
  subtitle,
  items,
  image,
  locale = "en"
}: {
  title: string;
  subtitle: string;
  items: ContentItem[];
  image?: string;
  locale?: string;
}) {
  const copy =
    locale === "ar"
      ? {
          map: "افتح الموقع على الخريطة",
          booking: "احجز مباشرة عبر واتساب للحصول على أسرع تأكيد.",
          fallback: "تواصل مع الصالون لمعرفة التفاصيل والتوفر.",
          minutes: "دقيقة",
          whatsapp: "احجز عبر واتساب",
          message: "أرغب في حجز"
        }
      : {
          map: "Open location map",
          booking: "Book directly on WhatsApp for the fastest confirmation.",
          fallback: "Contact the salon for details and availability.",
          minutes: "mins",
          whatsapp: "Book on WhatsApp",
          message: "I want to book"
        };

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/15 py-24">
        {image ? <Image src={image} alt="" fill className="object-cover opacity-25" sizes="100vw" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/82 to-[#fffaf0]/65" />
        <div className="container-shell relative">
          <Badge>{title}</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{subtitle}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell mb-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <MapPin className="mb-4 h-6 w-6 text-gold" />
            <CardTitle>{siteConfig.address}</CardTitle>
            <CardContent className="mt-3">
              <a href={siteConfig.mapUrl} target="_blank" rel="noreferrer" className="text-gold hover:text-[#8c6818]">
                {copy.map}
              </a>
            </CardContent>
          </Card>
          <Card>
            <MessageCircle className="mb-4 h-6 w-6 text-gold" />
            <CardTitle>{siteConfig.phone}</CardTitle>
            <CardContent className="mt-3">{copy.booking}</CardContent>
          </Card>
        </div>
        <div className="container-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={typeof item === "string" ? item : item.name}
              className={typeof item === "string" ? "flex flex-col" : "flex flex-col overflow-hidden p-0"}
            >
              {typeof item === "string" ? (
                <>
                  <CardTitle>{item}</CardTitle>
                  <CardContent className="mt-3">{copy.fallback}</CardContent>
                </>
              ) : (
                <>
                  {item.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-gold/15">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge>{item.category}</Badge>
                      <span className="inline-flex items-center gap-1 text-sm text-muted">
                        <Clock className="h-4 w-4" />
                        {item.duration} {copy.minutes}
                      </span>
                    </div>
                    <CardTitle>{item.name}</CardTitle>
                    <CardContent className="mt-3 flex flex-1 flex-col">
                      <p className="leading-6">{item.detail}</p>
                      <p className="mt-5 text-2xl font-bold text-gold">{item.priceLabel ?? `AED ${item.price}`}</p>
                    <Button asChild className="mt-5 w-full">
                        <a href={whatsappBookingUrl(`${copy.message} ${item.name}.`)} target="_blank" rel="noreferrer">
                          <MessageCircle className="h-4 w-4" />
                          {copy.whatsapp}
                        </a>
                      </Button>
                    </CardContent>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
