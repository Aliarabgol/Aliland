import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import { Icon } from './Icons.jsx';

export function SectionHead({ kicker, title, body, action, split = false, as: Heading = 'h2' }) {
  return (
    <div className={`section-head${split ? ' section-head--split' : ''}`}>
      <div className="stack" style={{ gap: 12 }}>
        {kicker ? <span className="kicker">{kicker}</span> : null}
        {title ? <Heading className="display-2">{title}</Heading> : null}
      </div>
      {(body || action) && (
        <div className="stack" style={{ gap: 18 }}>
          {body ? <p>{body}</p> : null}
          {action}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items, defaultOpen = -1 }) {
  const [open, setOpen] = useState(defaultOpen);
  const panels = useRef([]);

  useEffect(() => {
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      panel.style.maxHeight = index === open ? `${panel.scrollHeight}px` : '0px';
    });
  }, [open, items]);

  useEffect(() => {
    const onResize = () => {
      const panel = panels.current[open];
      if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div className={`acc-item${open === index ? ' is-open' : ''}`} key={item.question || index}>
          <button
            type="button"
            className="acc-trigger"
            aria-expanded={open === index}
            onClick={() => setOpen(open === index ? -1 : index)}
          >
            <span>{item.question}</span>
            <span className="acc-icon" aria-hidden="true" />
          </button>
          <div className="acc-panel" ref={(el) => (panels.current[index] = el)}>
            <div className="acc-panel__inner">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Toast() {
  const { toast } = useLibrary();
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="check" size={15} />
      {toast}
    </div>
  );
}

export function DemoNotice({ children, className = '' }) {
  return (
    <div className={`tag tag--demo ${className}`} style={{ padding: '7px 13px' }}>
      <Icon name="info" size={13} />
      {children}
    </div>
  );
}

/** Restores scroll to the top on navigation, except for in-page anchors. */
export function ScrollRestore() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setVisible(window.scrollY > 900);
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('act.toTop')}
      title={t('act.toTop')}
    >
      <Icon name="arrowStart" size={17} style={{ transform: 'rotate(90deg)' }} />
    </button>
  );
}
