import { getIronSession, type IronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

/** Daten, die in der Session gespeichert werden. */
export interface SessionData {
  userId?: string;
  email?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  cookieName: 'timebuddy-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  },
};

/** Cookie-Optionen wie von iron-session erwartet (Auszug). */
type ResponseCookie = {
  name: string;
  value: string;
  domain?: string | undefined;
  path?: string | undefined;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean | undefined;
  expires?: Date | number | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  priority?: 'low' | 'medium' | 'high' | undefined;
};

/**
 * Das von iron-session erwartete CookieStore-Interface (in v8 nicht exportiert).
 * Strukturiell identisch mit der internen Definition in iron-session/dist.
 */
type IronCookieStore = {
  get: (name: string) => { name: string; value: string } | undefined;
  set: {
    (name: string, value: string, cookie?: Partial<ResponseCookie>): void;
    (options: ResponseCookie): void;
  };
};

/**
 * Liefert die aktuelle Session (typisiert).
 *
 * Hinweis: Next.js 16 liefert `ReadonlyRequestCookies`, iron-session erwartet
 * sein internes `CookieStore`-Interface. Runtime-kompatibel (beide bieten
 * `get(name)` und `set(name, value, options)`), daher gezielter Cast.
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore as unknown as IronCookieStore, sessionOptions);
}
