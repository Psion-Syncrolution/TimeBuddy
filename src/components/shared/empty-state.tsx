import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-ivory mb-1">{title}</h3>
      <p className="text-sm text-muted mb-4 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-4 py-2 bg-gradient-to-b from-gold-light to-gold text-[#1a1408] text-sm font-semibold rounded-lg shadow-md shadow-gold/20 hover:shadow-gold/40 transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
