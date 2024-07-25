import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "./modules/auth/service";

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
    pathname.startsWith("/api") &&
    !pathname.includes("/auth") &&
    !pathname.includes("/cron");

  console.log({ isPrivateEndpoints });
  if (isPrivateEndpoints) {
    const { error } = await AuthService.verifyJWT(request);
    if (error) {
      return NextResponse.json({ message: error }, { status: 401 });
    }
  }

  return NextResponse.next();
}
