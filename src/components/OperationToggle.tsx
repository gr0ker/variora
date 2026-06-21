import type { Operation } from '../types';
import { ALL_OPERATIONS } from '../generator/arithmetic';
import { t } from '../i18n';

const OP_SYMBOL: Record<Operation, string> = {
  add: '+',
  sub: '−',
  mul: '×',
  div: '÷',
};

interface OperationToggleProps {
  selected: Operation[];
  onChange: (selected: Operation[]) => void;
}

// Переключатели операций (+ − × ÷). Нельзя снять все — последнюю снять не даём.
export function OperationToggle({ selected, onChange }: OperationToggleProps) {
  const set = new Set(selected);

  function toggle(op: Operation) {
    const next = new Set(set);
    if (next.has(op)) {
      if (next.size === 1) return; // оставляем хотя бы одну операцию
      next.delete(op);
    } else {
      next.add(op);
    }
    onChange(ALL_OPERATIONS.filter((o) => next.has(o)));
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">{t('field.operations')}</span>
      <div className="grid grid-cols-2 gap-2">
        {ALL_OPERATIONS.map((op) => {
          const active = set.has(op);
          return (
            <button
              key={op}
              type="button"
              onClick={() => toggle(op)}
              aria-pressed={active}
              className={
                'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ' +
                (active
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700')
              }
            >
              <span className="text-sm">{t(`op.${op}`)}</span>
              <span className="text-xl font-bold">{OP_SYMBOL[op]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
