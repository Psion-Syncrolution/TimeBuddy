'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Erinnerung } from '@/types/erinnerung';
import { EmptyState } from '@/components/shared/empty-state';

interface ErinnerungListProps {
  erinnerungen: Erinnerung[];
  loading?: boolean;
}

export function ErinnerungList({ erinnerungen, loading = false }: ErinnerungListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (erinnerungen.length === 0) {
    return (
      <EmptyState
        title="Keine Erinnerungen"
        description="Erstelle eine Erinnerung, um nichts zu verpassen."
        actionLabel="Erinnerung erstellen"
        actionHref="/kalender/erinnerung"
      />
    );
  }

  return (
    <div className="space-y-3">
      {erinnerungen.map((erinnerung) => (
        <div
          key={erinnerung.id}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{erinnerung.erinnerung}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                <span>📅 {format(new Date(erinnerung.datum), 'dd.MM.yyyy', { locale: de })}</span>
                <span>🕐 {erinnerung.uhrzeit}</span>
              </div>
              {erinnerung.beschreibung && (
                <p className="mt-2 text-sm text-gray-600">{erinnerung.beschreibung}</p>
              )}
              {erinnerung.termin && (
                <p className="mt-1 text-xs text-blue-600">
                  Termin: {erinnerung.termin.titel}
                </p>
              )}
            </div>
            <div className="flex gap-1 ml-3 shrink-0">
              <Link
                href={`/kalender/erinnerung?bearbeiten=${erinnerung.id}`}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Bearbeiten"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <Link
                href={`/kalender/erinnerung?loeschen=${erinnerung.id}`}
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
      ))}
    </div>
  );
}
