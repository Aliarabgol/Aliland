import { useId } from 'react';

/**
 * The showroom scene is a layered 2.5D illustration built entirely from vector
 * shapes — sky, glass architecture, floor, background vehicles and the coupe are
 * separate layers that the hero timeline moves at different speeds. It is not a
 * photograph and does not claim to contain real 3D geometry; the depth comes from
 * parallax between the layers.
 */
export default function ShowroomScene({ className = '' }) {
  const raw = useId().replace(/[:]/g, '');
  const id = (n) => `${n}-${raw}`;

  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Layered illustration of a luxury coupe inside a glass showroom at sunset"
    >
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101a2c" />
          <stop offset="42%" stopColor="#2d2b3d" />
          <stop offset="72%" stopColor="#8a5433" />
          <stop offset="100%" stopColor="#e0a068" />
        </linearGradient>
        <radialGradient id={id('sun')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9a8" stopOpacity="0.95" />
          <stop offset="42%" stopColor="#f0a463" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0a463" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('floor')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241c18" />
          <stop offset="35%" stopColor="#0f1118" />
          <stop offset="100%" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id={id('carBody')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#5b6675" />
          <stop offset="18%" stopColor="#2b3340" />
          <stop offset="52%" stopColor="#141a24" />
          <stop offset="100%" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id={id('carGlass')} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#c9a887" stopOpacity="0.85" />
          <stop offset="34%" stopColor="#2a3140" />
          <stop offset="100%" stopColor="#080b11" />
        </linearGradient>
        <linearGradient id={id('warmRim')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd6a5" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#e79e60" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#e79e60" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('glassWall')} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#8fa7c0" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#c98a52" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0e1420" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={id('lightBar')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff3e1" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff3e1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff3e1" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('haze')} cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#f0a463" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f0a463" stopOpacity="0" />
        </radialGradient>
        <filter id={id('soft')} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id={id('soft2')} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id('beam')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* ————— sky ————— */}
      <g className="scene-sky">
        <rect width="1600" height="900" fill={`url(#${id('sky')})`} />
        <ellipse cx="905" cy="470" rx="520" ry="330" fill={`url(#${id('sun')})`} />
      </g>

      {/* ————— architecture ————— */}
      <g className="scene-glass">
        {/* distant treeline silhouette */}
        <path
          d="M0 470 q60 -40 120 -10 q40 -46 92 -8 q56 -30 100 6 q50 -30 96 10 q54 -26 96 8 q60 -36 120 0 q46 -28 92 6 q56 -34 118 2 q50 -22 96 8 q58 -30 112 6 q54 -24 98 8 q64 -30 118 2 L1600 470 L1600 560 L0 560 Z"
          fill="#0d1420"
          opacity="0.72"
        />
        <rect y="60" width="1600" height="460" fill={`url(#${id('glassWall')})`} />
        {/* mullions */}
        <g stroke="#f4e4d2" strokeOpacity="0.14">
          {[80, 340, 600, 1000, 1260, 1520].map((x) => (
            <line key={x} x1={x} y1="60" x2={x} y2="520" strokeWidth="3" />
          ))}
          <line x1="0" y1="212" x2="1600" y2="196" strokeWidth="2" strokeOpacity="0.1" />
        </g>
        {/* glass reflection slashes */}
        <g fill="#ffffff" opacity="0.05">
          <path d="M180 60 L360 60 L120 520 L20 520 Z" />
          <path d="M700 60 L790 60 L560 520 L470 520 Z" />
          <path d="M1180 60 L1270 60 L1040 520 L950 520 Z" />
        </g>
        {/* ceiling + light bars */}
        <rect width="1600" height="62" fill="#080b12" />
        <g>
          <rect x="180" y="26" width="380" height="5" rx="2.5" fill={`url(#${id('lightBar')})`} />
          <rect x="700" y="18" width="300" height="4" rx="2" fill={`url(#${id('lightBar')})`} opacity="0.8" />
          <rect x="1080" y="30" width="360" height="5" rx="2.5" fill={`url(#${id('lightBar')})`} />
        </g>
        {/* side columns */}
        <rect x="0" y="0" width="34" height="560" fill="#080b12" opacity="0.85" />
        <rect x="1566" y="0" width="34" height="560" fill="#080b12" opacity="0.85" />
        {/* background vehicles */}
        <g opacity="0.5" filter={`url(#${id('soft2')})`}>
          <path d="M120 512 q18 -34 54 -36 h74 q34 2 52 36 Z" fill="#0b1018" />
          <circle cx="160" cy="516" r="15" fill="#05070b" />
          <circle cx="244" cy="516" r="15" fill="#05070b" />
          <path d="M1310 516 q20 -40 60 -42 h84 q38 2 58 42 Z" fill="#0b1018" />
          <circle cx="1352" cy="520" r="17" fill="#05070b" />
          <circle cx="1452" cy="520" r="17" fill="#05070b" />
        </g>
      </g>

      {/* ————— floor ————— */}
      <g className="scene-floor">
        <rect y="518" width="1600" height="382" fill={`url(#${id('floor')})`} />
        {/* perspective lines */}
        <g stroke="#f4e4d2" strokeOpacity="0.05">
          {[-560, -300, -80, 160, 420, 700, 980, 1240].map((x, i) => (
            <line key={i} x1={800 + x * 0.35} y1="518" x2={800 + x} y2="900" strokeWidth="1.4" />
          ))}
        </g>
        {/* warm pools of light */}
        <ellipse cx="800" cy="700" rx="560" ry="120" fill={`url(#${id('haze')})`} />
        <ellipse cx="300" cy="640" rx="150" ry="26" fill="#f7d3a5" opacity="0.07" filter={`url(#${id('soft2')})`} />
        <ellipse cx="1320" cy="650" rx="170" ry="28" fill="#f7d3a5" opacity="0.06" filter={`url(#${id('soft2')})`} />
        {/* horizon glow */}
        <rect y="512" width="1600" height="14" fill="#ffd9a8" opacity="0.14" filter={`url(#${id('soft2')})`} />
      </g>

      {/* ————— the coupe (scaled front elevation, 400×250 geometry) ————— */}
      <g className="scene-car">
        <ellipse cx="800" cy="742" rx="330" ry="30" fill="#000000" opacity="0.65" filter={`url(#${id('soft')})`} />
        <g transform="translate(360 280) scale(2.2)">
          {/* wheels */}
          <rect x="52" y="168" width="46" height="44" rx="14" fill="#05070b" />
          <rect x="302" y="168" width="46" height="44" rx="14" fill="#05070b" />
          {/* roof */}
          <path d="M128 132 C146 100 254 100 272 132 Z" fill={`url(#${id('carBody')})`} />
          <path d="M138 130 C156 108 244 108 262 130 L250 150 C226 136 174 136 150 150 Z" fill={`url(#${id('carGlass')})`} />
          {/* body */}
          <path d="M66 204 C62 172 84 140 120 128 L280 128 C316 140 338 172 334 204 Z" fill={`url(#${id('carBody')})`} />
          {/* shoulder and rim light */}
          <path d="M72 176 C96 152 130 138 200 136" stroke={`url(#${id('warmRim')})`} strokeWidth="2.4" fill="none" />
          <path d="M330 176 C306 152 272 138 200 136" stroke="#9fb4cc" strokeOpacity="0.35" strokeWidth="1.8" fill="none" />
          <path d="M120 128 L280 128" stroke="#ffffff" strokeOpacity="0.2" />
          {/* mirrors */}
          <path d="M62 142 l-14 5 -2 10 16 -3 Z" fill="#0d1219" />
          <path d="M338 142 l14 5 2 10 -16 -3 Z" fill="#0d1219" />
          {/* headlights */}
          <path d="M78 150 L146 143 L150 160 L74 166 Z" fill="#ffeccd" opacity="0.95" />
          <path d="M322 150 L254 143 L250 160 L326 166 Z" fill="#ffeccd" opacity="0.95" />
          <path d="M78 150 L146 143 L150 160 L74 166 Z" fill="#ffffff" opacity="0.22" />
          <path d="M322 150 L254 143 L250 160 L326 166 Z" fill="#ffffff" opacity="0.22" />
          {/* grille */}
          <path d="M152 160 L248 160 L242 186 L158 186 Z" fill="#04060a" />
          <g stroke="#ffffff" strokeOpacity="0.14">
            <path d="M160 166 H240 M160 172 H240 M160 178 H240" />
          </g>
          {/* bumper + splitter */}
          <path d="M92 186 L308 186 L300 204 L100 204 Z" fill="#0a0e15" />
          <path d="M146 190 L254 190 L250 199 L150 199 Z" fill="#020305" />
          <path d="M100 204 L300 204" stroke="#ffffff" strokeOpacity="0.14" />
          {/* speculars */}
          <path d="M104 134 C130 122 158 118 200 118" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.4" fill="none" />
          <path d="M282 130 C300 138 314 150 322 164" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.2" fill="none" />
        </g>
        {/* headlight beams */}
        <g opacity="0.5" filter={`url(#${id('beam')})`}>
          <path d="M560 610 L360 760 L520 780 L640 640 Z" fill="#ffe3b8" opacity="0.28" />
          <path d="M1040 610 L1240 760 L1080 780 L960 640 Z" fill="#ffe3b8" opacity="0.28" />
        </g>
        {/* floor reflection */}
        <g opacity="0.24" filter={`url(#${id('soft2')})`} transform="translate(360 1178) scale(2.2 -2.2)">
          <path d="M66 204 C62 172 84 140 120 128 L280 128 C316 140 338 172 334 204 Z" fill="#9aa9bd" opacity="0.5" />
          <path d="M78 150 L146 143 L150 160 L74 166 Z" fill="#ffe3b8" opacity="0.8" />
          <path d="M322 150 L254 143 L250 160 L326 166 Z" fill="#ffe3b8" opacity="0.8" />
        </g>
      </g>

      {/* ————— atmosphere ————— */}
      <g className="scene-atmosphere">
        <ellipse cx="800" cy="470" rx="800" ry="300" fill={`url(#${id('haze')})`} opacity="0.5" />
        <rect width="1600" height="900" fill="none" stroke="#05070b" strokeWidth="150" opacity="0.55" />
      </g>
    </svg>
  );
}
