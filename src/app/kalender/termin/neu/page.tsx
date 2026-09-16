import { TerminForm } from '@/components/termine/termin-form';

export default function TerminNeuPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Neuen Termin erstellen</h1>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <TerminForm mode="create" />
      </div>
    </div>
  );
}
