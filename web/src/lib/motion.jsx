import { createElement, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

const alreadyVisible = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.92;

/**
 * Scroll-reveal wrapper. Content is only hidden once JS has taken over, and it is
 * forced visible if the trigger never fires, so nothing can be left invisible.
 */
export function Reveal({
  children,
  as = 'div',
  className = '',
  y = 24,
  delay = 0,
  duration = 0.85,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    let tween;
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y });

      const play = () => {
        tween = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          overwrite: true,
        });
      };

      if (alreadyVisible(el)) {
        play();
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: play,
      });
    }, ref);

    // Safety net: never leave content invisible.
    const fallback = setTimeout(() => {
      if (el.style.opacity === '0' && el.getBoundingClientRect().top < window.innerHeight) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
      }
    }, 2600);

    return () => {
      clearTimeout(fallback);
      tween?.kill();
      ctx.revert();
    };
  }, [reduced, y, delay, duration]);

  return createElement(as, { ref, className, style, ...rest }, children);
}

/**
 * Word-group reveal. Splits on spaces only — never inside a word — so Arabic
 * letter joining and shaping stay intact.
 */
export function StaggerText({
  text,
  as = 'span',
  className = '',
  stagger = 0.038,
  delay = 0,
  style,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const words = el.querySelectorAll('[data-word]');
    if (!words.length) return undefined;

    let tween;
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0, yPercent: 42 });
      const play = () => {
        tween = gsap.to(words, {
          opacity: 1,
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger,
          delay,
          overwrite: true,
        });
      };
      if (alreadyVisible(el)) {
        play();
        return;
      }
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: play });
    }, ref);

    return () => {
      tween?.kill();
      ctx.revert();
    };
  }, [text, stagger, delay, reduced]);

  const words = String(text || '').split(' ');

  return createElement(
    as,
    { ref, className, style },
    words.map((word, index) => (
      <span key={`${word}-${index}`} style={{ display: 'inline-block', willChange: 'transform' }} data-word>
        {word}
        {index < words.length - 1 ? '\u00A0' : ''}
      </span>
    )),
  );
}

/** Subtle scroll-linked parallax for image and panel layers. */
export function Parallax({ children, speed = 40, className = '', style }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: speed * -0.5 },
        {
          y: speed * 0.5,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [speed, reduced]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/** Tracks vertical scroll and reports it in state, throttled to animation frames. */
export function useScrollTriggeredState(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}

export { gsap, ScrollTrigger };
