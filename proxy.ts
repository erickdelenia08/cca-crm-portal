import { auth } from "@/auth";
import { NextResponse } from "next/server";

const rolePaths: Record<string, string> = {
  CLIENT: "/client",
  CONSULTANT: "/consultant",
  TEACHER: "/teacher",
  PROCESSING_DEPARTMENT: "/processor",
  MANAGEMENT: "/management",
};

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isHomeRoute = pathname === "/";
  const isLoginRoute = pathname === "/login";

  const allowedPath = role ? rolePaths[role] : undefined;

  // ==========================================
  // BELUM LOGIN → semua halaman kecuali /login diarahkan ke /login
  // ==========================================
  if (!isLoggedIn) {
    if (isLoginRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // ==========================================
  // SUDAH LOGIN, tapi role tidak valid
  // ==========================================
  if (!allowedPath) {
    if (isLoginRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // "/" dan "/login" → portal sesuai role
  if (isHomeRoute || isLoginRoute) {
    return NextResponse.redirect(new URL(allowedPath, nextUrl));
  }

  // ==========================================
  // RBAC: tidak boleh masuk portal role lain
  // ==========================================
  const isOtherPortal = Object.values(rolePaths).some(
    (path) =>
      path !== allowedPath &&
      (pathname === path || pathname.startsWith(`${path}/`))
  );

  if (isOtherPortal) {
    return NextResponse.redirect(new URL(allowedPath, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Lewati api, file statis Next, dan semua file dengan ekstensi (png, svg, ico, dll.)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};