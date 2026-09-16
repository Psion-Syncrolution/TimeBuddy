'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_CHANGED_EVENT } from '@/lib/auth-event';

const PUBLIC_NAV_ITEMS = [
  { href: '/kalender/monat', label: 'Monat', icon: '📅' },
  { href: '/kalender/woche', label: 'Woche', icon: '📆' },
  { href: '/kalender/tag', label: 'Tag', icon: '📋' },
];

const ACTION_ITEMS = [
  { href: '/kalender/termin/neu', label: 'Termin erstellen', icon: '➕' },
  { href: '/kalender/erinnerung', label: 'Erinnerungen', icon: '🔔' },
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
      ? 'text-blue-400 bg-white shadow-lg shadow-white/20'
      : 'text-white hover:text-blue-400 hover:bg-white/10',
    dropdown: 'text-gray-400 hover:text-white hover:bg-white/10',
    login: 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02]',
    logout: 'text-gray-400 hover:text-red-400 hover:bg-red-500/10',
  };

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${variants[variant]}`}>
        {children}
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/5 via-purple-500/3 to-transparent pointer-events-none" />

      {/* Glass Bar - 70% opacity */}
      <div className="relative mx-4 mt-3 rounded-3xl bg-gray-950/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between px-6 py-2.5">
          {/* Left Side: Logo + Navigation */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <span className="text-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">🕐</span>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                TimeBuddy
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
                    <span className="text-sm">{item.icon}</span>
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
                  {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-60 bg-gray-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
                      <div className="p-1.5">
                        {ACTION_ITEMS.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Area */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-32 bg-white/5 rounded-2xl animate-pulse" />
            ) : userEmail ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-xs font-bold text-white">
                      {userEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">{userEmail}</span>
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
          </div>
        </div>
      </div>
    </nav>
  );
}
