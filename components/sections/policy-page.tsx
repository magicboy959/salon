import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

type PolicySection = {
  title: string;
  body: readonly string[];
};

export function PolicyPage({
  title,
  subtitle,
  effectiveDate,
  sections
}: {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: readonly PolicySection[];
}) {
  return (
    <>
      <section className="border-b border-gold/15 py-20">
        <div className="container-shell">
          <Badge>{title}</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold text-foreground">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{subtitle}</p>
          <p className="mt-4 text-sm font-semibold text-gold">{effectiveDate}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell grid gap-5">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardTitle>{section.title}</CardTitle>
              <CardContent className="mt-4 space-y-3 text-base leading-7">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
