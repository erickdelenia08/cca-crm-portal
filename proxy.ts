import { auth } from "@/auth";
import { NextResponse } from "next/server";

const rolePaths: Record<string, string> = {
  STUDENT: "/student",
  CONSULTANT: "/consultant",
  TEACHER: "/teacher",
  PROCESSING_DEPARTMENT: "/processor",
  MANAGEMENT: "/management",
};

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  console.log("========== PROXY ==========");
  console.log("PATH:", nextUrl.pathname);
  console.log("isLoggedIn:", isLoggedIn);
  console.log("role:", role);
  console.log("user:", req.auth?.user);
  console.log("===========================");

  const isHomeRoute = nextUrl.pathname === "/";
  const isLoginRoute = nextUrl.pathname === "/login";

  const allowedPath = role ? rolePaths[role] : undefined;

  const dashboardEntry = Object.values(rolePaths).find(
    (path) =>
      nextUrl.pathname === path ||
      nextUrl.pathname.startsWith(`${path}/`)
  );

  // ==========================================
  // USER SUDAH LOGIN
  // ==========================================
  if (isLoggedIn) {
    // Role tidak valid
    if (!allowedPath) {
      if (!isLoginRoute) {
        return NextResponse.redirect(
          new URL("/login", nextUrl)
        );
      }

      return NextResponse.next();
    }

    // "/" → dashboard sesuai role
    if (isHomeRoute) {
      return NextResponse.redirect(
        new URL(allowedPath, nextUrl)
      );
    }

    // "/login" → dashboard sesuai role
    if (isLoginRoute) {
      return NextResponse.redirect(
        new URL(allowedPath, nextUrl)
      );
    }

    // ==========================================
    // RBAC
    // ==========================================
    if (dashboardEntry) {
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
  // USER BELUM LOGIN
  // ==========================================

  // Semua dashboard → login
  if (dashboardEntry) {
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