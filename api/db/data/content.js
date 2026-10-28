// Editable site content: homepage sections, FAQs, settings, media records and
// a handful of SYNTHETIC partnership examples (clearly marked synthetic).

export const siteSections = [
  {
    key: 'hero',
    label: 'Hero / showroom',
    title_fa: 'خودروی بعدی، انتخابی دقیق‌تر',
    title_en: 'Your next car, a more exact choice',
    subtitle_fa:
      'از میان خودروهای داخلی، وارداتی و مونتاژی انتخاب کن، مشخصات را کنار هم ببین و مسیر خرید را آگاهانه‌تر پیش ببر.',
    subtitle_en:
      'Explore domestic, imported and locally assembled cars, compare specifications side by side, and move towards a decision you can explain.',
    cta_label_fa: 'دیدن فهرست خودروها',
    cta_label_en: 'Browse the catalogue',
    cta_href: '/vehicles',
    visible: true,
    sort_weight: 0,
  },
  {
    key: 'intro',
    label: 'Brand introduction',
    title_fa: 'یک نمایشگاه، بدون عجله',
    title_en: 'A showroom without pressure',
    subtitle_fa:
      'علی‌لند برای لحظه‌ای ساخته شده که هنوز تصمیم نگرفته‌اید: وقتی می‌خواهید بدانید تفاوت‌ها کجاست، نه اینکه کدام خودرو را بخرید.',
    subtitle_en:
      'AliLand is built for the moment before the decision — when you want to know where the differences are, not which car to buy.',
    cta_label_fa: 'درباره علی‌لند',
    cta_label_en: 'About AliLand',
    cta_href: '/about',
    visible: true,
    sort_weight: 1,
  },
  {
    key: 'discovery',
    label: 'Search / discovery',
    title_fa: 'از کجا شروع کنیم؟',
    title_en: 'Where do we start?',
    subtitle_fa:
      'سه مسیر برای ورود به فهرست: دسته‌بندی خودرو، بازه قیمت، یا نیاز روزمره شما.',
    subtitle_en:
      'Three ways into the catalogue: by category, by price band, or by what you actually need it to do.',
    cta_label_fa: 'فهرست کامل',
    cta_label_en: 'Full catalogue',
    cta_href: '/vehicles',
    visible: true,
    sort_weight: 2,
  },
  {
    key: 'featured',
    label: 'Featured vehicles',
    title_fa: 'انتخاب‌های این هفته',
    title_en: 'This week’s picks',
    subtitle_fa:
      'شش خودرو از سه دسته، انتخاب‌شده برای نشان دادن تفاوت‌ها — نه برای فروش.',
    subtitle_en:
      'Six cars across three categories, chosen to show the differences — not to sell them.',
    cta_label_fa: 'همه خودروها',
    cta_label_en: 'All vehicles',
    cta_href: '/vehicles',
    visible: true,
    sort_weight: 3,
  },
  {
    key: 'finder',
    label: 'Personalised finder',
    title_fa: 'نمی‌دانید از کجا شروع کنید؟',
    title_en: 'Not sure where to begin?',
    subtitle_fa:
      'به سه سؤال کوتاه جواب بدهید تا فهرست بر اساس کاربری و بودجه شما مرتب شود.',
    subtitle_en:
      'Answer three short questions and the catalogue reorders around your budget and usage.',
    cta_label_fa: 'شروع خودرویاب',
    cta_label_en: 'Start the finder',
    cta_href: '/services/finder',
    visible: true,
    sort_weight: 4,
  },
  {
    key: 'services',
    label: 'Services showcase',
    title_fa: 'خدمات، همان‌جایی که تصمیم سخت می‌شود',
    title_en: 'Services where the decision gets hard',
    subtitle_fa:
      'از کارشناسی و قیمت‌گذاری تا معاوضه و خرید اقساطی؛ هر خدمت یک مسئله مشخص را هدف گرفته است.',
    subtitle_en:
      'From inspection and valuation to trade-in and instalments — each service targets one specific problem.',
    cta_label_fa: 'همه خدمات',
    cta_label_en: 'All services',
    cta_href: '/services',
    visible: true,
    sort_weight: 5,
  },
  {
    key: 'journey',
    label: 'Buy / sell journeys',
    title_fa: 'دو مسیر، یک استاندارد',
    title_en: 'Two paths, one standard',
    subtitle_fa:
      'خرید و فروش دو روی یک تصمیم‌اند؛ در هر دو، اطلاعات دقیق مهم‌تر از تبلیغ است.',
    subtitle_en:
      'Buying and selling are two sides of the same decision; in both, accurate information beats promotion.',
    cta_label_fa: 'فروش خودرو',
    cta_label_en: 'Sell a car',
    cta_href: '/sell',
    visible: true,
    sort_weight: 6,
  },
  {
    key: 'inspection',
    label: 'Inspection & valuation',
    title_fa: 'آنچه از روی عکس دیده نمی‌شود',
    title_en: 'What a photo cannot show',
    subtitle_fa:
      'یک خودرو در عکس بی‌نقص است و در بازدید، سه مورد اصلاح رنگ دارد. کارشناسی برای همین فاصله است.',
    subtitle_en:
      'A car looks flawless in photos and has three repainted panels in person. Inspection exists for that gap.',
    cta_label_fa: 'ساختار کارشناسی',
    cta_label_en: 'How inspection works',
    cta_href: '/services/inspection',
    visible: true,
    sort_weight: 7,
  },
  {
    key: 'finance',
    label: 'Trade-in & instalments',
    title_fa: 'تفاوت دو عدد',
    title_en: 'The difference between two numbers',
    subtitle_fa:
      'در معاوضه، عدد نهایی مهم نیست؛ فاصله بین خودروی فعلی و خودروی بعدی مهم است.',
    subtitle_en:
      'In a trade-in the headline price is not the point; the gap between your car and the next one is.',
    cta_label_fa: 'محاسبه تفاوت',
    cta_label_en: 'Work out the gap',
    cta_href: '/services/trade-in',
    visible: true,
    sort_weight: 8,
  },
  {
    key: 'partnership',
    label: 'Partnership',
    title_fa: 'همکاری با علی‌لند',
    title_en: 'Work with AliLand',
    subtitle_fa:
      'نمایشگاه‌ها، کارشناسان، عکاسان و شرکت‌های خدمات خودرو؛ چارچوب همکاری برای هر گروه متفاوت است.',
    subtitle_en:
      'Dealers, inspectors, photographers and service companies — the collaboration model differs for each group.',
    cta_label_fa: 'درخواست همکاری',
    cta_label_en: 'Partnership application',
    cta_href: '/partnership',
    visible: true,
    sort_weight: 9,
  },
  {
    key: 'founder',
    label: 'Founder story',
    title_fa: 'داستان علی‌لند',
    title_en: 'The AliLand story',
    subtitle_fa:
      'یک ایده ساده: اطلاعات درست، پیش از پول. این بخش درباره علی عربگل و نگاه او به این ایده است.',
    subtitle_en:
      'A simple idea: the right information before money changes hands. This section is about Ali Arabgol and that idea.',
    cta_label_fa: 'درباره بنیان‌گذار',
    cta_label_en: 'About the founder',
    cta_href: '/founder',
    visible: true,
    sort_weight: 10,
  },
  {
    key: 'journal',
    label: 'Journal',
    title_fa: 'مجله علی‌لند',
    title_en: 'The AliLand journal',
    subtitle_fa:
      'راهنماها و آموزش‌هایی که در جدول مشخصات پیدا نمی‌شوند؛ هزینه نگهداری، بازدید و انتخاب.',
    subtitle_en:
      'Guides the spec sheet cannot hold: running costs, viewings and choice.',
    cta_label_fa: 'همه مقالات',
    cta_label_en: 'All articles',
    cta_href: '/journal',
    visible: true,
    sort_weight: 11,
  },
  {
    key: 'faq',
    label: 'FAQ',
    title_fa: 'پرسش‌های رایج',
    title_en: 'Common questions',
    subtitle_fa:
      'درباره اینکه این نسخه چه چیزی هست و چه چیزی نیست.',
    subtitle_en: 'About what this build is — and what it is not.',
    cta_label_fa: 'همه پرسش‌ها',
    cta_label_en: 'All questions',
    cta_href: '/faq',
    visible: true,
    sort_weight: 12,
  },
  {
    key: 'final_cta',
    label: 'Final CTA',
    title_fa: 'آماده‌اید مسیر را دقیق‌تر کنید؟',
    title_en: 'Ready to make the path more exact?',
    subtitle_fa:
      'فهرست را ببینید، دو یا سه خودرو را کنار هم بگذارید و بعد تصمیم بگیرید.',
    subtitle_en:
      'Browse the catalogue, put two or three cars side by side, then decide.',
    cta_label_fa: 'شروع از فهرست خودروها',
    cta_label_en: 'Start with the catalogue',
    cta_href: '/vehicles',
    visible: true,
    sort_weight: 13,
  },
];

