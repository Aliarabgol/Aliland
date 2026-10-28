import { useId } from 'react';

// ————————————————————————————————————————————————————————————————
// Concept artwork for each listing.
// These are generated vector illustrations, NOT photographs of the real
// models — the label "طرح مفهومی / Concept artwork" ships with them.
// ————————————————————————————————————————————————————————————————

function toRgb(hex) {
  const clean = String(hex || '#121722').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function mix(a, b, amount) {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  const t = Math.max(0, Math.min(1, amount));
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(
    b1 + (b2 - b1) * t,
  )})`;
}

function palette(tone, accent) {
  return {
    base: tone || '#121722',
    light: mix(tone || '#121722', '#ffffff', 0.62),
    mid: mix(tone || '#121722', '#ffffff', 0.22),
    shade: mix(tone || '#121722', '#000000', 0.46),
    deep: mix(tone || '#121722', '#000000', 0.76),
    glow: accent || '#415CF0',
    glowSoft: mix(accent || '#415CF0', '#ffffff', 0.55),
  };
}

export default function VehicleArt({ tone = '#121722', accent = '#415CF0', angle = 'front', className = '' }) {
  const uid = useId().replace(/[:]/g, '');
  const c = palette(tone, accent);
  const id = (name) => `${name}-${uid}`;

  const bodyGrad = (
    <linearGradient id={id('body')} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={c.light} />
      <stop offset="26%" stopColor={c.mid} />
      <stop offset="62%" stopColor={c.base} />
      <stop offset="100%" stopColor={c.deep} />
    </linearGradient>
  );

  const glassGrad = (
    <linearGradient id={id('glass')} x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stopColor={mix(c.glow, '#ffffff', 0.35)} stopOpacity="0.9" />
      <stop offset="45%" stopColor="#0d1524" />
      <stop offset="100%" stopColor="#05070c" />
    </linearGradient>
  );

  const backdrop = (
    <radialGradient id={id('bg')} cx="50%" cy="38%" r="78%">
      <stop offset="0%" stopColor={mix(c.glow, '#000000', 0.42)} />
      <stop offset="55%" stopColor="#111722" />
      <stop offset="100%" stopColor="#070a10" />
    </radialGradient>
  );

  const floorGrad = (
    <linearGradient id={id('floor')} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={mix(c.glow, '#000000', 0.72)} stopOpacity="0.55" />
      <stop offset="100%" stopColor="#05070b" stopOpacity="0" />
    </linearGradient>
  );

  const glowGrad = (
    <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={c.glowSoft} stopOpacity="0.95" />
      <stop offset="100%" stopColor={c.glowSoft} stopOpacity="0" />
    </radialGradient>
  );

  const defs = (
    <defs>
      {bodyGrad}
      {glassGrad}
      {backdrop}
      {floorGrad}
      {glowGrad}
      <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id={id('blur')} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <clipPath id={id('clip')}>
        <rect x="0" y="0" width="400" height="250" />
      </clipPath>
    </defs>
  );

  const frame = (
    <>
      <rect width="400" height="250" fill={`url(#${id('bg')})`} />
      {/* architectural horizon */}
      <path d="M0 176 H400" stroke="#ffffff" strokeOpacity="0.07" />
      <rect y="176" width="400" height="74" fill={`url(#${id('floor')})`} />
      {/* background light bars */}
      <g opacity="0.5">
        <rect x="34" y="42" width="2" height="120" fill={c.glow} opacity="0.36" />
        <rect x="366" y="52" width="2" height="110" fill={c.glow} opacity="0.22" />
        <rect x="52" y="30" width="296" height="1.4" fill="#ffffff" opacity="0.1" />
      </g>
      <ellipse cx="200" cy="96" rx="150" ry="60" fill={`url(#${id('glow')})`} opacity="0.22" />
    </>
  );

  const front = (
    <g>
      <ellipse cx="200" cy="212" rx="128" ry="11" fill="#000000" opacity="0.55" filter={`url(#${id('blur')})`} />
      {/* wheels behind the bumper */}
      <rect x="52" y="168" width="46" height="44" rx="14" fill="#080a0f" />
      <rect x="302" y="168" width="46" height="44" rx="14" fill="#080a0f" />
      {/* roof / cabin */}
      <path d="M128 132 C146 100 254 100 272 132 Z" fill={`url(#${id('body')})`} />
      <path d="M138 130 C156 108 244 108 262 130 L250 150 C226 136 174 136 150 150 Z" fill={`url(#${id('glass')})`} />
      {/* main body */}
      <path d="M66 204 C62 172 84 140 120 128 L280 128 C316 140 338 172 334 204 Z" fill={`url(#${id('body')})`} />
      {/* shoulder highlight */}
      <path d="M72 176 C96 152 130 138 200 136 C270 138 306 152 330 176" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.6" fill="none" />
      <path d="M120 128 L280 128" stroke="#ffffff" strokeOpacity="0.18" />
      {/* mirrors */}
      <path d="M62 142 l-14 5 -2 10 16 -3 Z" fill={c.shade} />
      <path d="M338 142 l14 5 2 10 -16 -3 Z" fill={c.shade} />
      {/* headlights */}
      <path d="M78 150 L146 143 L150 160 L74 166 Z" fill={c.glowSoft} opacity="0.92" />
      <path d="M322 150 L254 143 L250 160 L326 166 Z" fill={c.glowSoft} opacity="0.92" />
      <path d="M78 150 L146 143 L150 160 L74 166 Z" fill="#ffffff" opacity="0.16" />
      <path d="M322 150 L254 143 L250 160 L326 166 Z" fill="#ffffff" opacity="0.16" />
      {/* grille */}
      <path d="M152 160 L248 160 L242 186 L158 186 Z" fill={c.deep} />
      <g stroke="#ffffff" strokeOpacity="0.13">
        <path d="M160 166 H240 M160 172 H240 M160 178 H240" />
      </g>
      {/* bumper + intake */}
      <path d="M92 186 L308 186 L300 204 L100 204 Z" fill={c.shade} />
      <path d="M146 190 L254 190 L250 199 L150 199 Z" fill="#05070b" opacity="0.85" />
      <path d="M100 204 L300 204" stroke="#ffffff" strokeOpacity="0.12" />
      {/* speculars */}
      <path d="M104 134 C130 122 158 118 200 118" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.4" fill="none" />
    </g>
  );

  const profile = (
    <g>
      <ellipse cx="200" cy="214" rx="150" ry="10" fill="#000000" opacity="0.55" filter={`url(#${id('blur')})`} />
      <path
        d="M32 184 C32 164 44 148 70 142 L124 130 C144 106 170 96 202 96 L234 96 C266 96 292 112 306 138 L346 148 C358 152 364 162 364 178 L364 184 Z"
        fill={`url(#${id('body')})`}
      />
      <path
        d="M138 130 C154 110 172 104 200 104 L230 104 C254 104 274 116 286 134 Z"
        fill={`url(#${id('glass')})`}
      />
      <path d="M62 150 C86 138 108 132 130 130" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5" fill="none" />
      {/* door line + handle */}
      <path d="M196 132 L192 178" stroke="#000000" strokeOpacity="0.25" />
      <rect x="204" y="148" width="20" height="4" rx="2" fill="#ffffff" opacity="0.28" />
      {/* headlight & tail */}
      <path d="M344 150 l18 4 0 12 -18 2 Z" fill={c.glowSoft} opacity="0.9" />
      <path d="M36 156 l10 2 v8 l-10 2 Z" fill={c.glow} opacity="0.6" />
      {/* wheels */}
      {[104, 298].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={184} r="27" fill="#080a0f" />
          <circle cx={cx} cy={184} r="15" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.4" />
          <circle cx={cx} cy={184} r="4" fill="#ffffff" opacity="0.25" />
        </g>
      ))}
      <path d="M70 176 H340" stroke="#000000" strokeOpacity="0.2" />
    </g>
  );

  const cabin = (
    <g>
      {/* dashboard mass */}
      <path d="M0 210 C60 150 340 150 400 210 L400 250 L0 250 Z" fill={`url(#${id('body')})`} />
      <path d="M0 206 C62 150 338 150 400 206" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" fill="none" />
      {/* ambient light strip */}
      <path d="M18 168 C80 128 320 128 382 168" stroke={c.glowSoft} strokeOpacity="0.55" strokeWidth="2" fill="none" />
      <ellipse cx="200" cy="150" rx="150" ry="40" fill={`url(#${id('glow')})`} opacity="0.28" />
      {/* cluster */}
      <rect x="58" y="166" width="86" height="30" rx="8" fill="#0a1018" stroke={c.glowSoft} strokeOpacity="0.35" />
      <path d="M74 184 h12 M94 184 h12 M114 184 h14" stroke={c.glowSoft} strokeOpacity="0.7" strokeWidth="2" />
      {/* centre screen */}
      <rect x="226" y="158" width="112" height="46" rx="7" fill="#0a1018" stroke="#ffffff" strokeOpacity="0.16" />
      <rect x="234" y="166" width="42" height="6" rx="3" fill={c.glowSoft} opacity="0.7" />
      <rect x="234" y="178" width="70" height="4" rx="2" fill="#ffffff" opacity="0.2" />
      <rect x="234" y="188" width="56" height="4" rx="2" fill="#ffffff" opacity="0.14" />
      {/* steering wheel */}
      <circle cx="170" cy="196" r="34" fill="#0b0f16" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="170" cy="196" r="12" fill="none" stroke="#ffffff" strokeOpacity="0.16" />
      <path d="M170 208 v18 M136 196 h18 M186 196 h18" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />
      {/* seats */}
      <path d="M300 250 c0 -30 8 -44 22 -48 l10 -2 6 50 Z" fill={c.deep} opacity="0.8" />
      <path d="M92 250 c0 -30 -8 -44 -20 -48 l-10 -2 -6 50 Z" fill={c.deep} opacity="0.8" />
      {/* windshield */}
      <path d="M0 0 H400 V44 C320 20 80 20 0 44 Z" fill={`url(#${id('glass')})`} opacity="0.55" />
    </g>
  );

  const quarter = (
    <g transform="translate(-26 -8) rotate(-1.6 200 170) scale(1.16)" transformOrigin="200 170">
      {front}
    </g>
  );

  const art = { front, quarter, profile, cabin }[angle] || front;

  return (
    <svg
      viewBox="0 0 400 250"
      className={className}
      role="img"
      aria-label="Concept artwork of the vehicle — generated illustration, not a photograph"
      preserveAspectRatio="xMidYMid slice"
    >
      {defs}
      <g clipPath={`url(#${id('clip')})`}>
        {frame}
        {art}
        {/* floor reflection */}
        <g opacity="0.15" filter={`url(#${id('blur')})`} transform="translate(0 424) scale(1 -1)">
          {angle === 'cabin' ? null : art}
        </g>
        {/* vignette */}
        <rect width="400" height="250" fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="26" />
      </g>
    </svg>
  );
}
