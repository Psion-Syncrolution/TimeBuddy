'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClockDisplay } from '@/components/layout/clock-display';

const UPDATE_NOTES = [
  {
    version: 'v1.0.0',
    date: '24.07.2026',
    title: 'Initial Release',
    items: [
      'Komplette Migration von PHP zu Next.js + TypeScript',
      'SQLite-Datenbank mit Prisma ORM',
      'Session-basierte Authentifizierung',
      'Monats-, Wochen- und Tagesansicht mit Farbcodierung',
      'Termin- und Erinnerungsmanagement',
      'Responsive Design mit Tailwind CSS',
    ],
    type: 'major' as const,
  },
  {
    version: 'v1.1.0',
    date: '25.07.2026',
    title: 'UX-Verbesserungen',
    items: [
      'Auth-Status wird nun live in der Navbar aktualisiert',
      'Termin-Count-Badges in der Monatsansicht',
      'Korrekte Zeitzonen-Verarbeitung (CET)',
      'Navigations-Items basierend auf Login-Status',
      'Verbesserte Tagesansicht mit korrekter Datumswahl',
    ],
    type: 'minor' as const,
  },
];

const PUBLIC_FEATURES = [
  {
    icon: '📅',
    title: 'Monatsübersicht',
    description: 'Behalte alle Termine eines Monats im Blick. Farbcodierte Tage zeigen auf einen Blick, wie viele Termine an einem Tag anstehen.',
    link: '/kalender/monat',
    linkText: 'Monatsansicht öffnen',
  },
  {
    icon: '📆',
    title: 'Wochenplanung',
    description: 'Navigiere durch Kalenderwochen und sieh schnell, welche Tage besonders ausgelastet sind. Perfekt für die Wochenplanung.',
    link: '/kalender/woche',
    linkText: 'Wochenansicht öffnen',
  },
  {
    icon: '📋',
    title: 'Tagesdetail',
    description: 'Stunde für Stunde: Sieh alle Termine eines Tages im Detail. Ideal für deinen täglichen Ablauf.',
    link: '/kalender/tag',
    linkText: 'Tagesansicht öffnen',
  },
];

const PREMIUM_FEATURES = [
  {
    icon: '➕',
    title: 'Termine erstellen',
    description: 'Erstelle neue Termine mit Titel, Datum, Uhrzeit und optionaler Beschreibung. Alles validiert und sicher gespeichert.',
    link: '/kalender/termin/neu',
    linkText: 'Termin erstellen',
  },
  {
    icon: '🔔',
    title: 'Erinnerungen',
    description: 'Verpasse nie wieder etwas. Erstelle Erinnerungen zu bestehenden Terminen mit eigenem Datum und Uhrzeit.',
    link: '/kalender/erinnerung',
    linkText: 'Erinnerungen verwalten',
  },
  {
    icon: '🔒',
    title: 'Sicherheit',
    description: 'Deine Daten sind sicher. Session-basierte Authentifizierung, Passwort-Hashing und nutzerspezifische Datenkapselung.',
    link: '/kalender/monat',
    linkText: 'Zum Kalender',
  },
];

const BENEFITS = [
  'Keine Installation nötig – läuft direkt im Browser',
  'Daten werden lokal in einer sicheren SQLite-Datenbank gespeichert',
  'Jeder Benutzer hat ein eigenes Konto mit separaten Daten',
  'Responsive Design – funktioniert auf Desktop, Tablet und Smartphone',
  'Deutsche Lokalisierung – Datumsformate und Texte auf Deutsch',
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(!!data.user);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="mb-6">
          <span className="text-7xl">🕐</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Willkommen bei <span className="text-blue-600">TimeBuddy</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          Dein smarter Kalender für Termine und Erinnerungen.
          Organisiere deinen Alltag einfach, übersichtlich und sicher.
        </p>
        <ClockDisplay />
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-lg"
          >
            Kostenlos starten
          </Link>
          <Link
            href="/kalender/monat"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-lg"
          >
            Kalender ansehen
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Was kann TimeBuddy?
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
          Alles, was du für die Organisation deines Terminkalenders brauchst –
          in einer modernen, sicheren Webanwendung.
        </p>

        {/* Public Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PUBLIC_FEATURES.map((feature) => (
            <Link
              key={feature.title}
              href={feature.link}
              className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 block"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                {feature.linkText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREMIUM_FEATURES.map((feature) => {
            const isLocked = !isAuthenticated;

            return isLocked ? (
              /* Locked Version */
              <div
                key={feature.title}
                className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm opacity-75 hover:opacity-100 transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Einloggen zum Freischalten
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              /* Unlocked Version */
              <Link
                key={feature.title}
                href={feature.link}
                className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 block"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                  {feature.linkText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Warum TimeBuddy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Update Notes */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Update-Verlauf
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
          TimeBuddy wird kontinuierlich verbessert. Hier siehst du die neuesten Änderungen und Updates.
        </p>
        <div className="max-w-3xl mx-auto space-y-6">
          {UPDATE_NOTES.map((note, index) => (
            <div
              key={note.version}
              className={`relative p-6 bg-white rounded-2xl border shadow-sm ${
                index === 0 ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'
              }`}
            >
              {index === 0 && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                  Neueste Version
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    note.type === 'major' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {note.version}
                </span>
                <span className="text-sm text-gray-400">{note.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{note.title}</h3>
              <ul className="space-y-2">
                {note.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Bereit, deinen Kalender zu organisieren?
        </h2>
        <p className="text-gray-500 mb-6">Erstelle jetzt dein kostenloses Konto und starte durch.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          Jetzt registrieren
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
