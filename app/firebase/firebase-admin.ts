import "server-only";

import { cookies } from "next/headers";
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  credential: applicationDefault()
  // credential: cert({
  //   projectId: process.env.NEXT_PUBLIC_PROJECTID,
  //   clientEmail: process.env.NEXT_PUBLIC_CLIENTEMAIL,
  //   privateKey: process.env.NEXT_PUBLIC_PRIVATEKEY?.replace(/\\n/g, '\n')
  // })
}

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);

export async function isUserAuthenticated(session: string | undefined = undefined) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) return null;

  try {
    const isRevoked = !(await auth.verifySessionCookie(session, true));

    // if the session hasn't been revoked, we return the current user data
    if (!isRevoked) {
      const decodedIdToken = await auth.verifySessionCookie(session!);
      const currentUser = await auth.getUser(decodedIdToken.uid);
      return currentUser;
    }

  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
  return await auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}