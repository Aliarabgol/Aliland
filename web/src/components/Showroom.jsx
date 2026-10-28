import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useReducedMotion } from '../lib/motion.jsx';
import { useI18n } from '../lib/i18n.jsx';
import ShowroomScene from './ShowroomScene.jsx';
import { Icon } from './Icons.jsx';

const SHORTCUTS = [
  { to: '/vehicles', key: 'nav.allVehicles' },
  { to: '/vehicles/domestic', key: 'nav.domestic' },
  { to: '/vehicles/imported', key: 'nav.imported' },
  { to: '/sell', key: 'nav.sell' },
  { to: '/services', key: 'nav.services' },
  { to: '/partnership', key: 'nav.partnership' },
];

/**
 * Scroll-driven showroom entrance.
 *   Phase A  rounded hero frame with the headline
 *   Phase B  the frame expands and the camera pushes into the room
 *   Phase C  fullscreen showroom with the shortcut navigation
 *   Phase D  the scene travels up and out, normal scrolling resumes
 *
 * ScrollTrigger with `scrub` maps scroll position → timeline progress, so the
 * whole sequence is reversible and pauses when scrolling stops. The stage is
 * CSS-sticky rather than pinned, so no pin-spacer can break the layout.
 */
export default function Showroom({ hero }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const sceneRef = useRef(null);
  const copyRef = useRef(null);
  const veilRef = useRef(null);
  const progressRef = useRef(null);
  const reduced = useReducedMotion();
  const { t, bi } = useI18n();

  useEffect(() => {
    if (reduced) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const car = root.querySelector('.scene-car');
      const glass = root.querySelector('.scene-glass');
      const floor = root.querySelector('.scene-floor');
      const sky = root.querySelector('.scene-sky');
      const shortcutEls = root.querySelectorAll('.shortcut');
      const shortcutTitle = root.querySelector('.shortcuts__title');
      const shortcuts = root.querySelector('.shortcuts');
      const hint = root.querySelector('.showroom__scrollhint');

      gsap.set(shortcutEls, { opacity: 0, y: 26 });
      gsap.set(shortcutTitle, { opacity: 0, y: 18 });
      gsap.set(shortcuts, { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });

      // Phase A → B: frame opens, camera pushes in
      tl.to(frameRef.current, {
        clipPath: 'inset(0vh 0vw round 0px)',
        duration: 0.42,
        ease: 'power1.inOut',
      }, 0)
        .to(car, { scale: 1.24, yPercent: -3, transformOrigin: '50% 68%', duration: 0.6 }, 0)
        .to(glass, { scale: 1.09, yPercent: 3, duration: 0.6 }, 0)
        .to(sky, { scale: 1.06, yPercent: -2, duration: 0.6 }, 0)
        .to(floor, { scale: 1.05, yPercent: 6, duration: 0.6 }, 0)
        .to(veilRef.current, { opacity: 0.95, duration: 0.3 }, 0.08)
        .to(copyRef.current, { opacity: 0, y: -80, duration: 0.18, ease: 'power1.in' }, 0.12)
        .to(hint, { opacity: 0, duration: 0.1 }, 0.06)
        // Phase C: shortcuts staged in, after the frame has fully opened
        .to(shortcutTitle, { opacity: 1, y: 0, duration: 0.1 }, 0.45)
        .to(shortcutEls, { opacity: 1, y: 0, stagger: 0.028, duration: 0.14 }, 0.47)
        // Phase D: the scene leaves upward
        .to(shortcutEls, { opacity: 0, y: -18, stagger: 0.012, duration: 0.1 }, 0.76)
        .to(shortcutTitle, { opacity: 0, duration: 0.08 }, 0.76)
        .to(sceneRef.current, { yPercent: -100, duration: 0.24, ease: 'power2.inOut' }, 0.76);

      // pointer parallax, desktop only, cheap and disabled for reduced motion
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      if (finePointer) {
        const moveCar = gsap.quickTo(car, 'x', { duration: 0.9, ease: 'power3.out' });
        const moveGlass = gsap.quickTo(glass, 'x', { duration: 1.3, ease: 'power3.out' });
        const moveFloorLayer = gsap.quickTo(floor, 'x', { duration: 1.1, ease: 'power3.out' });
        const onMove = (event) => {
          const ratio = event.clientX / window.innerWidth - 0.5;
          moveCar(ratio * -26);
          moveGlass(ratio * -12);
          moveFloorLayer(ratio * -8);
        };
        root.addEventListener('pointermove', onMove, { passive: true });
        return () => root.removeEventListener('pointermove', onMove);
      }
      return undefined;
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  const title = bi(hero || {}, 'title') || t('hero.cta');
  const subtitle = bi(hero || {}, 'subtitle');
  const ctaLabel = bi(hero || {}, 'cta_label') || t('hero.cta');

  return (
    <section
      className={`showroom${reduced ? ' showroom--static' : ' showroom--cinematic'}`}
      ref={rootRef}
      data-nav-tone="dark"
      aria-label={t('home.hero')}
    >
      <div className="showroom__stage" ref={stageRef}>
        <div className="showroom__frame" ref={frameRef}>
          <div className="showroom__scene" ref={sceneRef}>
            <ShowroomScene />
          </div>
          <div className="showroom__veil" ref={veilRef} aria-hidden="true" />
          <div className="showroom__vignette" aria-hidden="true" />
          <div className="showroom__grain" aria-hidden="true" />
        </div>

        <div className="hero">
          <div className="shell">
            <div className="hero__copy" ref={copyRef}>
              <span className="hero__eyebrow label">{t('brand.tagline')}</span>
              <h1>{title}</h1>
              {subtitle ? <p className="hero__sub">{subtitle}</p> : null}
              <div className="hero__cta">
                <Link className="btn btn--primary btn--lg" to={hero?.cta_href || '/vehicles'}>
                  {ctaLabel}
                  <Icon name="arrowEnd" size={17} className="rtl-flip" />
                </Link>
                <Link className="btn btn--onDark btn--lg" to="/services">
                  {t('hero.cta2')}
                </Link>
              </div>
              <div className="hero__meta">
                <span><i />{t('hero.meta1')}</span>
                <span><i />{t('hero.meta2')}</span>
                <span><i />{t('hero.meta3')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shortcuts">
          <div className="shortcuts__inner">
            <h2 className="shortcuts__title">{t('hero.shortcuts')}</h2>
            <div className="shortcuts__grid">
              {SHORTCUTS.map((item, index) => (
                <Link className="shortcut" to={item.to} key={item.to}>
                  <span>{t(item.key)}</span>
                  <span className="row" style={{ gap: 10 }}>
                    <span className="shortcut__n">{String(index + 1).padStart(2, '0')}</span>
                    <Icon name="arrowEnd" size={15} className="arrow" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="showroom__scrollhint" aria-hidden="true">
          <span>{t('hero.scroll')}</span>
          <span className="rail" />
        </div>
        <div className="showroom__progress" aria-hidden="true">
          <i ref={progressRef} />
        </div>
      </div>
    </section>
  );
}
