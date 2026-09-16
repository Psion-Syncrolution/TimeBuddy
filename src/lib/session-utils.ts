import { getSession } from '@/lib/auth';

/** Authentifizierter Kontext fuer API-Routes. */
export interface AuthContext {
  userId: string;
  email?: string | undefined;
}

/**
 * Prueft die Session und liefert den Auth-Kontext, oder null wenn nicht
 * authentifiziert.
 */
export async function requireAuth(): Promise<AuthContext | null> {
  const session = await getSession();
  if (!session.userId) return null;
  return { userId: session.userId, email: session.email };
}
