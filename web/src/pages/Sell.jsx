import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeadSubmit } from '../lib/useLead.js';
import { TextField, TextareaField, SelectField, PrivacyCheckbox, FormMessage, SubmitButton } from '../components/form.jsx';

const STEPS = ['اطلاعات خودرو', 'بدنه و قیمت', 'توضیحات', 'تماس و بازبینی'];
const BODY = ['سدان', 'شاسی‌بلند', 'هاچ‌بک', 'کوپه', 'پیکاپ'];
const TRANS = ['دنده‌ای', 'اتوماتیک'];
const FUEL = ['بنزین', 'دوگانه‌سوز', 'هیبرید', 'برقی'];

const initial = {
  brand: '', model: '', trim: '', yearValue: '', yearCalendar: 'jalali', mileageKm: '', city: '',
  bodyType: '', transmission: '', fuelType: '', priceToman: '', description: '',
  name: '', phone: '', privacy: false,
};

export default function Sell() {
  const lead = useLeadSubmit('sell');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (lead.result) {
    return (
      <div className="container page narrow">
        <div className="panel form-success">
          <h1>درخواست فروش ثبت شد</h1>
          <p>{lead.result.message}</p>
          <p>کد پیگیری: <b dir="ltr">{lead.result.publicCode}</b></p>
          <p className="muted">
            این درخواست خصوصی است و آگهی عمومی به‌صورت خودکار ساخته نمی‌شود؛ پس از بازبینی، کارشناس نمایشگاه برای
            دریافت مدارک و عکس‌ها با شما تماس می‌گیرد.
          </p>
          <Link to="/cars" className="btn btn-primary">مشاهدهٔ موجودی</Link>
        </div>
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const step1Ok = form.brand.trim() && form.model.trim();

  return (
    <div className="container page narrow">
      <header className="page-head">
        <div>
          <h1>ماشینت را برای فروش معرفی کن</h1>
          <p className="muted">در چهار مرحله اطلاعات را ثبت کنید. در پایان، درخواست به‌صورت خصوصی ثبت می‌شود.</p>
        </div>
      </header>

      <ol className="wizard-progress" aria-label="مراحل">
        {STEPS.map((label, i) => (
          <li key={label} className={step === i + 1 ? 'is-active' : step > i + 1 ? 'is-done' : ''}>
            <span className="wizard-num">{i + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>

      <form
        className="panel stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 4) return next();
          lead.submit(form);
        }}
      >
        {step === 1 && (
          <>
            <div className="field-row">
              <TextField label="برند" id="s-brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} maxLength={60} required error={lead.fields?.brand} />
              <TextField label="مدل" id="s-model" value={form.model} onChange={(e) => set('model', e.target.value)} maxLength={60} required error={lead.fields?.model} />
            </div>
            <TextField label="تیپ (اختیاری)" id="s-trim" value={form.trim} onChange={(e) => set('trim', e.target.value)} maxLength={60} />
            <div className="field-row">
              <TextField label="سال" id="s-year" inputMode="numeric" value={form.yearValue} onChange={(e) => set('yearValue', e.target.value)} error={lead.fields?.yearValue} />
              <SelectField label="تقویم سال" id="s-cal" value={form.yearCalendar} onChange={(e) => set('yearCalendar', e.target.value)} options={[{ value: 'jalali', label: 'شمسی' }, { value: 'gregorian', label: 'میلادی' }]} />
            </div>
            <div className="field-row">
              <TextField label="کارکرد (کیلومتر)" id="s-mileage" inputMode="numeric" value={form.mileageKm} onChange={(e) => set('mileageKm', e.target.value)} error={lead.fields?.mileageKm} />
              <TextField label="شهر" id="s-city" value={form.city} onChange={(e) => set('city', e.target.value)} maxLength={60} />
            </div>
            <p className="muted small">اگر مدل خودرو در فهرست نیست، همان نام مدل را آزادانه وارد کنید؛ کاتالوگ عمومی خودکار تغییر نمی‌کند.</p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field-row">
              <SelectField label="نوع بدنه" id="s-body" value={form.bodyType} onChange={(e) => set('bodyType', e.target.value)} options={BODY} placeholder="انتخاب کنید" />
              <SelectField label="گیربکس" id="s-trans" value={form.transmission} onChange={(e) => set('transmission', e.target.value)} options={TRANS} placeholder="انتخاب کنید" />
            </div>
            <div className="field-row">
              <SelectField label="سوخت" id="s-fuel" value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)} options={FUEL} placeholder="انتخاب کنید" />
              <TextField label="قیمت پیشنهادی (تومان، اختیاری)" id="s-price" inputMode="numeric" value={form.priceToman} onChange={(e) => set('priceToman', e.target.value)} error={lead.fields?.priceToman} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <TextareaField
              label="توضیحات خودرو"
              id="s-desc"
              rows={5}
              maxLength={2000}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              error={lead.fields?.message}
              hint="وضعیت بدنه، سرویس‌ها و ایرادهای احتمالی را بنویسید."
            />
            <div className="notice">
              <p>ثبت عکس در این نسخه غیرفعال است.</p>
              <p className="muted small">
                برای حفظ حریم خصوصی، دریافت عکس خودرو به پیگیری امن پس از تماس موکول می‌شود. این بخش را در مرحلهٔ
                بعدی با کارشناس هماهنگ کنید.
              </p>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="field-row">
              <TextField label="نام و نام خانوادگی" id="s-name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={100} required error={lead.fields?.name} />
              <TextField label="موبایل" id="s-phone" type="tel" inputMode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={form.phone} onChange={(e) => set('phone', e.target.value)} required error={lead.fields?.phone} />
            </div>
            <div className="review-box">
              <h3>بازبینی اطلاعات</h3>
              <ul>
                <li>{form.brand} {form.model} {form.trim}</li>
                <li>سال: {form.yearValue || 'ثبت‌نشده'} ({form.yearCalendar === 'jalali' ? 'شمسی' : 'میلادی'})</li>
                <li>کارکرد: {form.mileageKm || 'ثبت‌نشده'} کیلومتر</li>
                <li>شهر: {form.city || 'ثبت‌نشده'}</li>
                {form.priceToman && <li>قیمت پیشنهادی: {form.priceToman} تومان</li>}
              </ul>
            </div>
            <PrivacyCheckbox checked={form.privacy} onChange={(v) => set('privacy', v)} error={lead.fields?.privacy} />
            <FormMessage error={lead.error} />
          </>
        )}

        <div className="wizard-actions">
          {step > 1 && (
            <button type="button" className="btn btn-ghost" onClick={back}>مرحلهٔ قبل</button>
          )}
          {step < 4 ? (
            <button type="submit" className="btn btn-primary" disabled={step === 1 && !step1Ok}>مرحلهٔ بعد</button>
          ) : (
            <SubmitButton busy={lead.busy}>ثبت درخواست فروش</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}
