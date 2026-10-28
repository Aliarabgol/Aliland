import { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n.jsx';
import { api } from '../lib/api.js';
import VehicleCard from './VehicleCard.jsx';
import { Icon } from './Icons.jsx';

const BANDS = {
  economy: { max: 1000000000 },
  mid: { min: 1000000000, max: 2200000000 },
  premium: { min: 2200000000, max: 4000000000 },
  luxury: { min: 4000000000 },
};

const BODY_PREFERENCE = {
  city: ['hatchback', 'sedan', 'crossover'],
  highway: ['sedan', 'suv'],
  mixed: ['crossover', 'sedan', 'suv'],
};

/**
 * Three-question finder. Ranks the demo catalogue locally — no personal data
 * leaves the page and nothing is stored.
 */
export default function FinderQuiz({ compact = false }) {
  const { t, lang, num } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ budget: 'mid', usage: 'city', priority: 'space' });
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);

  const questions = useMemo(
    () => [
      {
        key: 'budget',
        title: t('finder.step.budget'),
        options: ['economy', 'mid', 'premium', 'luxury'].map((value) => ({
          value,
          label: t(`band.${value}`),
        })),
      },
      {
        key: 'usage',
        title: t('finder.step.usage'),
        options: ['city', 'highway', 'mixed'].map((value) => ({
          value,
          label: t(`finder.${value}`),
        })),
      },
      {
        key: 'priority',
        title: t('finder.step.priority'),
        options: ['space', 'economy', 'equipment'].map((value) => ({
          value,
          label: t(`finder.${value}`),
        })),
      },
    ],
    [t],
  );

  const run = async () => {
    setBusy(true);
    try {
      const band = BANDS[answers.budget];
      const params = new URLSearchParams({ perPage: '48' });
      if (band.min) params.set('priceMin', String(band.min));
      if (band.max) params.set('priceMax', String(band.max));
      const data = await api.get(`/vehicles?${params.toString()}`);
      const preferred = BODY_PREFERENCE[answers.usage] || [];
      const scored = (data.items || [])
        .map((vehicle) => {
          let score = 0;
          const bodyRank = preferred.indexOf(vehicle.body_style);
          if (bodyRank >= 0) score += (preferred.length - bodyRank) * 3;
          if (answers.priority === 'space') {
            score += (vehicle.specs?.seats || 5) >= 7 ? 6 : 0;
            score += (vehicle.specs?.boot_l || 0) / 120;
          }
          if (answers.priority === 'economy') {
            score += Math.max(0, 12 - (vehicle.specs?.consumption_l100 || 10)) * 1.4;
            if (vehicle.price_band === 'economy') score += 4;
          }
          if (answers.priority === 'equipment') {
            score += (vehicle.features?.length || 0) * 0.55;
            if (vehicle.price_band === 'luxury' || vehicle.price_band === 'premium') score += 2;
          }
          return { vehicle, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry) => entry.vehicle);
      setResults(scored);
      setStep(3);
    } catch {
      setResults([]);
      setStep(3);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setResults(null);
    setStep(0);
  };

  return (
    <div className={compact ? 'card' : 'flow-card'}>
      {step < 3 ? (
        <>
          <div className="flex-between">
            <span className="label">
              {t('form.step', { n: num(step + 1), total: num(3) })}
            </span>
            <span className="row" style={{ gap: 6 }}>
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  style={{
                    width: dot === step ? 22 : 7,
                    height: 7,
                    borderRadius: 999,
                    background: dot === step ? 'var(--cobalt)' : 'var(--hairline-strong)',
                    transition: 'width .3s ease',
                  }}
                />
              ))}
            </span>
          </div>

          <h3 className="h3" style={{ marginBlock: '14px 12px' }}>
            {questions[step].title}
          </h3>

          <div className="row" style={{ gap: 8 }}>
            {questions[step].options.map((option) => (
              <button
                type="button"
                key={option.value}
                className="chip"
                aria-pressed={answers[questions[step].key] === option.value}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [questions[step].key]: option.value }))
                }
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flow-nav" style={{ marginBlockStart: 20 }}>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              {t('act.prev')}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => (step === 2 ? run() : setStep((s) => s + 1))}
              disabled={busy}
            >
              {busy ? t('act.loading') : step === 2 ? t('finder.result') : t('act.next')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </button>
          </div>
          <p className="small muted" style={{ marginBlockStart: 14 }}>
            {lang === 'fa'
              ? 'پاسخ‌ها فقط در همین صفحه استفاده می‌شوند و ذخیره نمی‌شوند.'
              : 'Your answers are used on this page only and are not stored.'}
          </p>
        </>
      ) : (
        <>
          <div className="flex-between">
            <h3 className="h3">{t('finder.result')}</h3>
            <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>
              {t('finder.again')}
            </button>
          </div>
          <div className="grid-3 mt-3">
            {(results || []).map((vehicle) => (
              <VehicleCard vehicle={vehicle} key={vehicle.slug} compact />
            ))}
          </div>
          {results && results.length === 0 && <p className="muted">{t('cat.empty')}</p>}
        </>
      )}
    </div>
  );
}
