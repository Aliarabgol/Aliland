import bcrypt from 'bcryptjs';
import { pool, q, ensureSchema } from './db.js';
import { normalizeFa } from './util.js';

const searchOf = (v) =>
  normalizeFa(
    [v.brand, v.model, v.trim, v.title, v.description, v.city, (v.verified_options || []).join(' '), (v.disclosed_defects || []).join(' ')].join(' '),
  ).toLowerCase();

const VEHICLES = [
  {
    public_code: 'CS-1001', slug: 'peugeot-207-1399', title: 'پژو ۲۰۷ اتوماتیک پانوراما',
    brand: 'پژو', model: '۲۰۷', trim: 'اتوماتیک پانوراما', year_value: 1399, year_calendar: 'jalali',
    mileage_km: 62000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'سفید', interior_color: 'مشکی', engine_cc: 1600, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، جاده مخصوص کرج، نمایشگاه نمونه',
    price_toman: 785000000, price_mode: 'fixed', price_confirmed_at: '2026-10-20',
    description: 'پژو ۲۰۷ اتوماتیک با سانروف پانوراما، بیمه کامل و سرویس‌های دوره‌ای ثبت‌شده. بازدید حضوری با هماهنگی.',
    verified_options: ['سانروف پانوراما', 'دوربین دنده عقب', 'کروز کنترل', 'رینگ اسپرت'],
    disclosed_defects: [], featured: true, lifecycle_status: 'available', publication_status: 'published',
    inspection: {
      inspected_at: '2026-10-12', inspector_display_name: 'کارشناس نمایشگاه',
      summary: 'بدنه سالم، بدون رنگ، فنی بررسی‌شده و آمادهٔ بازدید.',
      body_parts: { kaput: 'ok', roof: 'ok', front_door_r: 'ok', front_door_l: 'ok', rear_door_r: 'ok', rear_door_l: 'ok', fender_r: 'ok', fender_l: 'ok', trunk: 'ok', bumper_f: 'ok', bumper_r: 'ok' },
      chassis: 'سالم', mechanical: 'سالم', equipment: 'بررسی شد', tires: '۷۰٪', documents: 'بررسی شد',
      approval_status: 'approved', is_public: true,
    },
  },
  {
    public_code: 'CS-1002', slug: 'peugeot-206-1397', title: 'پژو ۲۰۶ تیپ ۲',
    brand: 'پژو', model: '۲۰۶', trim: 'تیپ ۲', year_value: 1397, year_calendar: 'jalali',
    mileage_km: 98000, body_type: 'هاچ‌بک', fuel_type: 'بنزین', transmission: 'دنده‌ای',
    exterior_color: 'نقره‌ای', interior_color: 'طوسی', engine_cc: 1400, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، بزرگراه آزادگان',
    price_toman: 540000000, price_mode: 'fixed', price_confirmed_at: '2026-10-18',
    description: 'پژو ۲۰۶ تیپ ۲ با موتور سالم و بدنهٔ یکدست. مناسب مصرف روزانه.',
    verified_options: ['کولر', 'شیشه بالابر برقی'], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'published',
  },
  {
    public_code: 'CS-1003', slug: 'dena-plus-1401', title: 'دنا پلاس توربو اتوماتیک',
    brand: 'ایران‌خودرو', model: 'دنا پلاس', trim: 'توربو اتوماتیک', year_value: 1401, year_calendar: 'jalali',
    mileage_km: 41000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'مشکی', interior_color: 'مشکی', engine_cc: 1700, drivetrain: 'دیفرانسیل جلو',
    city: 'کرج', public_viewing_location: 'کرج، بلوار طالقانی',
    price_toman: 950000000, price_mode: 'fixed', price_confirmed_at: '2026-10-21',
    description: 'دنا پلاس توربو اتوماتیک، کارکرد کم و تحت گارانتی. یک مالک.',
    verified_options: ['گیربکس اتوماتیک', 'ترمز ABS', 'ایربگ'], disclosed_defects: [],
    featured: true, lifecycle_status: 'available', publication_status: 'published',
    inspection: {
      inspected_at: '2026-10-15', inspector_display_name: 'کارشناس نمایشگاه',
      summary: 'خودروی کم‌کارکرد با بدنهٔ سالم و بدون خط و خش.',
      body_parts: { kaput: 'ok', roof: 'ok', front_door_r: 'ok', front_door_l: 'ok', rear_door_r: 'ok', rear_door_l: 'ok', fender_r: 'ok', fender_l: 'ok', trunk: 'ok', bumper_f: 'ok', bumper_r: 'ok' },
      chassis: 'سالم', mechanical: 'سالم', equipment: 'بررسی شد', tires: '۸۵٪', documents: 'بررسی شد',
      approval_status: 'approved', is_public: true,
    },
  },
  {
    public_code: 'CS-1004', slug: 'shahin-g-1402', title: 'شاهین G دنده‌ای',
    brand: 'سایپا', model: 'شاهین', trim: 'G', year_value: 1402, year_calendar: 'jalali',
    mileage_km: 28000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'دنده‌ای',
    exterior_color: 'سفید', interior_color: 'مشکی', engine_cc: 1500, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، میدان آزادی',
    price_toman: 720000000, price_mode: 'fixed', price_confirmed_at: '2026-10-19',
    description: 'شاهین G با کارکرد کم، بیمهٔ بدنه و سرویس اولیه انجام‌شده.',
    verified_options: ['نمایشگر لمسی', 'دوربین عقب'], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'published',
  },
  {
    public_code: 'CS-1005', slug: 'tara-automatic-1403', title: 'تارا اتوماتیک',
    brand: 'ایران‌خودرو', model: 'تارا', trim: 'اتوماتیک', year_value: 1403, year_calendar: 'jalali',
    mileage_km: 15000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'خاکستری', interior_color: 'مشکی', engine_cc: 1600, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، جاده مخصوص',
    price_toman: 1150000000, price_mode: 'fixed', price_confirmed_at: '2026-10-22',
    description: 'تارا اتوماتیک صفرکیلومتر محسوب می‌شود؛ کارکرد بسیار کم و بدون ایراد.',
    verified_options: ['گیربکس اتوماتیک', 'کروز کنترل', 'سانروف'], disclosed_defects: [],
    featured: true, lifecycle_status: 'available', publication_status: 'published',
    inspection: {
      inspected_at: '2026-10-18', inspector_display_name: 'کارشناس نمایشگاه',
      summary: 'خودروی نزدیك به نو، تمام قطعات اصلی و بدون گزارش ایراد.',
      body_parts: { kaput: 'ok', roof: 'ok', front_door_r: 'ok', front_door_l: 'ok', rear_door_r: 'ok', rear_door_l: 'ok', fender_r: 'ok', fender_l: 'ok', trunk: 'ok', bumper_f: 'ok', bumper_r: 'ok' },
      chassis: 'سالم', mechanical: 'سالم', equipment: 'بررسی شد', tires: '۹۵٪', documents: 'بررسی شد',
      approval_status: 'approved', is_public: true,
    },
  },
  {
    public_code: 'CS-1006', slug: 'saina-s-1400', title: 'ساینا S دنده‌ای',
    brand: 'سایپا', model: 'ساینا', trim: 'S', year_value: 1400, year_calendar: 'jalali',
    mileage_km: 73000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'دنده‌ای',
    exterior_color: 'آبی', interior_color: 'طوسی', engine_cc: 1500, drivetrain: 'دیفرانسیل جلو',
    city: 'اصفهان', public_viewing_location: 'اصفهان، خیابان امام خمینی',
    price_toman: 420000000, price_mode: 'fixed', price_confirmed_at: '2026-10-16',
    description: 'ساینا S اقتصادی با مصرف سوخت پایین و بدنهٔ سالم.',
    verified_options: ['کولر', 'ایربگ'], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'published',
  },
  {
    public_code: 'CS-1007', slug: 'quick-r-1401', title: 'کوییک R دنده‌ای',
    brand: 'سایپا', model: 'کوییک', trim: 'R', year_value: 1401, year_calendar: 'jalali',
    mileage_km: 51000, body_type: 'هاچ‌بک', fuel_type: 'بنزین', transmission: 'دنده‌ای',
    exterior_color: 'قرمز', interior_color: 'مشکی', engine_cc: 1500, drivetrain: 'دیفرانسیل جلو',
    city: 'شیراز', public_viewing_location: 'شیراز، بلوار زند',
    price_toman: 465000000, price_mode: 'fixed', price_confirmed_at: '2026-10-17',
    description: 'کوییک R با کارکرد متوسط، لاستیک‌های نو و بیمهٔ معتبر.',
    verified_options: ['کولر', 'شیشه بالابر برقی'], disclosed_defects: ['خط و خش جزئی روی سپر عقب'],
    featured: false, lifecycle_status: 'available', publication_status: 'published',
  },
  {
    public_code: 'CS-1008', slug: 'haima-s7-1399', title: 'هایما S7 توربو',
    brand: 'هایما', model: 'S7', trim: 'توربو', year_value: 1399, year_calendar: 'jalali',
    mileage_km: 88000, body_type: 'شاسی‌بلند', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'سفید', interior_color: 'بژ', engine_cc: 1800, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، شهرک غرب',
    price_toman: null, price_mode: 'on_request', price_confirmed_at: null,
    description: 'هایما S7 توربو، شاسی‌بلند خانوادگی. برای قیمت با نمایشگاه تماس بگیرید.',
    verified_options: ['گیربکس اتوماتیک', 'سانروف', 'صندلی برقی'], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'published',
  },
  {
    public_code: 'CS-1009', slug: 'kia-cerato-1398', title: 'کیا سراتو اتوماتیک',
    brand: 'کیا', model: 'سراتو', trim: 'اتوماتیک', year_value: 1398, year_calendar: 'jalali',
    mileage_km: 105000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'مشکی', interior_color: 'مشکی', engine_cc: 2000, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، جاده مخصوص',
    price_toman: 1450000000, price_mode: 'fixed', price_confirmed_at: '2026-10-14',
    description: 'کیا سراتو با کارکرد ثبت‌شده. یک گلگیر رنگ دارد؛ در گزارش کارشناسی جزئیات آمده است.',
    verified_options: ['گیربکس اتوماتیک', 'کروز کنترل', 'دوربین عقب'], disclosed_defects: ['گلگیر جلو راست رنگ‌شده'],
    featured: false, lifecycle_status: 'reserved', publication_status: 'published',
    inspection: {
      inspected_at: '2026-10-10', inspector_display_name: 'کارشناس نمایشگاه',
      summary: 'فنی سالم؛ گلگیر جلو راست رنگ شده است. سایر قطعات بدنه اصلی است.',
      body_parts: { kaput: 'ok', roof: 'ok', front_door_r: 'ok', front_door_l: 'ok', rear_door_r: 'ok', rear_door_l: 'ok', fender_r: 'painted', fender_l: 'ok', trunk: 'ok', bumper_f: 'ok', bumper_r: 'ok' },
      chassis: 'سالم', mechanical: 'سالم', equipment: 'بررسی شد', tires: '۶۰٪', documents: 'بررسی شد',
      approval_status: 'approved', is_public: true,
    },
  },
  {
    public_code: 'CS-1010', slug: 'toyota-corolla-2018', title: 'تویوتا کرولا ۲۰۱۸',
    brand: 'تویوتا', model: 'کرولا', trim: 'LE', year_value: 2018, year_calendar: 'gregorian',
    mileage_km: 120000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'سفید', interior_color: 'مشکی', engine_cc: 1800, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، سعادت‌آباد',
    price_toman: 2900000000, price_mode: 'fixed', price_confirmed_at: '2026-10-13',
    description: 'تویوتا کرولا ۲۰۱۸ وارداتی، بدنهٔ سالم و سرویس کامل. سال به تقویم میلادی ثبت شده است.',
    verified_options: ['گیربکس اتوماتیک', 'کروز کنترل', 'دوربین عقب'], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'published',
  },
  {
    public_code: 'CS-1011', slug: 'kia-sportage-2017', title: 'کیا اسپورتیج ۲۰۱۷',
    brand: 'کیا', model: 'اسپورتیج', trim: 'EX', year_value: 2017, year_calendar: 'gregorian',
    mileage_km: 160000, body_type: 'شاسی‌بلند', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'خاکستری', interior_color: 'مشکی', engine_cc: 2000, drivetrain: 'دیفرانسیل جلو',
    city: 'تهران', public_viewing_location: 'تهران، جاده مخصوص',
    price_toman: 4200000000, price_mode: 'fixed', price_confirmed_at: '2026-10-05',
    description: 'این خودرو فروخته شده است و برای مرجع در فهرست نمایش داده می‌شود.',
    verified_options: ['گیربکس اتوماتیک', 'سانروف'], disclosed_defects: [],
    featured: false, lifecycle_status: 'sold', publication_status: 'published',
  },
  {
    public_code: 'CS-1012', slug: 'renault-l90-1398', title: 'رنو ال۹۰',
    brand: 'رنو', model: 'ال۹۰', trim: 'دنده‌ای', year_value: 1398, year_calendar: 'jalali',
    mileage_km: 140000, body_type: 'هاچ‌بک', fuel_type: 'بنزین', transmission: 'دنده‌ای',
    exterior_color: 'سفید', interior_color: 'طوسی', engine_cc: 1600, drivetrain: 'دیفرانسیل جلو',
    city: 'مشهد', public_viewing_location: '—',
    price_toman: 380000000, price_mode: 'fixed', price_confirmed_at: '2026-09-20',
    description: 'این خودرو از موجودی خارج شده است.',
    verified_options: ['کولر'], disclosed_defects: [],
    featured: false, lifecycle_status: 'withdrawn', publication_status: 'published',
  },
  {
    public_code: 'CS-1101', slug: 'peugeot-pars-draft', title: 'پژو پارس (پیش‌نویس داخلی)',
    brand: 'پژو', model: 'پارس', trim: 'ELX', year_value: 1400, year_calendar: 'jalali',
    mileage_km: 90000, body_type: 'سدان', fuel_type: 'بنزین', transmission: 'دنده‌ای',
    exterior_color: 'سفید', city: 'تهران', price_toman: 560000000, price_mode: 'fixed',
    description: 'رکورد آزمایشی پیش‌نویس؛ نباید در سایت عمومی دیده شود.', verified_options: [], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'draft',
  },
  {
    public_code: 'CS-1102', slug: 'chery-tiggo8-pending', title: 'چری تیگو ۸ (در انتظار بازبینی)',
    brand: 'چری', model: 'تیگو ۸', trim: 'پرو', year_value: 1402, year_calendar: 'jalali',
    mileage_km: 30000, body_type: 'شاسی‌بلند', fuel_type: 'بنزین', transmission: 'اتوماتیک',
    exterior_color: 'مشکی', city: 'تهران', price_mode: 'on_request',
    description: 'رکورد آزمایشی در انتظار بازبینی؛ نباید عمومی شود.', verified_options: [], disclosed_defects: [],
    featured: false, lifecycle_status: 'available', publication_status: 'pending_review',
  },
];

