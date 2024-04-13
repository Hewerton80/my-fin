import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";
import prisma from "./lib/prisma";

export const config = {
  // matcher: "/student/:path*",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|images|favicon.ico).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log({ pathname });

  const isPrivateEndpoints =
    pathname.startsWith("/api") && !pathname.includes("/auth");
  if (isPrivateEndpoints) {
    const { error } = await verifyJWT(request);
    if (error) {
      return NextResponse.json({ message: error }, { status: 401 });
    }
  }

  return NextResponse.next();
}
