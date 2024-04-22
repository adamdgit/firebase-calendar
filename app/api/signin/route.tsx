import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/app/firebase/firebase-admin";

export async function POST(request: NextRequest) {
  const reqBody = await request.json() as { idToken: string };
  const idToken = reqBody.idToken;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await createSessionCookie(idToken, { expiresIn });
    cookies().set("__session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
  } catch (error) {
    return NextResponse.json({ "success": false, "data": error });
  }

  return NextResponse.json({ "success": true, "data": "Signed in successfully." });
}