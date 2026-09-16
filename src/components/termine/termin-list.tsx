'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Termin } from '@/types/termin';
import { EmptyState } from '@/components/shared/empty-state';

interface TerminListProps {
  termine: Termin[];
  loading?: boolean;
}

export function TerminList({ termine, loading = false }: TerminListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (termine.length === 0) {
    return (
      <EmptyState
        title="Keine Termine"
        description="Erstelle deinen ersten Termin, um loszulegen."
        actionLabel="Termin erstellen"
        actionHref="/kalender/termin/neu"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Titel</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Datum</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Uhrzeit</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Beschreibung</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-600">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {termine.map((termin) => (
            <tr key={termin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-900">{termin.titel}</td>
              <td className="py-3 px-4 text-gray-600">
                {format(new Date(termin.datum), 'dd.MM.yyyy', { locale: de })}
              </td>
              <td className="py-3 px-4 text-gray-600">{termin.uhrzeit}</td>
              <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                {termin.beschreibung || '—'}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/kalender/termin/bearbeiten?id=${termin.id}`}
                    className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Bearbeiten
                  </Link>
                  <Link
                    href={`/kalender/termin/loeschen?id=${termin.id}`}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Löschen
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