const ARTICLES = [
  {
    slug: 'visit-preparation',
    title: 'آمادگی برای بازدید خودرو: چک‌لیست کوتاه',
    excerpt: 'پیش از مراجعه به نمایشگاه، این نکات را در نظر بگیرید تا بازدید مؤثرتری داشته باشید.',
    body_md:
      'بازدید حضوری بهترین راه برای سنجش واقعی وضعیت خودرو است.\n\n' +
      '۱) مدارک و تاریخچهٔ سرویس را بخواهید.\n' +
      '۲) در نور روز و روی سطح صاف خودرو را ببینید.\n' +
      '۳) وضعیت لاستیک‌ها، شیشه‌ها و خط و خش بدنه را بررسی کنید.\n' +
      '۴) در صورت امکان، تست رانندگی کوتاه انجام دهید.\n\n' +
      'اگر کارشناسی مستقل فعال باشد، می‌توانید گزارش آن را جداگانه درخواست کنید. این مقاله جایگزین کارشناسی فنی نیست.',
  },
  {
    slug: 'reading-inspection-report',
    title: 'چگونه گزارش کارشناسی خودرو را بخوانیم',
    excerpt: 'بخش‌های بدنه، شاسی، فنی و مدارک را چطور تفسیر کنیم؟',
    body_md:
      'گزارش کارشناسی چند بخش دارد: بدنه، شاسی، فنی، تجهیزات، لاستیک و مدارک.\n\n' +
      'وضعیت «بررسی‌نشده» با «سالم» یکی نیست. اگر بخشی بررسی نشده باشد، نباید آن را سالم فرض کرد.\n\n' +
      'در نمودار بدنه، وضعیت هر قطعه جدا مشخص می‌شود: بررسی‌نشده، بدون ایراد، رنگ‌شده، تعویض‌شده و آسیب‌دیده.\n\n' +
      'گزارش عمومی نسخهٔ پاک‌سازی‌شده است و اطلاعات هویتی مالک در آن نمایش داده نمی‌شود.',
  },
  {
    slug: 'same-budget-comparison',
    title: 'مقایسهٔ خودروهای هم‌بودجه',
    excerpt: 'چطور بین چند گزینه در یک بازهٔ قیمتی انتخاب کنیم؟',
    body_md:
      'برای مقایسهٔ منصفانه، کارکرد، سال، وضعیت بدنه و هزینهٔ نگهداری را کنار هم بگذارید.\n\n' +
      'در صفحهٔ مقایسه می‌توانید حداکثر سه خودرو را کنار هم ببینید. اگر قیمت یک خودرو «تماس برای قیمت» باشد، آن را صفر در نظر نگیرید.\n\n' +
      'سال شمسی و میلادی را بدون تبدیل دقیق با هم مقایسه نکنید.',
  },
];

