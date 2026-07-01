"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

export function MobileMenu({
  locale,
  items,
  bookLabel,
  loginLabel,
  registerLabel,
  logoutLabel,
  portalLabel,
  menuLabel,
  isAuthenticated
}: {
  locale: string;
  items: NavItem[];
  bookLabel: string;
  loginLabel: string;
  registerLabel: string;
  logoutLabel: string;
  portalLabel: string;
  menuLabel: string;
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function logout() {
    setOpen(false);
    void signOut({ callbackUrl: `/${locale}/login` });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <LanguageSwitcher locale={locale} />
        {isAuthenticated ? (
          <>
            <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
              <Link href={`/${locale}/portal`}>{portalLabel}</Link>
            </Button>
            <Button type="button" variant="dark" size="sm" className="hidden text-white lg:inline-flex" onClick={logout}>
              <LogOut className="h-4 w-4" />
              {logoutLabel}
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
              <Link href={`/${locale}/login`}>
                <LogIn className="h-4 w-4" />
                {loginLabel}
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden text-white lg:inline-flex">
              <Link href={`/${locale}/register`}>
                <UserPlus className="h-4 w-4" />
                {registerLabel}
              </Link>
            </Button>
          </>
        )}
        <Button asChild size="sm">
          <Link href={`/${locale}/book`}>{bookLabel}</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label={open ? `Close ${menuLabel}` : `Open ${menuLabel}`}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <div
        id="mobile-navigation"
        className={cn(
          "absolute left-0 right-0 top-20 z-40 overflow-hidden border-b border-gold/15 bg-white/98 shadow-xl transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="container-shell py-4">
            <div className="mb-3 flex items-center justify-between border-b border-gold/15 pb-3">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">{menuLabel}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-muted"
                onClick={() => setOpen(false)}
              >
                <ChevronDown className="h-4 w-4" />
                {menuLabel}
              </button>
            </div>
            <nav className="grid gap-1 text-sm text-foreground">
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
              {isAuthenticated ? (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gold/15 pt-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/portal`} onClick={() => setOpen(false)}>
                      {portalLabel}
                    </Link>
                  </Button>
                  <Button type="button" variant="dark" size="sm" className="text-white" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    {logoutLabel}
                  </Button>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gold/15 pt-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/login`} onClick={() => setOpen(false)}>
                      <LogIn className="h-4 w-4" />
                      {loginLabel}
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="text-white">
                    <Link href={`/${locale}/register`} onClick={() => setOpen(false)}>
                      <UserPlus className="h-4 w-4" />
                      {registerLabel}
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
