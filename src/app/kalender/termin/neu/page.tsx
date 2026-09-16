import { TerminForm } from '@/components/termine/termin-form';

export default function TerminNeuPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ivory">Neuen Termin erstellen</h1>
      <div className="bg-surface rounded-2xl border border-white/10 shadow-lg shadow-black/20 p-6">
        <TerminForm mode="create" />
      </div>
    </div>
  );
}
