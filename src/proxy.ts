import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      if (!pathname.startsWith("/admin") && role === "Admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      if (pathname.startsWith("/admin") && role !== "Admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (isPublic) {
        if (role === "Admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