export const faqs = [
  {
    question_fa: 'این سایت یک نمایشگاه واقعی است؟',
    question_en: 'Is this a real dealership?',
    answer_fa:
      'نه. علی‌لند در این نسخه یک نمونه کار (پرتفولیو) است. هیچ خودرویی برای فروش وجود ندارد، هیچ قیمتی واقعی نیست و هیچ خدماتی ارائه نمی‌شود.',
    answer_en:
      'No. In this version AliLand is a portfolio concept. No vehicle is for sale, no price is real, and no service is delivered.',
    group: 'general',
    sort_weight: 1,
  },
  {
    question_fa: 'داده‌های خودروها از کجا آمده‌اند؟',
    question_en: 'Where does the vehicle data come from?',
    answer_fa:
      'همه آگهی‌ها داده نمونه و ساختگی‌اند. مشخصات برای واقع‌گرایی نوشته شده‌اند اما مرجع فنی نیستند؛ قیمت‌ها، کارکردها و وضعیت‌ها کاملاً فرضی هستند.',
    answer_en:
      'Every listing is synthetic sample data. Specifications are written to feel realistic but are not a technical reference; prices, mileage and conditions are entirely fictional.',
    group: 'general',
    sort_weight: 2,
  },
  {
    question_fa: 'تصاویر خودروها عکس واقعی است؟',
    question_en: 'Are the vehicle images real photographs?',
    answer_fa:
      'نه. تصاویر، طرح‌های مفهومی تولیدشده با گرافیک برداری هستند و روی خود صفحه به همین شکل برچسب‌گذاری شده‌اند. هیچ عکسی از منابع غیرمجاز یا بدون اجازه استفاده نشده است.',
    answer_en:
      'No. The images are concept artwork generated as vector graphics and labelled as such on the page. No unlicensed or uncredited photography is used.',
    group: 'media',
    sort_weight: 3,
  },
  {
    question_fa: 'می‌توانم در این نسخه محتوا را ویرایش کنم؟',
    question_en: 'Can I edit content in this version?',
    answer_fa:
      'بله. پنل مدیریت با ورود محافظت‌شده در دسترس است و تغییرات در پایگاه داده ذخیره می‌شوند. مجوزها در سطح سرور بررسی می‌شوند، نه فقط در رابط کاربری.',
    answer_en:
      'Yes. An authenticated admin panel is available and changes are stored in the database. Permissions are enforced on the server, not only in the interface.',
    group: 'admin',
    sort_weight: 4,
  },
  {
    question_fa: 'آیا فرم‌ها اطلاعات من را ارسال می‌کنند؟',
    question_en: 'Do the forms send my information?',
    answer_fa:
      'فرم‌های فروش خودرو، همکاری و تماس در حالت نمایشی اجرا می‌شوند. صفحه پیش از تأیید، وضعیت شبیه‌سازی را به شما می‌گوید و هیچ ایمیل یا پیامکی ارسال نمی‌شود.',
    answer_en:
      'The sell, partnership and contact forms run in demo mode. The page states the simulated status before you confirm, and no email or SMS is sent.',
    group: 'forms',
    sort_weight: 5,
  },
  {
    question_fa: 'چرا شماره تماسی وجود ندارد؟',
    question_en: 'Why is there no contact number?',
    answer_fa:
      'عمداً هیچ شماره تلفنی در این نسخه نمایش داده نمی‌شود و شماره واقعی مالک در هیچ‌کجای سایت، داده یا ترجمه‌ها قرار ندارد.',
    answer_en:
      'Deliberately, no phone number appears in this build, and the owner’s real number is not present anywhere in the site, data or translations.',
    group: 'general',
    sort_weight: 6,
  },
  {
    question_fa: 'آیا سایت از حالت کاهش حرکت پشتیبانی می‌کند؟',
    question_en: 'Does the site respect reduced motion?',
    answer_fa:
      'بله. اگر سیستم‌عامل شما «کاهش حرکت» را فعال کرده باشد، صحنه سینمایی و انیمیشن‌های اسکرول ساده می‌شوند و هیچ محتوایی پنهان نمی‌ماند.',
    answer_en:
      'Yes. If your operating system requests reduced motion, the cinematic scene and scroll animations simplify, and no content stays hidden.',
    group: 'accessibility',
    sort_weight: 7,
  },
  {
    question_fa: 'چرا بعضی خودروها در فهرست نیستند؟',
    question_en: 'Why are some vehicles missing from the catalogue?',
    answer_fa:
      'برخی آگهی‌ها در وضعیت «پیش‌نویس» نگه داشته شده‌اند تا تفاوت پیش‌نویس و منتشرشده در پنل مدیریت قابل نمایش باشد. پیش‌نویس‌ها برای بازدیدکننده نمایش داده نمی‌شوند.',
    answer_en:
      'A few listings are held as drafts so the draft/published split in the admin panel is demonstrable. Drafts are never shown to visitors.',
    group: 'admin',
    sort_weight: 8,
  },
];

