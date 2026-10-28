import { useId } from 'react';

/** Generative editorial cover for journal entries — abstract, never a stock photo. */
export default function ArticleCover({ tone = '#121722', label, className = '' }) {
  const raw = useId().replace(/[:]/g, '');
  const id = (n) => `${n}-${raw}`;
  return (
    <svg viewBox="0 0 400 240" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label || 'Editorial cover'}>
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tone} />
          <stop offset="100%" stopColor="#0a0d14" />
        </linearGradient>
        <linearGradient id={id('line')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#be8459" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#415cf0" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id('bg')})`} />
      <g stroke="#ffffff" strokeOpacity="0.08">
        {Array.from({ length: 9 }).map((_, index) => (
          <line key={index} x1={index * 50 + 10} y1="0" x2={index * 50 - 60} y2="240" />
        ))}
      </g>
      <circle cx="300" cy="70" r="86" fill="none" stroke={`url(#${id('line')})`} strokeWidth="1.4" />
      <circle cx="300" cy="70" r="54" fill="none" stroke="#ffffff" strokeOpacity="0.1" />
      <path d="M40 190 C110 150 180 210 250 160 C300 122 340 140 380 118" stroke={`url(#${id('line')})`} strokeWidth="2" fill="none" />
      <rect x="28" y="28" width="46" height="3" fill="#be8459" />
    </svg>
  );
}
