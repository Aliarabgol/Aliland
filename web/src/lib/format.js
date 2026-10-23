export const faNum = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('fa-IR');
};

export const toman = (value) => (value == null ? null : `${faNum(value)} تومان`);

export const priceLabel = (vehicle) => {
  if (!vehicle) return '—';
  if (vehicle.priceMode === 'on_request' || vehicle.price == null) return 'تماس برای قیمت';
  return toman(vehicle.price);
};

export const mileageLabel = (km) => (km == null ? 'ثبت نشده' : `${faNum(km)} کیلومتر`);

export const yearLabel = (year, calendar) => {
  if (!year) return 'ثبت نشده';
  const cal = calendar === 'gregorian' ? 'میلادی' : calendar === 'jalali' ? 'شمسی' : '';
  return cal ? `${faNum(year)} ${cal}` : faNum(year);
};

const dateFmt = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' });

export const dateLabel = (value) => {
  if (!value) return 'ثبت نشده';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'ثبت نشده';
  return dateFmt.format(d);
};

export const lifecycleLabels = {
  available: 'موجود',
  reserved: 'رزرو شده',
  sold: 'فروخته شده',
  withdrawn: 'خارج شده',
  draft: 'پیش‌نویس',
};

export const leadTypeLabels = {
  viewing: 'درخواست بازدید',
  call: 'درخواست تماس',
  sell: 'درخواست فروش',
  'request-car': 'درخواست خودرو',
  contact: 'پیام تماس',
};

export const leadStatusLabels = {
  new: 'جدید',
  contacted: 'تماس گرفته شده',
  scheduled: 'هماهنگ شده',
  won: 'موفق',
  lost: 'ناموفق',
  closed: 'بسته',
};

export const isPubliclyAvailable = (vehicle) =>
  vehicle && (vehicle.lifecycle === 'available' || vehicle.lifecycle === 'reserved');
