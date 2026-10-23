/** Inline SVG car artwork used when a vehicle has no approved photo. */
export function CarArt({ seed = '', variant = 'card', label, className = '' }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  const hue = 210 + (hash % 40) - 20;
  const isHero = variant === 'hero';
  const bgA = isHero ? '#1b1d22' : `hsl(${hue} 32% 93%)`;
  const bgB = isHero ? '#3a2a22' : `hsl(${hue} 30% 86%)`;
  const body = isHero ? '#0d0e10' : '#2a2e35';
  const id = `g-${seed.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'x'}`;

  return (
    <svg
      className={className}
      viewBox="0 0 400 220"
      role="img"
      aria-label={label ? `تصویر نمونهٔ ${label}` : 'تصویر نمونهٔ خودرو'}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bgA} />
          <stop offset="100%" stopColor={bgB} />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isHero ? '#23262c' : '#3a3f47'} />
          <stop offset="100%" stopColor={body} />
        </linearGradient>
        {isHero && (
          <radialGradient id={`${id}-sun`} cx="50%" cy="62%" r="55%">
            <stop offset="0%" stopColor="#ff9a3c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      <rect width="400" height="220" fill={`url(#${id})`} />
      {isHero && <circle cx="200" cy="140" r="130" fill={`url(#${id}-sun)`} />}
      <ellipse cx="200" cy="178" rx="150" ry="14" fill="#000" opacity={isHero ? 0.45 : 0.12} />
      <g>
        {/* body */}
        <path
          d="M58 150 L74 118 Q82 102 104 99 L156 94 Q178 73 214 72 L262 72 Q292 72 312 92 L336 112 L366 120 Q380 124 379 140 L379 150 Q379 156 372 156 L64 156 Q58 156 58 150 Z"
          fill={`url(#${id}-body)`}
        />
        {/* glazing */}
        <path d="M166 99 Q184 82 214 81 L258 81 Q280 81 297 97 L310 108 L176 108 Z" fill={isHero ? '#7f93a8' : '#c7d3de'} opacity="0.85" />
        <path d="M158 113 L176 113 L176 128 L150 128 Z" fill={isHero ? '#6d8095' : '#bccad6'} opacity="0.7" />
        {/* lights */}
        <rect x="352" y="126" width="20" height="8" rx="4" fill="#ffd27a" opacity="0.9" />
        <rect x="66" y="128" width="14" height="7" rx="3" fill="#ff6a5a" opacity="0.85" />
        {/* wheels */}
        <circle cx="132" cy="156" r="24" fill="#16181c" />
        <circle cx="132" cy="156" r="11" fill={isHero ? '#6b7079' : '#9aa3ad'} />
        <circle cx="310" cy="156" r="24" fill="#16181c" />
        <circle cx="310" cy="156" r="11" fill={isHero ? '#6b7079' : '#9aa3ad'} />
      </g>
    </svg>
  );
}