export const settings = [
  {
    key: 'brand',
    value: {
      name_fa: 'علی‌لند',
      name_en: 'AliLand',
      tagline_fa: 'نمایشگاه خودرو، با نگاه دقیق‌تر',
      tagline_en: 'A car showroom with a closer look',
      colors: {
        ivory: '#F4F3EF',
        ink: '#121722',
        cobalt: '#415CF0',
        steel: '#73808E',
        bronze: '#BE8459',
      },
      typography: {
        persian_display: 'Estedad',
        persian_body: 'Vazirmatn',
        latin_display: 'Instrument Serif',
        latin_body: 'Inter',
      },
    },
  },
  {
    key: 'footer',
    value: {
      note_fa:
        'علی‌لند یک نمونه کار طراحی و محصول است. تمام خودروها، قیمت‌ها و خدمات، داده نمونه و شبیه‌سازی‌شده هستند.',
      note_en:
        'AliLand is a design and product portfolio concept. All vehicles, prices and services are synthetic demo data.',
      status_fa: 'نسخه نمایشی — بدون فروش واقعی',
      status_en: 'Demo build — no real sales',
    },
  },
  {
    key: 'motion',
    value: { cinematic: true, intensity: 'full', reduced_motion_respected: true },
  },
  {
    key: 'demo',
    value: {
      notice_fa:
        'این نسخه یک پرتفولیو است: فهرست خودروها، قیمت‌ها و فرم‌ها نمونه‌اند و هیچ معامله یا ارسال پیامی انجام نمی‌شود.',
      notice_en:
        'This build is a portfolio: the catalogue, prices and forms are samples and no transaction or message delivery takes place.',
      noindex: true,
    },
  },
];

