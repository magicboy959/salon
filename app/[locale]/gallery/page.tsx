import { ContentPage } from "@/components/sections/content-page";

export default function GalleryPage() {
  return (
    <ContentPage
      title="Gallery"
      subtitle="CMS-managed image gallery with SEO-ready alt text, categories, UploadThing storage, and responsive optimization."
      items={["Haircuts", "Fades", "Beards", "VIP Room", "Wedding Grooming", "Home Service"]}
      image="https://images.unsplash.com/photo-1622286346003-c5c7e63b1088?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
