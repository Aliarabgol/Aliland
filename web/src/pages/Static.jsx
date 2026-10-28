import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Accordion } from '../components/ui.jsx';

export function FaqPage() {
  const { t, lang } = useI18n();
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api
      .get('/site')
      .then((data) => setFaqs(data.faqs || []))
      .catch(() => {});
  }, []);

  const items = faqs.map((faq) => ({
    question: lang === 'fa' ? faq.question_fa : faq.question_en,
    answer: lang === 'fa' ? faq.answer_fa : faq.answer_en,
  }));

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('faq.title')}</span>
          </nav>
          <h1>{t('faq.title')}</h1>
          <p>{t('faq.desc')}</p>
        </div>
      </section>
      <div className="shell" style={{ paddingBlock: 'clamp(28px,4vw,54px) clamp(50px,8vw,90px)', maxWidth: 880 }}>
        {items.length ? (
          <Accordion items={items} defaultOpen={0} />
        ) : (
          <div className="skeleton" style={{ height: 300 }} />
        )}
      </div>
    </>
  );
}

const LEGAL = {
  privacy: {
    fa: {
      title: 'حریم خصوصی',
      intro:
        'این نسخه نمایشی برای احترام به حریم خصوصی بازدیدکنندگان و صاحب پروژه، حداقل داده را جمع می‌کند. این متن یک سند حقوقی نیست و جایگزین مشاوره حقوقی نمی‌شود.',
      sections: [
        ['چه داده‌ای جمع می‌شود', 'فرم‌های فروش، همکاری و تماس در حالت شبیه‌سازی اجرا می‌شوند و اطلاعاتی برای هیچ شخص یا سرویس بیرونی ارسال نمی‌کنند. نام و پیام واردشده فقط به‌عنوان داده نمونه در همین پایگاه داده ذخیره می‌شود تا پنل مدیریت قابل نمایش باشد.'],
        ['نشان‌شده‌ها و مقایسه', 'فهرست نشان‌شده‌ها و مقایسه فقط در حافظه مرورگر خود شما (localStorage) ذخیره می‌شود و به سرور ارسال نمی‌شود. برای استفاده از آن‌ها نیازی به ثبت‌نام نیست.'],
        ['کوکی‌ها', 'تنها کوکی مورد استفاده، کوکی نشست مدیر است که فقط پس از ورود موفق در پنل مدیریت تنظیم می‌شود. بازدیدکنندگان عادی کوکی ردیابی دریافت نمی‌کنند.'],
        ['تماس', 'عمداً هیچ شماره تلفن یا نشانی ایمیل واقعی در این نسخه منتشر نشده است. برای هر استفاده واقعی، پیش از انتشار عمومی باید سیاست حفظ حریم خصوصی و مسیر دریافت رضایت به‌طور رسمی تنظیم شود.'],
        ['فهرست‌شدن در موتورهای جست‌وجو', 'این نسخه با دستور noindex ارائه می‌شود. این کار از ایندکس شدن جلوگیری می‌کند اما به‌تنهایی محافظت از حریم خصوصی نیست.'],
      ],
    },
    en: {
      title: 'Privacy',
      intro:
        'This demo build collects as little data as possible, out of respect for visitors and the project owner. This text is not a legal document and does not replace legal advice.',
      sections: [
        ['What is collected', 'The sell, partnership and contact forms run in simulation. Nothing is sent to any person or third-party service. A name and message may be stored as sample data in this database so the admin panel is demonstrable.'],
        ['Saved vehicles and comparison', 'The saved and comparison lists live in your browser only (localStorage) and are never sent to the server. No account is required to use them.'],
        ['Cookies', 'The only cookie is the admin session cookie, set after a successful admin sign-in. Ordinary visitors receive no tracking cookies.'],
        ['Contact', 'No real phone number or email address is published in this build. Before any public or commercial use, a formal privacy policy and consent flow must be put in place.'],
        ['Search indexing', 'This build is served with noindex. That prevents indexing but is not, on its own, privacy protection.'],
      ],
    },
  },
  terms: {
    fa: {
      title: 'شرایط استفاده',
      intro:
        'این نسخه یک نمونه کار طراحی و محصول است. با مرور آن می‌پذیرید که هیچ محتوای آن به‌عنوان پیشنهاد فروش، قیمت بازار، تأیید فنی یا توصیه مالی تلقی نمی‌شود.',
      sections: [
        ['وضعیت نمایشی', 'همه خودروها، قیمت‌ها، کارکردها و وضعیت‌ها داده نمونه‌اند. هیچ خودروی واقعی برای فروش وجود ندارد و هیچ معامله‌ای انجام نمی‌شود.'],
        ['تصاویر', 'تصاویر خودروها طرح‌های مفهومی تولیدشده با گرافیک برداری هستند و عکس خودروی واقعی نیستند. هیچ عکس بدون مجوز در این پروژه استفاده نشده است.'],
        ['خدمات', 'صفحات خدمات ساختار یک خدمت را نشان می‌دهند، نه ارائه آن. هیچ تأییدیه، گارانتی، اعتبارسنجی مالی یا همکاری تجاری واقعی در این نسخه وجود ندارد.'],
        ['مسئولیت', 'این پلتفرم به‌عنوان نمونه کار ارائه می‌شود و هیچ تضمینی درباره دقت داده‌های نمونه یا مناسب‌بودن آن‌ها برای تصمیم‌گیری واقعی داده نمی‌شود.'],
      ],
    },
    en: {
      title: 'Terms of use',
      intro:
        'This build is a design and product portfolio. By browsing it you accept that nothing here is an offer of sale, a market price, a technical certification or financial advice.',
      sections: [
        ['Demo status', 'Every vehicle, price, mileage and condition value is sample data. No real vehicle is for sale and no transaction takes place.'],
        ['Imagery', 'Vehicle images are concept artwork generated as vector graphics — not photographs of the real cars. No unlicensed imagery is used in this project.'],
        ['Services', 'The service pages describe the structure of a service, not its delivery. There is no real certification, warranty, credit approval or commercial partnership in this build.'],
        ['Liability', 'This platform is provided as a portfolio piece with no guarantee about the accuracy of sample data or its suitability for a real decision.'],
      ],
    },
  },
};

export function StaticPage({ kind }) {
  const { t, lang } = useI18n();
  const doc = LEGAL[kind][lang];

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{doc.title}</span>
          </nav>
          <h1>{doc.title}</h1>
          <p>{doc.intro}</p>
        </div>
      </section>
      <div className="shell">
        <div className="legal">
          {doc.sections.map(([heading, body]) => (
            <div key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function NotFound() {
  const { t } = useI18n();
  return (
    <section className="page-hero" style={{ minHeight: '70vh' }}>
      <div className="shell">
        <span className="kicker">404</span>
        <h1>{t('nf.title')}</h1>
        <p>{t('nf.desc')}</p>
        <div className="row">
          <Link className="btn btn--primary" to="/">
            {t('nf.home')}
          </Link>
          <Link className="btn btn--ghost" to="/vehicles">
            {t('nav.allVehicles')}
          </Link>
        </div>
      </div>
    </section>
  );
}
