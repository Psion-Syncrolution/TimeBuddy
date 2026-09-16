export function Legend() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-600 font-medium">Farblegende:</span>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded bg-green-500/70" />
        <span className="text-gray-600">1-4 Termine</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded bg-yellow-400/70" />
        <span className="text-gray-600">5-8 Termine</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded bg-orange-500/70" />
        <span className="text-gray-600">9+ Termine</span>
      </div>
    </div>
  );
}
