import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { listPublicGallery } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  await connection();
  const { locale } = await params;
  const gallery = await listPublicGallery();
  const copy =
    locale === "ar"
      ? {
          badge: "المعرض",
          title: "المعرض",
          subtitle: "صور وفيديوهات حقيقية من صالون الشنب الاسود للرجال في دبي السطوة."
        }
      : {
          badge: "Gallery",
          title: "Gallery",
          subtitle: "Real photos and video from Alshanab Al Aswad Gents Salon in Dubai Satwa."
        };

  return (
    <>
      <section className="border-b border-gold/15 py-20">
        <div className="container-shell">
          <Badge>{copy.badge}</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{copy.subtitle}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell">
          <GalleryGrid items={gallery} />
        </div>
      </section>
    </>
  );
}
