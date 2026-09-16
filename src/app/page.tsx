'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, CalendarDays, CalendarPlus, CalendarRange, Check, Clock, ListTodo, Lock, ShieldCheck } from 'lucide-react';
import { ClockDisplay } from '@/components/layout/clock-display';
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  heroReveal,
  VIEWPORT,
} from '@/components/shared/motion';

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
    icon: CalendarDays,
    title: 'Monatsübersicht',
    description: 'Behalte alle Termine eines Monats im Blick. Farbcodierte Tage zeigen auf einen Blick, wie viele Termine an einem Tag anstehen.',
    link: '/kalender/monat',
    linkText: 'Monatsansicht öffnen',
  },
  {
    icon: CalendarRange,
    title: 'Wochenplanung',
    description: 'Navigiere durch Kalenderwochen und sieh schnell, welche Tage besonders ausgelastet sind. Perfekt für die Wochenplanung.',
    link: '/kalender/woche',
    linkText: 'Wochenansicht öffnen',
  },
  {
    icon: ListTodo,
    title: 'Tagesdetail',
    description: 'Stunde für Stunde: Sieh alle Termine eines Tages im Detail. Ideal für deinen täglichen Ablauf.',
    link: '/kalender/tag',
    linkText: 'Tagesansicht öffnen',
  },
];

const PREMIUM_FEATURES = [
  {
    icon: CalendarPlus,
    title: 'Termine erstellen',
    description: 'Erstelle neue Termine mit Titel, Datum, Uhrzeit und optionaler Beschreibung. Alles validiert und sicher gespeichert.',
    link: '/kalender/termin/neu',
    linkText: 'Termin erstellen',
  },
  {
    icon: Bell,
    title: 'Erinnerungen',
    description: 'Verpasse nie wieder etwas. Erstelle Erinnerungen zu bestehenden Terminen mit eigenem Datum und Uhrzeit.',
    link: '/kalender/erinnerung',
    linkText: 'Erinnerungen verwalten',
  },
  {
    icon: ShieldCheck,
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
      <motion.section
        className="text-center py-16"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={heroReveal} custom={0} className="mb-8">
          <span className="glass inline-flex items-center justify-center w-20 h-20 rounded-full border-gold/30 animate-glow-pulse">
            <Clock className="w-9 h-9 text-gold" strokeWidth={1.5} />
          </span>
        </motion.div>
        <motion.h1
          variants={heroReveal}
          custom={1}
          className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4 tracking-tight"
        >
          Willkommen bei{' '}
          <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent animate-shimmer">
            TimeBuddy
          </span>
        </motion.h1>
        <motion.p variants={heroReveal} custom={2} className="text-xl text-muted max-w-2xl mx-auto mb-8">
          Dein smarter Kalender für Termine und Erinnerungen.
          Organisiere deinen Alltag einfach, übersichtlich und sicher.
        </motion.p>
        <motion.div variants={heroReveal} custom={3}>
          <ClockDisplay />
        </motion.div>
        <motion.div variants={heroReveal} custom={4} className="flex flex-wrap gap-4 justify-center mt-8">
          <Link
            href="/register"
            className="px-8 py-3 bg-gradient-to-b from-gold-light to-gold text-[#1a1408] font-semibold rounded-xl shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:brightness-110 transition-all text-lg"
          >
            Kostenlos starten
          </Link>
          <Link
            href="/kalender/monat"
            className="px-8 py-3 bg-surface-2 text-ivory font-semibold rounded-xl border border-white/10 hover:border-gold/40 hover:bg-[#23232c] transition-all text-lg"
          >
            Kalender ansehen
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-ivory mb-3">
            Was kann TimeBuddy?
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Alles, was du für die Organisation deines Terminkalenders brauchst –
            in einer modernen, sicheren Webanwendung.
          </p>
        </motion.div>

        {/* Public Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {PUBLIC_FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={staggerItem}>
              <Link
                href={feature.link}
                className="group glass p-6 rounded-2xl hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 block h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-ivory mb-2 group-hover:text-gold-light transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted mb-4">{feature.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
                  {feature.linkText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {PREMIUM_FEATURES.map((feature) => {
            const isLocked = !isAuthenticated;

            return (
              <motion.div key={feature.title} variants={staggerItem}>
                {isLocked ? (
                  /* Locked Version */
                  <div className="group glass p-6 rounded-2xl opacity-75 hover:opacity-100 transition-all duration-300 relative overflow-hidden h-full">
                    <div className="absolute top-3 right-3">
                      <Lock className="w-5 h-5 text-gold/60" strokeWidth={1.75} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-ivory mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted mb-4">{feature.description}</p>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-light transition-colors"
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
                    href={feature.link}
                    className="group glass p-6 rounded-2xl border-gold/25 hover:border-gold/50 hover:-translate-y-1 transition-all duration-300 block h-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-ivory mb-2 group-hover:text-gold-light transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted mb-4">{feature.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
                      {feature.linkText}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <motion.section
        className="glass rounded-2xl p-8 relative overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <motion.h2 variants={staggerItem} className="font-display text-2xl font-bold text-ivory mb-6 text-center">
          Warum TimeBuddy?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {BENEFITS.map((benefit, index) => (
            <motion.div key={index} variants={staggerItem} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-gold" strokeWidth={2} />
              </span>
              <span className="text-ivory/80">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Update Notes */}
      <section>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-ivory mb-3">
            Update-Verlauf
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            TimeBuddy wird kontinuierlich verbessert. Hier siehst du die neuesten Änderungen und Updates.
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-6">
          {UPDATE_NOTES.map((note, index) => (
            <motion.div
              key={note.version}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className={`relative glass p-6 rounded-2xl ${
                index === 0 ? 'border-gold/40 ring-1 ring-gold/20' : ''
              }`}
            >
              {index === 0 && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-gradient-to-b from-gold-light to-gold text-[#1a1408] text-xs font-bold rounded-full">
                  Neueste Version
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    note.type === 'major'
                      ? 'bg-gold/15 text-gold-light border border-gold/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {note.version}
                </span>
                <span className="text-sm text-muted">{note.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-ivory mb-3">{note.title}</h3>
              <ul className="space-y-2">
                {note.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-gold mt-1 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="text-center py-8"
      >
        <h2 className="font-display text-2xl font-bold text-ivory mb-3">
          Bereit, deinen Kalender zu organisieren?
        </h2>
        <p className="text-muted mb-6">Erstelle jetzt dein kostenloses Konto und starte durch.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-b from-gold-light to-gold text-[#1a1408] font-semibold rounded-xl shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:brightness-110 transition-all"
        >
          Jetzt registrieren
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </motion.section>
    </div>
  );
}
