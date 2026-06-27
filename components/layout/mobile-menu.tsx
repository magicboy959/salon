"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

type NavItem = {
  href: string;
  label: string;
};

export function MobileMenu({
  locale,
  items,
  bookLabel
}: {
  locale: string;
  items: NavItem[];
  bookLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <LanguageSwitcher locale={locale} />
        <Button asChild size="sm">
          <Link href={`/${locale}/book`}>{bookLabel}</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {open ? (
        <div id="mobile-navigation" className="border-t border-gold/15 bg-white/96 shadow-sm lg:hidden">
          <nav className="container-shell grid gap-1 py-4 text-sm text-foreground">
            {items.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="rounded-md px-3 py-3 hover:bg-gold/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
