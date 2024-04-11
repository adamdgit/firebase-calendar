import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  
  const session = request.cookies.get("session");

  // return to login page if no session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const response = await fetch(`${request.nextUrl.origin}/api/login`, {
    headers: {
      Cookie: `session=${session?.value}`
    }
  });

  // return to login page if not authorized
  if (response.status !== 200) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next();
}

// protected routes
export const config = {
  matcher: ["/protected/:path*"],
};