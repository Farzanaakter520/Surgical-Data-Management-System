import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionId = req.cookies.get("sessionId")?.value;
  console.log(sessionId)

  // Define public & protected routes
  const protectedRoutes = ["/dashboard"];
  const publicRoutes = ["/login", "/register"];

  // const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  // const isPublic = publicRoutes.includes(pathname);

  // // Redirect root
  if (pathname === "/") {
    return NextResponse.redirect(new URL(sessionId ? "/dashboard" : "/login", req.url));
  }

  // // Not logged in → block protected
  // if (isProtected && !sessionId) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // // Logged in → block public pages
  // if (isPublic && sessionId) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