const DEFAULT_SETTINGS = {
  name: 'نام نمایشگاه',
  shortDescription: 'خرید و فروش خودرو با بازدید حضوری و شفافیت در مشخصات',
  city: 'تهران',
  address: '',
  phone: '',
  whatsapp: '',
  telegram: '',
  instagram: '',
  contactEmail: '',
  hours: 'شنبه تا پنجشنبه، ۹ تا ۱۸',
  heroTitle: 'خودروی بعدی تو',
  heroSubtitle: 'خودروها را بررسی کن؛ برای بازدید هماهنگ کنیم.',
  terms: 'این متن پیش‌نویس است و تا بازبینی مالک، سند حقوقی قطعی محسوب نمی‌شود.',
  features: {
    installments: false,
    tradeIn: false,
    warranty: false,
    testDrive: false,
    independentInspection: false,
    bookingDeposit: false,
    sms: false,
    threeD: false,
  },
};

async function insertVehicle(v) {
  const { rows } = await q(
    `INSERT INTO vehicles (
      public_code, slug, title, brand, model, trim, year_value, year_calendar, mileage_km,
      body_type, fuel_type, transmission, exterior_color, interior_color, engine_cc, drivetrain,
      city, public_viewing_location, price_toman, price_mode, price_confirmed_at, description,
      verified_options, disclosed_defects, cover_media_url, search_text, featured, is_demo,
      lifecycle_status, publication_status, seo_title, seo_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
      $23,$24,$25,$26,$27,$28,$29,$30,$31,$32
    ) ON CONFLICT (slug) DO NOTHING RETURNING id`,
    [
      v.public_code, v.slug, v.title, v.brand, v.model, v.trim || null, v.year_value || null,
      v.year_calendar || null, v.mileage_km ?? null, v.body_type || null, v.fuel_type || null,
      v.transmission || null, v.exterior_color || null, v.interior_color || null, v.engine_cc ?? null,
      v.drivetrain || null, v.city || null, v.public_viewing_location || null,
      v.price_toman ?? null, v.price_mode || 'fixed', v.price_confirmed_at || null,
      v.description || null, JSON.stringify(v.verified_options || []), JSON.stringify(v.disclosed_defects || []),
      v.cover_media_url || null, searchOf(v), !!v.featured, true,
      v.lifecycle_status || 'available', v.publication_status || 'draft',
      `${v.title} | ${DEFAULT_SETTINGS.name}`, v.description ? v.description.slice(0, 155) : null,
    ],
  );
  const id = rows[0]?.id;
  if (!id) return null;

  await q(
    `INSERT INTO vehicle_private (vehicle_id, collaboration_type, internal_note)
     VALUES ($1, $2, $3) ON CONFLICT (vehicle_id) DO NOTHING`,
    [id, 'نمایشگاهی', 'رکورد نمونه (demo) برای آزمون.'],
  );

  if (v.inspection) {
    const i = v.inspection;
    await q(
      `INSERT INTO inspection_reports (
        vehicle_id, inspected_at, inspector_display_name, summary, body_parts, chassis,
        mechanical, equipment, tires, documents, approval_status, is_public
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (vehicle_id) DO NOTHING`,
      [id, i.inspected_at, i.inspector_display_name, i.summary, i.body_parts, i.chassis,
        i.mechanical, i.equipment, i.tires, i.documents, i.approval_status, i.is_public],
    );
  }
  return id;
}

