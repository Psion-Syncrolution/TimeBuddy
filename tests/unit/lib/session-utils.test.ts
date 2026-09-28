import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IronSession } from 'iron-session';
import type { SessionData } from '@/lib/auth';

// @/lib/auth moekken: getSession ist hier die einzige Abhaengigkeit —
// die echte Session-Logik (iron-session + next/headers) wird woanders getestet.
vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

import { requireAuth } from '@/lib/session-utils';
import { getSession } from '@/lib/auth';

const mockedGetSession = vi.mocked(getSession);

/** Legt den zurueckgegebenen Session-Wert des Mocks fest. */
function mockSession(data: Partial<SessionData>): void {
  // Der Mock muss den vollen IronSession-Typ erfuellen — nur die Datenfelder sind relevant.
  mockedGetSession.mockResolvedValue(data as unknown as IronSession<SessionData>);
}

describe('requireAuth', () => {
  beforeEach(() => {
    mockedGetSession.mockReset();
  });

  it('liefert null, wenn keine Session existiert', async () => {
    mockSession({});

    const context = await requireAuth();

    expect(context).toBeNull();
  });

  it('liefert null, wenn die Session kein userId enthaelt', async () => {
    mockSession({ email: 'user@test.local' });

    const context = await requireAuth();

    expect(context).toBeNull();
  });

  it('liefert den Auth-Kontext mit userId und email bei gueltiger Session', async () => {
    mockSession({ userId: 'user-123', email: 'user@test.local' });

    const context = await requireAuth();

    expect(context).toEqual({ userId: 'user-123', email: 'user@test.local' });
  });

  it('liefert den Auth-Kontext ohne email, wenn nur userId gesetzt ist', async () => {
    mockSession({ userId: 'user-456' });

    const context = await requireAuth();

    expect(context).toEqual({ userId: 'user-456', email: undefined });
  });
});
