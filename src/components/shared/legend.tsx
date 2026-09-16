export function Legend() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-muted font-medium">Farblegende:</span>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded bg-emerald-500/70 border border-emerald-500/40" />
        <span className="text-muted">1-4 Termine</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded bg-amber-500/70 border border-amber-500/40" />
        <span className="text-muted">5-8 Termine</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded bg-red-500/70 border border-red-500/40" />
        <span className="text-muted">9+ Termine</span>
      </div>
    </div>
  );
}
