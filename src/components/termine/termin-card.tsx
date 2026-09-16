import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Termin } from '@/types/termin';

interface TerminCardProps {
  termin: Termin;
}

export function TerminCard({ termin }: TerminCardProps) {
  return (
    <div className="group p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {termin.titel}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              📅 {format(new Date(termin.datum), 'dd.MM.yyyy', { locale: de })}
            </span>
            <span className="flex items-center gap-1">
              🕐 {termin.uhrzeit}
            </span>
          </div>
          {termin.beschreibung && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{termin.beschreibung}</p>
          )}
        </div>
        <div className="flex gap-1 ml-3 shrink-0">
          <Link
            href={`/kalender/termin/bearbeiten?id=${termin.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Bearbeiten"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <Link
            href={`/kalender/termin/loeschen?id=${termin.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Löschen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
