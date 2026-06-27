import { ContentPage } from "@/components/sections/content-page";
import { blogPosts } from "@/lib/data";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy =
    locale === "ar"
      ? {
          title: "المدونة",
          subtitle: "مقالات عناية رجالية جاهزة للسيو مع بيانات محلية وروابط منظمة وإدارة محتوى."
        }
      : {
          title: "Blog",
          subtitle: "SEO-ready grooming articles with localized metadata, canonical URLs, structured data, and CMS controls."
        };

  return <ContentPage title={copy.title} subtitle={copy.subtitle} items={blogPosts.map((post) => post.title)} locale={locale} />;
}
