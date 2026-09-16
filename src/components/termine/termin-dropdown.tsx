import { Select } from '@/components/ui/select';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Termin } from '@/types/termin';

interface TerminDropdownProps {
  termine: Termin[];
  value: string;
  onChange: (value: string) => void;
  label?: string | undefined;
  error?: string | undefined;
}

export function TerminDropdown({
  termine,
  value,
  onChange,
  label = 'Termin',
  error,
}: TerminDropdownProps) {
  const options = termine.map((termin) => ({
    value: termin.id,
    label: `${termin.titel} — ${format(new Date(termin.datum), 'dd.MM.yyyy', { locale: de })} ${termin.uhrzeit}`,
  }));

  return (
    <Select
      label={label}
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      placeholder="Termin auswählen"
    />
  );
}
