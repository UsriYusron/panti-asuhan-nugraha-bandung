import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = "panti-asuhan-nugraha-secret-key-change-in-production"; // Should be in env
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  return await verifyToken(sessionCookie);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await verifyToken(session);
  if (!parsed) return;

  const res = new Response();
  res.headers.append(
    "Set-Cookie",
    `session=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`
  );
  return res;
}
