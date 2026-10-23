import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeadSubmit } from '../lib/useLead.js';
import { TextField, TextareaField, SelectField, PrivacyCheckbox, FormMessage, SubmitButton } from '../components/form.jsx';

const BODY = ['سدان', 'شاسی‌بلند', 'هاچ‌بک', 'کوپه', 'پیکاپ'];
const initial = {
  budgetMin: '', budgetMax: '', brandPref: '', yearValue: '', yearCalendar: 'jalali',
  maxMileage: '', bodyType: '', city: '', message: '', name: '', phone: '', privacy: false,
};

export default function RequestCar() {
  const lead = useLeadSubmit('request-car');
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (lead.result) {
    return (
      <div className="container page narrow">
        <div className="panel form-success">
          <h1>درخواست خودرو ثبت شد</h1>
          <p>{lead.result.message}</p>
          <p>کد پیگیری: <b dir="ltr">{lead.result.publicCode}</b></p>
          <Link to="/cars" className="btn btn-primary">مشاهدهٔ موجودی</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page narrow">
      <header className="page-head">
        <div>
          <h1>درخواست خودرو</h1>
          <p className="muted">مشخصات مورد نظرتان را ثبت کنید تا در صورت موجود شدن با شما تماس بگیریم.</p>
        </div>
      </header>

      <form
        className="panel stack"
        onSubmit={(e) => {
          e.preventDefault();
          lead.submit(form);
        }}
      >
        <div className="field-row">
          <TextField label="بودجه از (تومان)" id="r-bmin" inputMode="numeric" value={form.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} error={lead.fields?.budgetMin} />
          <TextField label="بودجه تا (تومان)" id="r-bmax" inputMode="numeric" value={form.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} error={lead.fields?.budgetMax} />
        </div>
        <TextField label="برند یا مدل‌های ترجیحی" id="r-brand" value={form.brandPref} onChange={(e) => set('brandPref', e.target.value)} maxLength={120} placeholder="مثلاً پژو ۲۰۷ یا شاسی‌بلند" />
        <div className="field-row">
          <TextField label="سال" id="r-year" inputMode="numeric" value={form.yearValue} onChange={(e) => set('yearValue', e.target.value)} />
          <SelectField label="تقویم" id="r-cal" value={form.yearCalendar} onChange={(e) => set('yearCalendar', e.target.value)} options={[{ value: 'jalali', label: 'شمسی' }, { value: 'gregorian', label: 'میلادی' }]} />
        </div>
        <div className="field-row">
          <TextField label="حداکثر کارکرد (کیلومتر)" id="r-mileage" inputMode="numeric" value={form.maxMileage} onChange={(e) => set('maxMileage', e.target.value)} error={lead.fields?.maxMileage} />
          <SelectField label="نوع بدنه" id="r-body" value={form.bodyType} onChange={(e) => set('bodyType', e.target.value)} options={BODY} placeholder="همه" />
        </div>
        <TextField label="شهر" id="r-city" value={form.city} onChange={(e) => set('city', e.target.value)} maxLength={60} />
        <TextareaField label="توضیح" id="r-msg" rows={4} maxLength={2000} value={form.message} onChange={(e) => set('message', e.target.value)} error={lead.fields?.message} />
        <div className="field-row">
          <TextField label="نام و نام خانوادگی" id="r-name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={100} required error={lead.fields?.name} />
          <TextField label="موبایل" id="r-phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required error={lead.fields?.phone} />
        </div>
        <PrivacyCheckbox checked={form.privacy} onChange={(v) => set('privacy', v)} error={lead.fields?.privacy} />
        <FormMessage error={lead.error} />
        <SubmitButton busy={lead.busy}>ثبت درخواست</SubmitButton>
      </form>
    </div>
  );
}
