import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("nav");
  return (
    <footer className="border-t border-gold/15 bg-white/75 py-12">
      <div className="container-shell grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">{siteConfig.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-muted">
          {footerNav.map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="hover:text-gold">
              {t(item.key)}
            </Link>
          ))}
        </div>
        <div className="text-sm leading-7 text-muted">
          <p>{siteConfig.address}</p>
          <p>{siteConfig.phone}</p>
          <p>{siteConfig.email}</p>
        </div>
      </div>
    </footer>
  );
}
