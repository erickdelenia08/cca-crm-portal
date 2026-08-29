import { auth } from "@/auth";
import { NextResponse } from "next/server";

const rolePaths: Record<string, string> = {
  STUDENT: "/student",
  CONSULTANT: "/consultant",
  DOCUMENT_PROCESSOR: "/processor",
  ADMIN_MANAGEMENT: "/management",
};

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isHomeRoute = nextUrl.pathname === "/";
  const isLoginRoute = nextUrl.pathname === "/login";

  const allowedPath = role ? rolePaths[role] : undefined;

  const isDashboardRoute = Object.values(rolePaths).some(
    (path) =>
      nextUrl.pathname === path ||
      nextUrl.pathname.startsWith(`${path}/`)
  );

  // ==========================================
  // 1. User sudah login
  // ==========================================
  if (isLoggedIn) {
    // Kalau buka "/" → langsung ke dashboard sesuai role
    if (isHomeRoute) {
      if (allowedPath) {
        return NextResponse.redirect(
          new URL(allowedPath, nextUrl)
        );
      }

      return NextResponse.redirect(
        new URL("/login", nextUrl)
      );
    }

    // Kalau buka "/login" → langsung ke dashboard
    if (isLoginRoute) {
      if (allowedPath) {
        return NextResponse.redirect(
          new URL(allowedPath, nextUrl)
        );
      }

      return NextResponse.redirect(
        new URL("/login", nextUrl)
      );
    }

    // Kalau role tidak valid
    if (!allowedPath) {
      return NextResponse.redirect(
        new URL("/login", nextUrl)
      );
    }

    // ==========================================
    // RBAC
    // ==========================================
    if (isDashboardRoute) {
      const isAllowed =
        nextUrl.pathname === allowedPath ||
        nextUrl.pathname.startsWith(`${allowedPath}/`);

      if (!isAllowed) {
        return NextResponse.redirect(
          new URL(allowedPath, nextUrl)
        );
      }
    }

    return NextResponse.next();
  }

  // ==========================================
  // 2. User belum login
  // ==========================================

  // Dashboard → login
  if (isDashboardRoute) {
    return NextResponse.redirect(
      new URL("/login", nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};