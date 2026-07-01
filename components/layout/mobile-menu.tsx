"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
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
  const isRtl = locale === "ar";

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
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/32 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
          aria-label={`Close ${menuLabel}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute top-0 h-full w-[min(86vw,360px)] overflow-y-auto border-gold/15 bg-white shadow-2xl transition-transform duration-300 ease-out",
            isRtl ? "left-0 border-r" : "right-0 border-l",
            open ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-gold/15 px-5">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">{menuLabel}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Close ${menuLabel}`}
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="grid gap-1 p-4 text-sm text-foreground">
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
        </aside>
      </div>
    </>
  );
}
