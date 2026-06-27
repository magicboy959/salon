import { gallery } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { GalleryGrid } from "@/components/sections/gallery-grid";

export default function GalleryPage() {
  return (
    <>
      <section className="border-b border-gold/15 py-20">
        <div className="container-shell">
          <Badge>Gallery</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">Gallery</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Real photos and video from Alshanab Alaswad Gents Salon in Dubai Satwa.
          </p>
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
