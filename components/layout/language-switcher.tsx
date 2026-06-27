"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const target = locale === "ar" ? "en" : "ar";
  const path = pathname.replace(/^\/(en|ar)/, `/${target}`);
  return (
    <Button asChild variant="outline" size="sm" aria-label="Switch language">
      <Link href={path}>
        <Languages className="h-4 w-4" />
        {target.toUpperCase()}
      </Link>
    </Button>
  );
}