export async function seed({ log = console.log } = {}) {
  await ensureSchema();

  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || 'admin@showroom.local').toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin1234';
  const salesEmail = 'sales@showroom.local';
  const salesPassword = 'sales1234';

  const staff = [
    { name: 'مدیر نمایشگاه', email: adminEmail, password: adminPassword, role: 'admin' },
    { name: 'کارشناس فروش', email: salesEmail, password: salesPassword, role: 'sales' },
  ];
  for (const s of staff) {
    const hash = await bcrypt.hash(s.password, 10);
    await q(
      `INSERT INTO staff (name, email, password_hash, role)
       VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
      [s.name, s.email, hash, s.role],
    );
  }

  const { rows: countRows } = await q('SELECT COUNT(*)::int AS n FROM vehicles');
  if (countRows[0].n === 0) {
    for (const v of VEHICLES) await insertVehicle(v);
    log(`[seed] inserted ${VEHICLES.length} demo vehicles`);
  } else {
    log('[seed] vehicles already exist — skipped');
  }

  for (const a of ARTICLES) {
    await q(
      `INSERT INTO articles (slug, title, excerpt, body_md, is_published, published_at, is_demo)
       VALUES ($1,$2,$3,$4,true,now(),true) ON CONFLICT (slug) DO NOTHING`,
      [a.slug, a.title, a.excerpt, a.body_md],
    );
  }

  await q(
    `INSERT INTO settings (id, data, mode) VALUES (1, $1, 'demo')
     ON CONFLICT (id) DO NOTHING`,
    [DEFAULT_SETTINGS],
  );
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed()
    .then(() => {
      console.log('[seed] done');
      return pool.end();
    })
    .catch((err) => {
      console.error('[seed] failed', err);
      process.exit(1);
    });
}
