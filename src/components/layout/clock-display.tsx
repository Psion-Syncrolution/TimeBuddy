'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function ClockDisplay() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl font-mono font-bold text-gray-900 tracking-wider">
          --:--:--
        </div>
        <div className="mt-2 text-lg text-gray-500">Lädt...</div>
      </div>
    );
  }

  const time = format(now, 'HH:mm:ss');
  const date = format(now, 'EEEE, dd. MMMM yyyy', { locale: de });

  return (
    <div className="text-center py-4">
      <div className="text-5xl font-mono font-bold text-gray-900 tracking-wider">
        {time}
      </div>
      <div className="mt-2 text-lg text-gray-500">
        {date}
      </div>
    </div>
  );
}
