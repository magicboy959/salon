import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CalendarCheck, MapPin, MessageCircle, Star } from "lucide-react";
import {
  barbers,
  blogPosts,
  gallery,
  memberships,
  offers,
  reviews,
  serviceHighlights,
  stats,
  whyChooseUs
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { googleMapsEmbedUrl } from "@/services/maps";
import { whatsappBookingUrl } from "@/services/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GalleryGrid } from "@/components/sections/gallery-grid";

export async function HomePage({ locale }: { locale: string }) {
  const t = await getTranslations("home");
  return (
    <>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury barber chair and grooming station"
          fill
          priority
          className="object-cover opacity-42"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 to-white/18" />
        <div className="container-shell relative flex min-h-[calc(100vh-80px)] items-center py-16">
          <div className="max-w-3xl">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-foreground md:text-7xl">{t("title")}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/${locale}/book`}>
                  <CalendarCheck className="h-5 w-5" />
                  {t("book")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={whatsappBookingUrl("I want to book a premium grooming appointment.")}>
                  <MessageCircle className="h-5 w-5" />
                  {t("whatsapp")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section title={t("featured")}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {serviceHighlights.map((item) => (
            <Card key={item.title}>
              <item.icon className="mb-5 h-8 w-8 text-gold" />
              <CardTitle>{item.title}</CardTitle>
              <CardContent className="mt-3">{item.text}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <section className="border-y border-gold/15 bg-white/65 py-10">
        <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-4xl font-bold text-gold">{item.value}</p>
              <p className="mt-2 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section title={t("why")}>
        <div className="grid gap-5 md:grid-cols-3">
          {whyChooseUs.map((item) => (
            <Card key={item.title}>
              <item.icon className="mb-5 h-8 w-8 text-gold" />
              <CardTitle>{item.title}</CardTitle>
              <CardContent className="mt-3">{item.text}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("barbers")}>
        <div className="grid gap-6 md:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.name} className="overflow-hidden p-0">
              <div className="relative aspect-[4/3]">
                <Image src={barber.image} alt={barber.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-6">
                <CardTitle>{barber.name}</CardTitle>
                <p className="mt-1 text-sm text-gold">{barber.title}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Star className="h-4 w-4 fill-gold text-gold" /> {barber.rating}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("gallery")}>
        <GalleryGrid items={gallery} limit={6} />
      </Section>

      <Section title={t("reviews")}>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.name}>
              <div className="mb-4 flex gap-1 text-gold">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold" />)}</div>
              <CardContent className="text-base leading-7">&ldquo;{review.text}&rdquo;</CardContent>
              <p className="mt-5 font-semibold text-foreground">{review.name}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("membership")}>
        <div className="grid gap-5 md:grid-cols-3">
          {memberships.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <Badge>{plan.name}</Badge>
                <CardTitle>{formatCurrency(plan.price, locale)} / month</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("offers")}>
        <div className="grid gap-5 md:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.title}>
              <CardTitle>{offer.title}</CardTitle>
              <CardContent className="mt-3">{offer.detail}</CardContent>
              <p className="mt-5 text-2xl font-bold text-gold">{formatCurrency(offer.price, locale)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="bg-gold py-12 text-white">
        <div className="container-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">{t("homeService")}</h2>
            <p className="mt-2 max-w-2xl">Address, GPS, Google Maps, date, time, barber, notes, payment, arrival status, tracking, and notifications.</p>
          </div>
          <Button asChild variant="dark">
            <Link href={`/${locale}/home-services`}>Book home service</Link>
          </Button>
        </div>
      </section>

      <Section title={t("blog")}>
        <div className="grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug}>
              <CardTitle>{post.title}</CardTitle>
              <CardContent className="mt-3">{post.excerpt}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("contact")}>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <MapPin className="mb-4 h-7 w-7 text-gold" />
            <CardTitle>{siteConfig.address}</CardTitle>
            <CardContent className="mt-3">
              {siteConfig.businessHours.map((line) => <p key={line}>{line}</p>)}
            </CardContent>
          </Card>
          <iframe
            title="Google Map"
            src={googleMapsEmbedUrl()}
            className="min-h-80 w-full rounded-lg border border-gold/20"
            loading="lazy"
          />
        </div>
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-16">
      <div className="container-shell">
        <h2 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}
