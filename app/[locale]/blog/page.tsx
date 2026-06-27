import { ContentPage } from "@/components/sections/content-page";
import { blogPosts } from "@/lib/data";

export default function BlogPage() {
  return (
    <ContentPage
      title="Blog"
      subtitle="SEO-ready grooming articles with localized metadata, canonical URLs, structured data, and CMS controls."
      items={blogPosts.map((post) => post.title)}
    />
  );
}
