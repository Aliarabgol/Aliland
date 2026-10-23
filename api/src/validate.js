import { normalizePhone, toEnDigits, toInt } from './util.js';

const MAX_MESSAGE = 2000;
const MAX_NAME = 100;

function nameField(body, errors) {
  const name = String(body.name ?? '').trim();
  if (name.length < 2) errors.name = 'نام را کامل وارد کنید.';
  else if (name.length > MAX_NAME) errors.name = 'نام حداکثر ۱۰۰ نویسه است.';
  return name;
}

function phoneField(body, errors) {
  const phone = normalizePhone(body.phone);
  if (!phone) errors.phone = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).';
  return phone;
}

function messageField(body, field = 'message') {
  const raw = body[field] ?? body.description ?? '';
  const msg = String(raw).trim();
  if (msg.length > MAX_MESSAGE) return { error: `متن حداکثر ${MAX_MESSAGE} نویسه است.` };
  return { value: msg };
}

function privacyField(body, errors) {
  if (body.privacy !== true) errors.privacy = 'تأیید مطالعهٔ حریم خصوصی لازم است.';
}

function calendarField(body) {
  return body.yearCalendar === 'gregorian' ? 'gregorian' : body.yearCalendar === 'jalali' ? 'jalali' : null;
}

function dateField(body, errors, { required = false, future = false, field = 'preferredDate' } = {}) {
  const raw = String(body[field] ?? '').trim();
  if (!raw) {
    if (required) errors[field] = 'تاریخ را انتخاب کنید.';
    return null;
  }
  const value = toEnDigits(raw);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    errors[field] = 'تاریخ نامعتبر است.';
    return null;
  }
  const d = new Date(`${value}T00:00:00+03:30`);
  if (Number.isNaN(d.getTime())) {
    errors[field] = 'تاریخ نامعتبر است.';
    return null;
  }
  if (future) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) errors[field] = 'تاریخ باید امروز یا بعد از آن باشد.';
  }
  return value;
}

function budgetCheck(budgetMin, budgetMax, errors) {
  if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
    errors.budgetMax = 'حداکثر بودجه باید بیشتر از حداقل باشد.';
  }
}

/**
 * Server-side allowlist validation for every public lead type.
 * Only known fields are accepted; status/assigned_to/is_demo/price are never read.
 */
export function validateLead(type, body = {}) {
  const errors = {};

  if (type === 'viewing') {
    privacyField(body, errors);
    const vehicleId = toInt(body.vehicleId);
    if (!vehicleId) errors.vehicleId = 'خودرو را از فهرست انتخاب کنید.';
    const preferredDate = dateField(body, errors, { required: true, future: true });
    const msg = messageField(body);
    if (msg.error) errors.message = msg.error;
    return {
      errors,
      data: {
        vehicleId,
        name: nameField(body, errors),
        phone: phoneField(body, errors),
        preferredDate,
        preferredSlot: String(body.preferredSlot ?? '').trim().slice(0, 40),
        message: msg.value || '',
      },
    };
  }

  if (type === 'call') {
    const msg = messageField(body);
    if (msg.error) errors.message = msg.error;
    return {
      errors,
      data: {
        vehicleId: toInt(body.vehicleId),
        name: nameField(body, errors),
        phone: phoneField(body, errors),
        subject: String(body.subject ?? '').trim().slice(0, 120),
        callTime: String(body.callTime ?? '').trim().slice(0, 60),
        message: msg.value || '',
      },
    };
  }

  if (type === 'sell') {
    privacyField(body, errors);
    const brand = String(body.brand ?? '').trim();
    const model = String(body.model ?? '').trim();
    if (!brand) errors.brand = 'برند را وارد کنید.';
    if (!model) errors.model = 'مدل را وارد کنید.';
    if (brand.length > 60) errors.brand = 'برند حداکثر ۶۰ نویسه است.';
    if (model.length > 60) errors.model = 'مدل حداکثر ۶۰ نویسه است.';
    const yearValue = toInt(body.yearValue);
    const mileageKm = toInt(body.mileageKm);
    if (yearValue != null && (yearValue < 1300 || yearValue > 2100)) errors.yearValue = 'سال را درست وارد کنید.';
    if (mileageKm != null && (mileageKm < 0 || mileageKm > 2000000)) errors.mileageKm = 'کارکرد را درست وارد کنید.';
    const priceToman = toInt(body.priceToman);
    if (priceToman != null && priceToman < 0) errors.priceToman = 'قیمت نامعتبر است.';
    const msg = messageField(body);
    if (msg.error) errors.message = msg.error;
    return {
      errors,
      data: {
        name: nameField(body, errors),
        phone: phoneField(body, errors),
        brand,
        model,
        trim: String(body.trim ?? '').trim().slice(0, 60),
        yearValue,
        yearCalendar: calendarField(body),
        mileageKm,
        city: String(body.city ?? '').trim().slice(0, 60),
        bodyType: String(body.bodyType ?? '').trim().slice(0, 40),
        transmission: String(body.transmission ?? '').trim().slice(0, 40),
        fuelType: String(body.fuelType ?? '').trim().slice(0, 40),
        priceToman,
        description: msg.value || '',
      },
    };
  }

  if (type === 'request-car') {
    privacyField(body, errors);
    const budgetMin = toInt(body.budgetMin);
    const budgetMax = toInt(body.budgetMax);
    budgetCheck(budgetMin, budgetMax, errors);
    const maxMileage = toInt(body.maxMileage);
    if (maxMileage != null && maxMileage < 0) errors.maxMileage = 'کارکرد نامعتبر است.';
    const msg = messageField(body);
    if (msg.error) errors.message = msg.error;
    return {
      errors,
      data: {
        name: nameField(body, errors),
        phone: phoneField(body, errors),
        budgetMin,
        budgetMax,
        brandPref: String(body.brandPref ?? '').trim().slice(0, 120),
        yearValue: toInt(body.yearValue),
        yearCalendar: calendarField(body),
        maxMileage,
        bodyType: String(body.bodyType ?? '').trim().slice(0, 40),
        city: String(body.city ?? '').trim().slice(0, 60),
        purchaseMethod: String(body.purchaseMethod ?? '').trim().slice(0, 40),
        message: msg.value || '',
      },
    };
  }

  // contact
  privacyField(body, errors);
  const subject = String(body.subject ?? '').trim().slice(0, 120);
  if (!subject) errors.subject = 'موضوع را وارد کنید.';
  const msg = messageField(body);
  if (msg.error) errors.message = msg.error;
  if (type === 'contact' && (!msg.value || msg.value.length < 5)) errors.message = 'متن پیام را بنویسید.';
  return {
    errors,
    data: {
      name: nameField(body, errors),
      phone: phoneField(body, errors),
      subject,
      message: msg.value || '',
    },
  };
}
