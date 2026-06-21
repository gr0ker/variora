import { useRef, useState } from 'react';
import type { Problem, TaskParams } from './types';
import { ALL_OPERATIONS, generateProblems } from './generator/arithmetic';
import { buildAnswers, buildWorksheet } from './pdf/buildPdf';
import { makeToken } from './pdf/token';
import { ParamsForm } from './components/ParamsForm';
import { t } from './i18n';

const DEFAULT_PARAMS: TaskParams = {
  count: 20,
  maxNumber: 100,
  operations: [...ALL_OPERATIONS],
  shuffle: true,
};

type DownloadKind = 'worksheet' | 'answers' | 'both';

export default function App() {
  const [params, setParams] = useState<TaskParams>(DEFAULT_PARAMS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Кэшируем сгенерированный набор вместе с токеном: лист с примерами и лист
  // ответов одной пары получают один и тот же код. Пока параметры не менялись,
  // повторные скачивания используют тот же набор и тот же код.
  const cache = useRef<{ sig: string; problems: Problem[]; token: string } | null>(null);

  function getPair(forceNew: boolean): { problems: Problem[]; token: string } {
    const sig = JSON.stringify(params);
    if (forceNew || !cache.current || cache.current.sig !== sig) {
      cache.current = { sig, problems: generateProblems(params), token: makeToken() };
    }
    return cache.current;
  }

  async function download(kind: DownloadKind, forceNew = false) {
    if (params.operations.length === 0) {
      setError(t('error.noOperations'));
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { problems, token } = getPair(forceNew);
      if (kind !== 'answers') await buildWorksheet(problems, params, token);
      if (kind !== 'worksheet') await buildAnswers(problems, params, token);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <p className="text-sm text-slate-600">{t('app.subtitle')}</p>
        </header>

        <main className="flex-1 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">{t('task.title')}</h2>
            <p className="text-sm text-slate-500">{t('task.hint')}</p>
          </div>

          <ParamsForm params={params} onChange={setParams} />

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => download('both')}
              className="w-full rounded-xl bg-slate-900 px-4 py-4 text-lg font-semibold text-white disabled:opacity-50"
            >
              {busy ? t('button.working') : t('button.both')}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => download('worksheet')}
                className="rounded-xl border border-slate-300 px-4 py-3 font-medium disabled:opacity-50"
              >
                {t('button.worksheet')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => download('answers')}
                className="rounded-xl border border-slate-300 px-4 py-3 font-medium disabled:opacity-50"
              >
                {t('button.answers')}
              </button>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={() => download('both', true)}
              className="w-full rounded-xl px-4 py-2 text-sm font-medium text-slate-600 underline disabled:opacity-50"
            >
              ↻ {t('button.regenerate')}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
