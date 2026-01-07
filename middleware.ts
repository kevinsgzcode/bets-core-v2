import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  //public routes
  const isAuthRout = pathname.startsWith("/login");
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  //if user is not authenticated
  if (!session) {
    if (isAuthRout || isApiAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  //if user is authenticated
  if (session) {
    if (isAuthRout) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - static files
     * - next internals
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
