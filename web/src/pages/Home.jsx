import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { CarArt } from '../components/CarArt.jsx';
import { VehicleCard } from '../components/VehicleCard.jsx';

const STEPS = [
  { n: '۱', title: 'بررسی و انتخاب', text: 'موجودی را فیلتر کنید و مشخصات و کارشناسی را مقایسه کنید.' },
  { n: '۲', title: 'هماهنگی بازدید', text: 'درخواست بازدید ثبت کنید؛ زمان پس از تماس تأیید می‌شود.' },
  { n: '۳', title: 'پیگیری معامله', text: 'جزئیات و مدارک را با کارشناس نمایشگاه پیش می‌برید.' },
];

const CATEGORIES = [
  { label: 'سدان', bodyType: 'سدان' },
  { label: 'شاسی‌بلند', bodyType: 'شاسی‌بلند' },
  { label: 'هاچ‌بک', bodyType: 'هاچ‌بک' },
];

export default function Home() {
  const { settings } = useSettings();
  const [vehicles, setVehicles] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/vehicles?pageSize=3&sort=newest').then((r) => setVehicles(r.items)).catch(() => setVehicles([]));
    api.get('/articles').then((r) => setArticles(r.items.slice(0, 3))).catch(() => setArticles([]));
  }, []);

  return (
    <div className="home">
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">نمایشگاه خودرو</p>
          <h1 className="hero-title">{settings.heroTitle}</h1>
          <p className="hero-sub">{settings.heroSubtitle}</p>
          <div className="hero-actions">
            <Link to="/cars" className="btn btn-primary btn-lg">مشاهده خودروها</Link>
            <Link to="/sell" className="btn btn-ghost btn-lg">ماشینم را بفروشم</Link>
          </div>
          <ul className="hero-points">
            <li>بازدید حضوری</li>
            <li>شفافیت در مشخصات</li>
            <li>بدون ثبت‌نام برای مشاهدهٔ موجودی</li>
          </ul>
        </div>
        <div className="hero-art" role="img" aria-label={`تصویر نمونهٔ خودرو — ${settings.name}`}>
          <CarArt variant="hero" seed="hero" />
          <span className="badge badge-demo hero-badge">تصویر نمونه</span>
        </div>
      </section>

      <section className="container section">
        <div className="intro-grid">
          <div>
            <h2>خرید خودرو بدون حدس و گمان</h2>
            <p>
              موجودی واقعی نمایشگاه را ببینید، مشخصات و گزارش کارشناسی هر خودرو را بررسی کنید و پیش از
              مراجعه، درخواست بازدید یا تماس ثبت کنید. همهٔ درخواست‌ها در پنل نمایشگاه ثبت می‌شود.
            </p>
            <Link to="/about" className="link-more">دربارهٔ نمایشگاه →</Link>
          </div>
          <div className="intro-cards">
            <div className="mini-card">
              <h3>مشخصات ثبت‌شده</h3>
              <p>هر مقدار ناشناخته «ثبت نشده» نمایش داده می‌شود؛ نه حدس.</p>
            </div>
            <div className="mini-card">
              <h3>کارشناسی شفاف</h3>
              <p>گزارش فقط از دادهٔ همان خودرو و نسخهٔ پاک‌سازی‌شده منتشر می‌شود.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>تازه‌ترین خودروها</h2>
          <Link to="/cars" className="link-more">همهٔ موجودی →</Link>
        </div>
        <div className="vehicle-grid">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>انتخاب بر اساس نیاز</h2>
        </div>
        <div className="category-row">
          {CATEGORIES.map((c) => (
            <Link key={c.bodyType} to={`/cars?bodyType=${encodeURIComponent(c.bodyType)}`} className="category-pill">
              {c.label}
            </Link>
          ))}
          <Link to="/cars?priceMax=1000000000" className="category-pill">تا یک میلیارد تومان</Link>
          <Link to="/cars?priceMin=1000000000&priceMax=3000000000" className="category-pill">یک تا سه میلیارد</Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>چطور پیش می‌رود؟</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="step-num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section">
        <div className="seller-invite">
          <div>
            <h2>ماشینت را برای فروش معرفی کن</h2>
            <p>اطلاعات خودرو را در چند مرحله ثبت کن؛ درخواست به‌صورت خصوصی ثبت می‌شود و پس از بازبینی با تو تماس می‌گیریم.</p>
          </div>
          <Link to="/sell" className="btn btn-primary btn-lg">ثبت خودرو برای فروش</Link>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>راهنمای خرید</h2>
            <Link to="/journal" className="link-more">همهٔ مقاله‌ها →</Link>
          </div>
          <div className="article-grid">
            {articles.map((a) => (
              <Link key={a.slug} to={`/journal/${a.slug}`} className="article-card">
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <span className="link-more">ادامهٔ مطلب →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="cta-banner">
          <div>
            <h2>برای دیدن خودرو از نزدیک هماهنگ کنیم</h2>
            <p>ابتدا خودرو را از موجودی انتخاب کنید، سپس درخواست بازدید ثبت کنید.</p>
          </div>
          <Link to="/cars" className="btn btn-light btn-lg">درخواست بازدید</Link>
        </div>
      </section>
    </div>
  );
}
