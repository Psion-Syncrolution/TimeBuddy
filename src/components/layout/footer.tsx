export function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} TimeBuddy — Dein smarter Kalender
        </p>
      </div>
    </footer>
  );
}
