export function Footer() {
  return (
    <footer className="relative z-10 mt-auto py-8 px-4 border-t border-white/5 bg-[#0d0d12]">
      {/* Gold-Divider-Linie */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-display text-sm text-ivory/80 tracking-wide">
          Time<span className="text-gold">Buddy</span>
        </p>
        <p className="mt-1.5 text-xs text-muted">
          © {new Date().getFullYear()} TimeBuddy — Dein smarter Kalender
        </p>
      </div>
    </footer>
  );
}
