import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, queryString } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import { Icon } from '../components/Icons.jsx';

const CATEGORIES = ['domestic', 'imported', 'assembled'];
const BODIES = ['sedan', 'hatchback', 'suv', 'crossover'];
const FUELS = ['petrol', 'hybrid', 'electric', 'diesel'];
const TRANSMISSIONS = ['manual', 'automatic', 'cvt', 'dct'];
const BANDS = ['economy', 'mid', 'premium', 'luxury'];
const PER_PAGE = 9;

export default function Vehicles() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const { t, lang, num } = useI18n();
  const { compare } = useLibrary();
  const navigate = useNavigate();
  const [data, setData] = useState({ items: [], total: 0, pages: 0 });
  const [facets, setFacets] = useState(null);
  const [loading, setLoading] = useState(true);

  const filters = useMemo(() => Object.fromEntries(params.entries()), [params]);
  const activeCategory = category || filters.category || '';

  useEffect(() => {
    api.get('/vehicles/facets').then(setFacets).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const qs = queryString({
      ...filters,
      category: activeCategory,
      perPage: PER_PAGE,
    });
    api
      .get(`/vehicles${qs}`)
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setData({ items: [], total: 0, pages: 0 }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [params, activeCategory]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setParams(next, { replace: true });
  };

  const reset = () => setParams(new URLSearchParams(), { replace: true });

  const clearOne = (key) => {
    if (key === 'category') {
      navigate('/vehicles');
      return;
    }
    setFilter(key, '');
  };

  const page = Number(filters.page || 1);
  const activeCount = Object.keys(filters).filter((key) => key !== 'page' && key !== 'sort').length + (category ? 1 : 0);

  const priceOptions = useMemo(() => {
    const options = [];
    for (let value = 500000000; value <= 8000000000; value += 500000000) options.push(value);
    return options;
  }, []);

  const years = useMemo(() => {
    const min = facets?.ranges?.min_year || 2018;
    const max = facets?.ranges?.max_year || 2025;
    return Array.from({ length: max - min + 1 }, (_, index) => max - index);
  }, [facets]);

  const makes = (facets?.makes || []).filter(
    (make) => !activeCategory || make.category === activeCategory,
  );

  const activeFilters = [];
  if (activeCategory) activeFilters.push({ key: 'category', label: t(`cat.${activeCategory}`) });
  if (filters.body) activeFilters.push({ key: 'body', label: t(`body.${filters.body}`) });
  if (filters.fuel) activeFilters.push({ key: 'fuel', label: t(`fuel.${filters.fuel}`) });
  if (filters.transmission) activeFilters.push({ key: 'transmission', label: t(`trans.${filters.transmission}`) });
  if (filters.condition) activeFilters.push({ key: 'condition', label: t(`cond.${filters.condition}`) });
  if (filters.band) activeFilters.push({ key: 'band', label: t(`band.${filters.band}`) });
  if (filters.make) {
    const make = facets?.makes?.find((item) => item.make_slug === filters.make);
    if (make) activeFilters.push({ key: 'make', label: lang === 'fa' ? make.make_fa : make.make_en });
  }
  if (filters.q) activeFilters.push({ key: 'q', label: `«${filters.q}»` });
  if (filters.mileageMax) activeFilters.push({ key: 'mileageMax', label: t('cat.upTo', { n: `${num(filters.mileageMax)} ${t('v.km')}` }) });

  return (
    <>
      <section className="page-hero" data-nav-tone="light">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <Link to="/vehicles">{t('nav.vehicles')}</Link>
            {activeCategory && (
              <>
                <span className="sep">/</span>
                <span>{t(`cat.${activeCategory}`)}</span>
              </>
            )}
          </nav>
          <h1>{activeCategory ? t(`cat.${activeCategory}`) : t('cat.page.title')}</h1>
          <p>{activeCategory ? t(`cat.${activeCategory}.desc`) : t('cat.page.desc')}</p>
          <div className="row">
            <span className="tag tag--demo">
              <Icon name="info" size={13} />
              {t('shell.demo')} — {t('v.price')}
            </span>
            {compare.length > 0 && (
              <Link className="btn btn--sm btn--ink" to="/compare">
                {t('nav.compare')} ({compare.length})
                <Icon name="compare" size={14} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="catalogue">
          <aside className="filters" aria-label={t('cat.filters')}>
            <div className="flex-between">
              <span className="filters__title">
                <Icon name="filter" size={13} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
                {t('cat.filters')}
              </span>
              {activeCount > 0 && (
                <button type="button" className="small" onClick={reset} style={{ color: 'var(--cobalt)', fontWeight: 700 }}>
                  {t('act.reset')}
                </button>
              )}
            </div>

            <div className="filters__group">
              <span className="filters__title">{t('v.category')}</span>
              <div className="filter-chips">
                <Link className="chip" to="/vehicles" aria-pressed={!activeCategory}>
                  {t('cat.all')}
                </Link>
                {CATEGORIES.map((item) => (
                  <Link className="chip" to={`/vehicles/${item}`} key={item} aria-pressed={activeCategory === item}>
                    {t(`cat.${item}.short`)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="filters__group">
              <label className="filters__title" htmlFor="f-make">
                {t('v.brand')}
              </label>
              <select
                id="f-make"
                className="select"
                value={filters.make || ''}
                onChange={(event) => setFilter('make', event.target.value)}
              >
                <option value="">{t('cat.any')}</option>
                {makes.map((make) => (
                  <option value={make.make_slug} key={`${make.make_slug}-${make.category}`}>
                    {lang === 'fa' ? make.make_fa : make.make_en} ({num(make.count)})
                  </option>
                ))}
              </select>
            </div>

            <div className="filters__group">
              <span className="filters__title">{t('cat.priceRange')}</span>
              <div className="form-grid form-grid--2" style={{ gap: 8 }}>
                <select
                  className="select"
                  aria-label={`${t('cat.priceRange')} — min`}
                  value={filters.priceMin || ''}
                  onChange={(event) => setFilter('priceMin', event.target.value)}
                >
                  <option value="">{t('cat.all')}</option>
                  {priceOptions.map((value) => (
                    <option value={value} key={value}>
                      {num(value)}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  aria-label={`${t('cat.priceRange')} — max`}
                  value={filters.priceMax || ''}
                  onChange={(event) => setFilter('priceMax', event.target.value)}
                >
                  <option value="">{t('cat.all')}</option>
                  {priceOptions.map((value) => (
                    <option value={value} key={value}>
                      {num(value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filters__group">
              <span className="filters__title">{t('cat.yearRange')}</span>
              <div className="form-grid form-grid--2" style={{ gap: 8 }}>
                <select
                  className="select"
                  aria-label={`${t('cat.yearRange')} — from`}
                  value={filters.yearMin || ''}
                  onChange={(event) => setFilter('yearMin', event.target.value)}
                >
                  <option value="">{t('cat.all')}</option>
                  {years.map((year) => (
                    <option value={year} key={year}>
                      {num(year)}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  aria-label={`${t('cat.yearRange')} — to`}
                  value={filters.yearMax || ''}
                  onChange={(event) => setFilter('yearMax', event.target.value)}
                >
                  <option value="">{t('cat.all')}</option>
                  {years.map((year) => (
                    <option value={year} key={year}>
                      {num(year)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filters__group">
              <label className="filters__title" htmlFor="f-mileage">
                {t('cat.maxMileage')}
              </label>
              <select
                id="f-mileage"
                className="select"
                value={filters.mileageMax || ''}
                onChange={(event) => setFilter('mileageMax', event.target.value)}
              >
                <option value="">{t('cat.any')}</option>
                {[20000, 50000, 80000, 120000, 200000].map((value) => (
                  <option value={value} key={value}>
                    {t('cat.upTo', { n: `${num(value)} ${t('v.km')}` })}
                  </option>
                ))}
              </select>
            </div>

            {[
              { key: 'body', label: t('v.bodyStyle'), list: BODIES, dict: 'body' },
              { key: 'fuel', label: t('v.fuel'), list: FUELS, dict: 'fuel' },
              { key: 'transmission', label: t('v.transmission'), list: TRANSMISSIONS, dict: 'trans' },
              { key: 'condition', label: t('v.condition'), list: ['new', 'used'], dict: 'cond' },
              { key: 'band', label: t('cat.priceRange'), list: BANDS, dict: 'band' },
            ].map((group) => (
              <div className="filters__group" key={group.key}>
                <span className="filters__title">{group.label}</span>
                <div className="filter-chips">
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={!filters[group.key]}
                    onClick={() => setFilter(group.key, '')}
                  >
                    {t('cat.all')}
                  </button>
                  {group.list.map((item) => (
                    <button
                      type="button"
                      className="chip"
                      key={item}
                      aria-pressed={filters[group.key] === item}
                      onClick={() => setFilter(group.key, item)}
                    >
                      {t(`${group.dict}.${item}`)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div>
            <div className="catalogue__toolbar">
              <span className="catalogue__count">
                {loading ? t('act.loading') : t('cat.results', { n: num(data.total) })}
              </span>
              <div className="row" style={{ gap: 8 }}>
                <label className="small muted" htmlFor="sort">
                  {t('cat.sort')}
                </label>
                <select
                  id="sort"
                  className="select"
                  style={{ width: 'auto', minWidth: 150 }}
                  value={filters.sort || 'newest'}
                  onChange={(event) => setFilter('sort', event.target.value)}
                >
                  <option value="newest">{t('cat.sort.newest')}</option>
                  <option value="price_asc">{t('cat.sort.priceAsc')}</option>
                  <option value="price_desc">{t('cat.sort.priceDesc')}</option>
                  <option value="mileage_asc">{t('cat.sort.mileage')}</option>
                  <option value="featured">{t('cat.sort.featured')}</option>
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="active-filters">
                {activeFilters.map((item) => (
                  <button type="button" key={item.key} onClick={() => clearOne(item.key)}>
                    {item.label}
                    <Icon name="close" size={12} />
                  </button>
                ))}
                <button type="button" onClick={reset} style={{ background: 'transparent', color: 'var(--on-surface-dim)' }}>
                  {t('act.reset')}
                </button>
              </div>
            )}

            {loading ? (
              <div className="vehicle-grid">
                {Array.from({ length: PER_PAGE }).map((_, index) => (
                  <div className="skeleton" key={index} style={{ height: 330 }} />
                ))}
              </div>
            ) : data.items.length === 0 ? (
              <div className="empty-state">
                <Icon name="search" size={30} />
                <h3>{t('cat.empty')}</h3>
                <p className="muted small">{t('cat.emptyHint')}</p>
                <button type="button" className="btn btn--ink" onClick={reset}>
                  {t('act.reset')}
                </button>
              </div>
            ) : (
              <div className="vehicle-grid">
                {data.items.map((vehicle) => (
                  <VehicleCard vehicle={vehicle} key={vehicle.slug} />
                ))}
              </div>
            )}

            {data.pages > 1 && (
              <nav className="pagination" aria-label="pagination">
                <button
                  type="button"
                  onClick={() => setFilter('page', String(Math.max(1, page - 1)))}
                  disabled={page <= 1}
                >
                  <Icon name="chevronStart" size={14} className="rtl-flip" />
                </button>
                {Array.from({ length: data.pages }).map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-current={page === index + 1}
                    onClick={() => setFilter('page', String(index + 1))}
                  >
                    {num(index + 1)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFilter('page', String(Math.min(data.pages, page + 1)))}
                  disabled={page >= data.pages}
                >
                  <Icon name="chevronEnd" size={14} className="rtl-flip" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
