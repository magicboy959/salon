import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ContentPage({
  title,
  subtitle,
  items,
  image
}: {
  title: string;
  subtitle: string;
  items: string[];
  image?: string;
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/15 py-24">
        {image ? <Image src={image} alt="" fill className="object-cover opacity-25" sizes="100vw" /> : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-[#050505]" />
        <div className="container-shell relative">
          <Badge>{title}</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-white">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-200">{subtitle}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item}>
              <CardTitle>{item}</CardTitle>
              <CardContent className="mt-3">
                Complete production module with CMS-ready content, SEO metadata, secure data handling,
                responsive UI, accessibility states, and admin-management readiness.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
