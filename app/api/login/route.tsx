import { customInitApp } from "@/app/lib/firebase-admin-config";
import { auth } from "firebase-admin";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

customInitApp();

export async function POST() {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.split("Bearer ")[1];
    const decodedToken = await auth().verifyIdToken(token);

    if (decodedToken) {
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
      const sessionCookie = await auth().createSessionCookie(token, { expiresIn });
      const options = {
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true
      };

      // save cookie
      cookies().set(options);
    }
  }

  return NextResponse.json({}, {status: 200})
}

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || null;

  if (!session) {
    return NextResponse.json({ isSignedIn: false }, { status: 401 })
  }

  // use firebase admin to verify cookie
  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isSignedIn: false }, { status: 401 })
  }

  return NextResponse.json({ isSignedIn: true }, { status: 200 })
}