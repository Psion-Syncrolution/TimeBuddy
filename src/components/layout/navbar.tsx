'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CalendarDays, CalendarPlus, CalendarRange, Clock, ListTodo, LogOut, Menu, X } from 'lucide-react';
import { AUTH_CHANGED_EVENT } from '@/lib/auth-event';

const PUBLIC_NAV_ITEMS = [
  { href: '/kalender/monat', label: 'Monat', icon: CalendarDays },
  { href: '/kalender/woche', label: 'Woche', icon: CalendarRange },
  { href: '/kalender/tag', label: 'Tag', icon: ListTodo },
];

const ACTION_ITEMS = [
  { href: '/kalender/termin/neu', label: 'Termin erstellen', icon: CalendarPlus },
  { href: '/kalender/erinnerung', label: 'Erinnerungen', icon: Bell },
];

function AppleButton({
  href,
  children,
  isActive,
  onClick,
  variant = 'default',
}: {
  href?: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'dropdown' | 'login' | 'logout';
}) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    px-4 py-1.5 rounded-xl
    text-sm font-medium tracking-tight
    transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    cursor-pointer select-none
  `;

  const variants = {
    default: isActive
      ? 'text-gold-light bg-gold/10'
      : 'text-muted hover:text-ivory hover:bg-white/5',
    dropdown: 'text-muted hover:text-ivory hover:bg-white/5',
    login:
      'bg-gradient-to-b from-gold-light to-gold text-[#1a1408] font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:brightness-110 hover:scale-[1.02]',
    logout: 'text-muted hover:text-red-400 hover:bg-red-500/10',
  };

  if (href) {
    return (
      <Link href={href} className={`relative ${baseClasses} ${variants[variant]}`}>
        {children}
        {isActive && variant === 'default' && (
          <motion.span
            layoutId="nav-active-underline"
            className="absolute inset-x-3 -bottom-[13px] h-px bg-gradient-to-r from-transparent via-gold to-transparent"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Session wird nur beim Mount geladen und danach per AUTH_CHANGED_EVENT
  // aktualisiert (Login/Logout) — nicht mehr bei jedem Pfadwechsel.
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setUserEmail(data.user?.email || null);
        } else if (!cancelled) {
          setUserEmail(null);
        }
      } catch {
        if (!cancelled) setUserEmail(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();
    const onAuthChanged = () => void checkAuth();
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUserEmail(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
    >
      {/* Animated Gradient Glow */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold/8 via-gold/4 to-transparent pointer-events-none" />

      {/* Glass Bar - 70% opacity */}
      <div className="relative mx-4 mt-3 rounded-3xl bg-[#101015]/70 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between px-6 py-2.5">
          {/* Left Side: Logo + Navigation */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-light to-gold shadow-lg shadow-gold/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <Clock className="w-5 h-5 text-[#1a1408]" strokeWidth={2} />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gold/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-semibold text-ivory tracking-tight font-display">
                Time<span className="text-gold">Buddy</span>
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-white/10" />

            {/* Segmented Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <AppleButton
                    key={item.href}
                    href={item.href}
                    isActive={isActive}
                  >
                    <item.icon className="w-4 h-4" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </AppleButton>
                );
              })}

              {/* Aktionen Dropdown */}
              {userEmail && (
                <div className="relative" ref={dropdownRef}>
                  <AppleButton
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    variant="dropdown"
                  >
                    <span>Aktionen</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </AppleButton>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-full mt-2 w-60 bg-[#14141a]/85 backdrop-blur-2xl border border-gold/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
                      >
                        <div className="p-1.5">
                          {ACTION_ITEMS.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-ivory hover:bg-gold/10 transition-all duration-200"
                            >
                              <item.icon className="w-4 h-4 text-gold" strokeWidth={1.75} />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* User Area + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-32 bg-white/5 rounded-2xl animate-pulse" />
            ) : userEmail ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-2xl border border-gold/20">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center shadow-lg shadow-gold/25">
                    <span className="text-xs font-bold text-[#1a1408]">
                      {userEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-ivory">{userEmail}</span>
                </div>
                <AppleButton onClick={handleLogout} variant="logout">
                  <span>Abmelden</span>
                </AppleButton>
              </div>
            ) : (
              <AppleButton href="/login" variant="login">
                <span>Anmelden</span>
              </AppleButton>
            )}

            {/* Mobile Menu Toggle (nur < md) */}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl text-muted hover:text-ivory hover:bg-white/5 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.75} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel (nur < md) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              data-testid="mobile-menu"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute left-0 right-0 top-full mt-2 bg-[#14141a]/85 backdrop-blur-2xl border border-gold/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
            >
              <div className="p-1.5">
                {PUBLIC_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${isActive ? 'text-gold-light bg-gold/10' : 'text-muted hover:text-ivory hover:bg-white/5'}`}
                    >
                      <item.icon className="w-4 h-4" strokeWidth={1.75} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {userEmail && (
                  <>
                    <div className="my-1.5 h-px bg-white/10" />
                    {ACTION_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-ivory hover:bg-gold/10 transition-all duration-200"
                      >
                        <item.icon className="w-4 h-4 text-gold" strokeWidth={1.75} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        void handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={1.75} />
                      <span className="font-medium">Abmelden</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
