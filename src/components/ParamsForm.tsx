import type { TaskParams } from '../types';
import { t } from '../i18n';
import { NumberField } from './NumberField';
import { OperationToggle } from './OperationToggle';

interface ParamsFormProps {
  params: TaskParams;
  onChange: (params: TaskParams) => void;
}

// Форма параметров генерации. Состояние поднято в App.
export function ParamsForm({ params, onChange }: ParamsFormProps) {
  return (
    <div className="space-y-5">
      <NumberField
        label={t('field.count')}
        value={params.count}
        min={1}
        max={200}
        onChange={(count) => onChange({ ...params, count })}
      />

      <NumberField
        label={t('field.maxNumber')}
        value={params.maxNumber}
        min={2}
        max={10000}
        onChange={(maxNumber) => onChange({ ...params, maxNumber })}
      />

      <OperationToggle
        selected={params.operations}
        onChange={(operations) => onChange({ ...params, operations })}
      />

      <label className="flex items-center justify-between rounded-xl border border-slate-300 px-4 py-3">
        <span className="text-sm font-medium text-slate-700">{t('field.shuffle')}</span>
        <input
          type="checkbox"
          checked={params.shuffle}
          onChange={(e) => onChange({ ...params, shuffle: e.target.checked })}
          className="h-6 w-6 accent-slate-900"
        />
      </label>
    </div>
  );
}
