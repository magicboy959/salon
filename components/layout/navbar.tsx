import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Menu, Scissors } from "lucide-react";
import { publicNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations("nav");
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-black/70 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md border border-gold/35 bg-gold/10">
            <Scissors className="h-5 w-5 text-gold" />
          </span>
          <span className="max-w-48 text-sm font-bold uppercase tracking-[0.18em] text-white">
            {siteConfig.shortName}
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-zinc-300 lg:flex">
          {publicNav.slice(0, 8).map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="hover:text-gold">
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Button asChild size="sm">
            <Link href={`/${locale}/book`}>{t("book")}</Link>
          </Button>
          <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
