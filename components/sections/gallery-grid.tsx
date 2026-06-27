import Image from "next/image";
import { Play } from "lucide-react";

type GalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  poster?: string;
};

export function GalleryGrid({ items, limit }: { items: readonly GalleryItem[]; limit?: number }) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleItems.map((item, index) => (
        <figure
          key={item.src}
          className={index === 0 ? "group relative overflow-hidden rounded-lg border border-gold/20 bg-white shadow-sm sm:col-span-2 lg:col-span-2" : "group relative overflow-hidden rounded-lg border border-gold/20 bg-white shadow-sm"}
        >
          <div className={index === 0 ? "relative aspect-[16/10]" : "relative aspect-[4/3]"}>
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
              />
            ) : (
              <>
                <video
                  className="h-full w-full object-cover"
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster={item.poster}
                  aria-label={item.alt}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 p-2 text-foreground shadow-sm">
                  <Play className="h-4 w-4 fill-current" />
                </div>
              </>
            )}
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-semibold text-white">
            {item.title}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
