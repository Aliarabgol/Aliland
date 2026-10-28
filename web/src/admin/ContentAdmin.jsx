import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

const TABS = [
  { key: 'sections', label: 'admin.content' },
  { key: 'faqs', label: 'admin.faqs' },
  { key: 'services', label: 'admin.services' },
];

export default function ContentAdmin() {
  const { t, num } = useI18n();
  const [tab, setTab] = useState('sections');
  const [rows, setRows] = useState([]);
  const [flash, setFlash] = useState('');

  const endpoint = { sections: '/admin/sections', faqs: '/admin/faqs', services: '/admin/services' }[tab];

  const load = () =>
    api
      .get(endpoint)
      .then((data) => setRows(data.items || []))
      .catch(() => setRows([]));

  useEffect(() => {
    load();
  }, [tab]);

  const patch = async (row, changes) => {
    await api.patch(`${endpoint}/${row.id}`, changes);
    setFlash(t('admin.saved'));
    await load();
    setTimeout(() => setFlash(''), 2200);
  };

  const remove = async (row) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    await api.del(`${endpoint}/${row.id}`);
    await load();
  };

  const createFaq = async () => {
    await api.post('/admin/faqs', {
      question_fa: 'پرسش جدید',
      question_en: 'New question',
      answer_fa: '',
      answer_en: '',
      group: 'general',
      status: 'draft',
    });
    await load();
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="admin-head">
        <div>
          <h1>{t('admin.content')}</h1>
          <p className="small muted">
            {t('admin.syntheticOnly')} — {num(rows.length)}
          </p>
        </div>
        <div className="row">
          {flash && <span className="tag tag--cobalt">{flash}</span>}
          {tab === 'faqs' && (
            <button type="button" className="btn btn--primary btn--sm" onClick={createFaq}>
              <Icon name="plus" size={14} />
              {t('act.create')}
            </button>
          )}
        </div>
      </div>

      <div className="tabs">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`tab${tab === item.key ? ' is-active' : ''}`}
            onClick={() => setTab(item.key)}
          >
            {t(item.label)}
          </button>
        ))}
      </div>

      {tab === 'sections' && (
        <div className="stack" style={{ gap: 14 }}>
          {rows.map((row) => (
            <SectionRow key={row.id} row={row} onSave={patch} />
          ))}
        </div>
      )}

      {tab === 'faqs' && (
        <div className="stack" style={{ gap: 14 }}>
          {rows.map((row) => (
            <FaqRow key={row.id} row={row} onSave={patch} onDelete={remove} />
          ))}
        </div>
      )}

      {tab === 'services' && (
        <div className="stack" style={{ gap: 14 }}>
          {rows.map((row) => (
            <ServiceRow key={row.id} row={row} onSave={patch} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ children, onSave, saving, title, meta }) {
  const { t } = useI18n();
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="flex-between" style={{ marginBlockEnd: 12 }}>
        <div>
          <strong>{title}</strong>
          {meta && <div className="small muted">{meta}</div>}
        </div>
        {onSave && (
          <button type="button" className="btn btn--ink btn--sm" onClick={onSave} disabled={saving}>
            {saving ? t('act.loading') : t('act.save')}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionRow({ row, onSave }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(row);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(row, {
        title_fa: draft.title_fa,
        title_en: draft.title_en,
        subtitle_fa: draft.subtitle_fa,
        subtitle_en: draft.subtitle_en,
        cta_label_fa: draft.cta_label_fa,
        cta_label_en: draft.cta_label_en,
        cta_href: draft.cta_href,
        visible: draft.visible,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title={row.label} meta={`#${row.key}`} onSave={save} saving={saving}>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label>عنوان (FA)</label>
          <input className="input" value={draft.title_fa || ''} onChange={(event) => setDraft({ ...draft, title_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>Title (EN)</label>
          <input className="input" dir="ltr" value={draft.title_en || ''} onChange={(event) => setDraft({ ...draft, title_en: event.target.value })} />
        </div>
        <div className="field">
          <label>زیرعنوان (FA)</label>
          <textarea className="textarea" style={{ minHeight: 70 }} value={draft.subtitle_fa || ''} onChange={(event) => setDraft({ ...draft, subtitle_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>Subtitle (EN)</label>
          <textarea className="textarea" style={{ minHeight: 70 }} dir="ltr" value={draft.subtitle_en || ''} onChange={(event) => setDraft({ ...draft, subtitle_en: event.target.value })} />
        </div>
        <div className="field">
          <label>CTA (FA)</label>
          <input className="input" value={draft.cta_label_fa || ''} onChange={(event) => setDraft({ ...draft, cta_label_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>CTA (EN)</label>
          <input className="input" dir="ltr" value={draft.cta_label_en || ''} onChange={(event) => setDraft({ ...draft, cta_label_en: event.target.value })} />
        </div>
        <div className="field">
          <label>CTA link</label>
          <input className="input" dir="ltr" value={draft.cta_href || ''} onChange={(event) => setDraft({ ...draft, cta_href: event.target.value })} />
        </div>
        <label className="check" style={{ alignSelf: 'end' }}>
          <input type="checkbox" checked={draft.visible} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} />
          <span className="small">visible</span>
        </label>
      </div>
    </Card>
  );
}

function FaqRow({ row, onSave, onDelete }) {
  const [draft, setDraft] = useState(row);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(row, {
        question_fa: draft.question_fa,
        question_en: draft.question_en,
        answer_fa: draft.answer_fa,
        answer_en: draft.answer_en,
        status: draft.status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={row.question_fa?.slice(0, 70)}
      meta={`${row.group} · ${row.status}`}
      onSave={save}
      saving={saving}
    >
      <div className="form-grid form-grid--2">
        <div className="field">
          <label>پرسش (FA)</label>
          <input className="input" value={draft.question_fa || ''} onChange={(event) => setDraft({ ...draft, question_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>Question (EN)</label>
          <input className="input" dir="ltr" value={draft.question_en || ''} onChange={(event) => setDraft({ ...draft, question_en: event.target.value })} />
        </div>
        <div className="field">
          <label>پاسخ (FA)</label>
          <textarea className="textarea" value={draft.answer_fa || ''} onChange={(event) => setDraft({ ...draft, answer_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>Answer (EN)</label>
          <textarea className="textarea" dir="ltr" value={draft.answer_en || ''} onChange={(event) => setDraft({ ...draft, answer_en: event.target.value })} />
        </div>
        <div className="field">
          <label>status</label>
          <select className="select" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>
        <div className="field" style={{ alignSelf: 'end' }}>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => onDelete(row)}>
            <Icon name="trash" size={14} />
            delete
          </button>
        </div>
      </div>
    </Card>
  );
}

function ServiceRow({ row, onSave }) {
  const [draft, setDraft] = useState(row);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(row, {
        title_fa: draft.title_fa,
        title_en: draft.title_en,
        kicker_fa: draft.kicker_fa,
        kicker_en: draft.kicker_en,
        intro_fa: draft.intro_fa,
        intro_en: draft.intro_en,
        status: draft.status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title={row.title_fa} meta={`${row.slug} · ${row.status}`} onSave={save} saving={saving}>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label>عنوان (FA)</label>
          <input className="input" value={draft.title_fa || ''} onChange={(event) => setDraft({ ...draft, title_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>Title (EN)</label>
          <input className="input" dir="ltr" value={draft.title_en || ''} onChange={(event) => setDraft({ ...draft, title_en: event.target.value })} />
        </div>
        <div className="field">
          <label>kicker (FA)</label>
          <input className="input" value={draft.kicker_fa || ''} onChange={(event) => setDraft({ ...draft, kicker_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>kicker (EN)</label>
          <input className="input" dir="ltr" value={draft.kicker_en || ''} onChange={(event) => setDraft({ ...draft, kicker_en: event.target.value })} />
        </div>
        <div className="field">
          <label>intro (FA)</label>
          <textarea className="textarea" value={draft.intro_fa || ''} onChange={(event) => setDraft({ ...draft, intro_fa: event.target.value })} />
        </div>
        <div className="field">
          <label>intro (EN)</label>
          <textarea className="textarea" dir="ltr" value={draft.intro_en || ''} onChange={(event) => setDraft({ ...draft, intro_en: event.target.value })} />
        </div>
        <div className="field">
          <label>status</label>
          <select className="select" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