export const mediaAssets = [
  {
    name: 'showroom-hero-scene',
    description: 'Layered 2.5D showroom illustration rendered in code (SVG layers), used by the cinematic hero.',
    url: '/concept/showroom',
    kind: 'generated',
    attribution: 'Generated concept artwork — no photography used.',
  },
  {
    name: 'vehicle-concept-art',
    description: 'Per-vehicle concept artwork generated from each listing’s tone and accent colours.',
    url: '/concept/vehicle',
    kind: 'generated',
    attribution: 'Generated concept artwork — labelled on every vehicle page.',
  },
  {
    name: 'founder-portrait-placeholder',
    description: 'Branded editorial placeholder used until an authorised portrait of the founder is supplied.',
    url: '/concept/portrait',
    kind: 'generated',
    attribution: 'Placeholder — replace with an authorised photograph.',
  },
];

export const syntheticApplications = [
  {
    applicant_type: 'dealer',
    name: 'نمونه نمایشگاه — تهران',
    company: 'نمایشگاه نمونه (سینتتیک)',
    city: 'تهران',
    specialization: 'خودروهای داخلی',
    experience: '۸ سال',
    service_area: 'تهران و کرج',
    partnership_model: 'فهرست مشترک',
    description: 'رکورد نمونه برای نمایش داشبورد مدیریت. داده واقعی نیست.',
    portfolio_url: 'https://example.com/demo-dealer',
    contact_method: 'email',
    notes: 'Synthetic seed record.',
  },
  {
    applicant_type: 'inspector',
    name: 'نمونه کارشناس — اصفهان',
    company: 'مرکز کارشناسی نمونه (سینتتیک)',
    city: 'اصفهان',
    specialization: 'کارشناسی بدنه و رنگ',
    experience: '۵ سال',
    service_area: 'اصفهان',
    partnership_model: 'ارجاع کار',
    description: 'رکورد نمونه برای نمایش جریان بررسی درخواست‌ها.',
    portfolio_url: 'https://example.com/demo-inspector',
    contact_method: 'phone',
    notes: 'Synthetic seed record.',
  },
  {
    applicant_type: 'photographer',
    name: 'نمونه عکاس — شیراز',
    company: 'استودیو نمونه (سینتتیک)',
    city: 'شیراز',
    specialization: 'عکاسی خودرو',
    experience: '۳ سال',
    service_area: 'شیراز و مرودشت',
    partnership_model: 'پروژه‌ای',
    description: 'رکورد نمونه برای نمایش دسته‌بندی همکاران محتوا.',
    portfolio_url: 'https://example.com/demo-studio',
    contact_method: 'email',
    notes: 'Synthetic seed record.',
  },
];
