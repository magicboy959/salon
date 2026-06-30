import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { publicNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "@/components/layout/mobile-menu";

export async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations("nav");
  const navItems = publicNav.map((item) => ({ href: item.href, label: t(item.key) }));

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-white/88 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-md border border-gold/35 bg-white">
            <Image src="/logo.jpeg" alt={siteConfig.shortName} fill priority className="object-contain p-1" sizes="48px" />
          </span>
          <span className="max-w-48 text-sm font-bold uppercase tracking-[0.18em] text-foreground">
            {siteConfig.shortName}
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-muted lg:flex">
          {navItems.slice(0, 8).map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileMenu locale={locale} items={navItems} bookLabel={t("book")} loginLabel={t("login")} registerLabel={t("register")} />
      </div>
    </header>
  );
}
