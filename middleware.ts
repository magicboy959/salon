import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "MANAGER"]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminMatch = pathname.match(/^\/(?:(en|ar)\/)?admin(?:\/|$)/);

  if (adminMatch) {
    const locale = adminMatch[1] ?? "en";
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    const token = await getToken({ req: request, secret });
    const roles = Array.isArray(token?.roles) ? token.roles : [];
    const isAdmin = roles.some((role) => typeof role === "string" && adminRoles.has(role));
    if (isAdmin) return intlMiddleware(request);

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"]
};
