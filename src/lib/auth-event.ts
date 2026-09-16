/**
 * Custom Event, das nach Login/Registrierung ausgelöst wird.
 * Die Navbar lauscht darauf und aktualisiert den Auth-Status —
 * so muss sie nicht bei jedem Pfadwechsel die Session-API abfragen.
 */
export const AUTH_CHANGED_EVENT = 'timebuddy:auth-changed';

/** Meldet eine geänderte Authentifizierung an alle Client-Komponenten. */
export function notifyAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
