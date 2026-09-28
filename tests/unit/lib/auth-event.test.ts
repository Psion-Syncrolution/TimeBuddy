import { describe, it, expect, afterEach, vi } from 'vitest';
import { AUTH_CHANGED_EVENT, notifyAuthChanged } from '@/lib/auth-event';

describe('auth-event', () => {
  afterEach(() => {
    // window-Stub aus dem Browser-Simulationstest rueckgaengig machen.
    delete (globalThis as Record<string, unknown>).window;
  });

  it('definiert den erwarteten Event-Namen', () => {
    expect(AUTH_CHANGED_EVENT).toBe('timebuddy:auth-changed');
  });

  it('ist ein No-op in der Node-Umgebung (ohne window)', () => {
    // In Vitest (node) existiert kein window — darf nicht werfen.
    expect(() => notifyAuthChanged()).not.toThrow();
  });

  it('dispatcht das Event im Browser (mit window)', () => {
    const dispatchEvent = vi.fn();
    (globalThis as Record<string, unknown>).window = { dispatchEvent };

    notifyAuthChanged();

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const event = dispatchEvent.mock.calls[0][0] as Event;
    expect(event.type).toBe(AUTH_CHANGED_EVENT);
  });
});
