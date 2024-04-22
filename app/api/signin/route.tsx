import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/app/firebase/firebase-admin";

export async function POST(request: NextRequest) {

  const reqBody = await request.json() as { idToken: string };
  const idToken = reqBody.idToken;

  if (idToken) {
    return NextResponse.json({ "success": true, "data": "Token exists" });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const sessionCookie = await createSessionCookie(idToken, { expiresIn });

  cookies().set("__session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });

  return NextResponse.json({ "success": true, "data": "Signed in successfully." });
}