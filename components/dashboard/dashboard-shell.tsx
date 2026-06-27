import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function DashboardShell({ title, modules }: { title: string; modules: string[] }) {
  return (
    <section className="py-12">
      <div className="container-shell">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module, index) => (
            <Card key={module}>
              <p className="text-sm text-gold">Module {index + 1}</p>
              <CardTitle className="mt-2">{module}</CardTitle>
              <CardContent className="mt-3">
                Role-aware management surface with filters, tables, actions, audit events, notifications,
                and export-ready reporting.
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
