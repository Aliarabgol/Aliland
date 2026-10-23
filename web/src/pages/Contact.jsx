import { useState } from 'react';
import { useSettings } from '../context/SettingsContext.jsx';
import { useLeadSubmit } from '../lib/useLead.js';
import { TextField, TextareaField, PrivacyCheckbox, FormMessage, SubmitButton } from '../components/form.jsx';

const initial = { name: '', phone: '', subject: '', message: '', privacy: false };

export default function Contact() {
  const { settings } = useSettings();
  const lead = useLeadSubmit('contact');
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="container page narrow">
      <header className="page-head">
        <div>
          <h1>تماس با نمایشگاه</h1>
          <p className="muted">پیام خود را ثبت کنید؛ در پنل نمایشگاه دریافت و پیگیری می‌شود.</p>
        </div>
      </header>

      <div className="two-col">
        <div className="panel">
          <h2>اطلاعات تماس</h2>
          <dl className="spec-grid tight">
            <div><dt>نام مجموعه</dt><dd>{settings.name}</dd></div>
            <div><dt>شهر</dt><dd>{settings.city || 'ثبت نشده'}</dd></div>
            <div><dt>آدرس</dt><dd>{settings.address || 'ثبت نشده'}</dd></div>
            <div><dt>تلفن</dt><dd dir="ltr">{settings.phone || 'ثبت نشده'}</dd></div>
            <div><dt>ساعات کار</dt><dd>{settings.hours || 'ثبت نشده'}</dd></div>
          </dl>
          <p className="muted small">تا زمانی که اطلاعات تماس واقعی ثبت نشود، لینک تماس مستقیم نمایش داده نمی‌شود.</p>
        </div>

        <div className="panel">
          {lead.result ? (
            <div className="form-success" role="status">
              <h2>پیام ثبت شد</h2>
              <p>{lead.result.message}</p>
              <p>کد پیگیری: <b dir="ltr">{lead.result.publicCode}</b></p>
            </div>
          ) : (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                lead.submit(form);
              }}
            >
              <div className="field-row">
                <TextField label="نام" id="ct-name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={100} required error={lead.fields?.name} />
                <TextField label="موبایل" id="ct-phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required error={lead.fields?.phone} />
              </div>
              <TextField label="موضوع" id="ct-subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} maxLength={120} required error={lead.fields?.subject} />
              <TextareaField label="پیام" id="ct-msg" rows={5} maxLength={2000} value={form.message} onChange={(e) => set('message', e.target.value)} required error={lead.fields?.message} />
              <PrivacyCheckbox checked={form.privacy} onChange={(v) => set('privacy', v)} error={lead.fields?.privacy} />
              <FormMessage error={lead.error} />
              <SubmitButton busy={lead.busy}>ارسال پیام</SubmitButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
