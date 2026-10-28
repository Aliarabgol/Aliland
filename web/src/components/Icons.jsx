// Consistent stroke-based icon set. No emoji anywhere in the interface.

const P = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></>,
  heart: <path d="M12 20s-7-4.35-7-9.5A3.9 3.9 0 0 1 12 7.6 3.9 3.9 0 0 1 19 10.5C19 15.65 12 20 12 20Z" />,
  heartFilled: <path d="M12 20s-7-4.35-7-9.5A3.9 3.9 0 0 1 12 7.6 3.9 3.9 0 0 1 19 10.5C19 15.65 12 20 12 20Z" fill="currentColor" />,
  compare: <><path d="M12 4v16" /><path d="M5 8h5l-2.5 5L5 8Z" /><path d="M14 8h5l-2.5 5L14 8Z" /><path d="M7 16h4M13 16h4" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h10" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronStart: <path d="m14 6-6 6 6 6" />,
  chevronEnd: <path d="m10 6 6 6-6 6" />,
  arrowEnd: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  arrowStart: <><path d="M20 12H5" /><path d="m11 6-6 6 6 6" /></>,
  arrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  check: <path d="m5 13 4 4L19 7" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  gauge: <><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M13.4 10.6 16 8" /><path d="M4 18a9 9 0 1 1 16 0" /></>,
  fuel: <><path d="M5 20V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" /><path d="M5 12h8" /><path d="M13 9h3l3 3v6a2 2 0 0 1-4 0v-3h-2" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.8 7.8M16.2 16.2l2.2 2.2M18.4 5.6 16.2 7.8M7.8 16.2l-2.2 2.2" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
  car: <><path d="M4 15v-2.2a2 2 0 0 1 .3-1L7 7h10l2.7 4.8a2 2 0 0 1 .3 1V15" /><path d="M4 15h16v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2Z" /><path d="M7 11h10" /></>,
  shield: <><path d="M12 3 5 6v5c0 5 7 9 7 9s7-4 7-9V6l-7-3Z" /><path d="m9.2 11.8 2 2 3.6-4" /></>,
  scale: <><path d="M12 4v16" /><path d="M6 8h12" /><path d="M4 16 8 8l4 8H4Z" /><path d="M16 8l4 8h-8l4-8Z" /></>,
  sparkles: <><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" /><path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z" /></>,
  pin: <><path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" /><circle cx="12" cy="11" r="2.4" /></>,
  wrench: <path d="M15.5 4.5a4.5 4.5 0 0 0-5.9 5.9L4 16v4h4l5.6-5.6a4.5 4.5 0 0 0 5.9-5.9l-2.8 2.8-2.9-2.9 2.7-2.9Z" />,
  camera: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><circle cx="12" cy="13.5" r="3.4" /><path d="M8.5 7 10 4h4l1.5 3" /></>,
  doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 12h5M10 16h5" /></>,
  users: <><circle cx="9" cy="9" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 7.2a3 3 0 0 1 0 5.6" /><path d="M17.5 14.4A5 5 0 0 1 21 19" /></>,
  building: <><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" /><path d="M15 10h3a2 2 0 0 1 2 2v9" /><path d="M3 21h18" /><path d="M8 7h4M8 11h4M8 15h4" /></>,
  handshake: <><path d="m8 12 3-3 3 3 3-3 3 3-5 5-4-4" /><path d="M4 9l3-3 4 4" /><path d="M20 9l-3-3-2 2" /><path d="M6 14l4 4 2-2" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.4 4 5.3 4 8.5s-1.4 6.1-4 8.5c-2.6-2.4-4-5.3-4-8.5s1.4-6.1 4-8.5Z" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v5M14 11v5" /></>,
  edit: <><path d="M4 20h4l10-10-4-4L4 16v4Z" /><path d="m14.5 5.5 4 4" /></>,
  upload: <><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /><path d="M12 4v11" /><path d="m8 8 4-4 4 4" /></>,
  logout: <><path d="M14 5V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" /><path d="M9 12h11" /><path d="m17 8 4 4-4 4" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5-5 4 4 3-3 4 4" /></>,
  filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  alert: <><path d="M12 4 3 19h18L12 4Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v4.5l3 1.8" /></>,
  eye: <><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14 1 9-4 14-11 14H5Z" /><path d="M5 19c3-4 6-6 10-8" /></>,
  bolt: <path d="M13 3 5 14h5l-1 7 8-11h-5l1-7Z" />,
  star: <path d="m12 4 2.4 5.2 5.6.7-4.1 3.9 1 5.6-4.9-2.7-4.9 2.7 1-5.6L4 9.9l5.6-.7L12 4Z" />,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></>,
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  sliders: <><path d="M4 8h10M18 8h2M4 16h4M12 16h8" /><circle cx="16" cy="8" r="2" /><circle cx="10" cy="16" r="2" /></>,
};

export function Icon({ name, size = 20, filled = false, ...rest }) {
  const path = P[filled && name === 'heart' ? 'heartFilled' : name] || P.info;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
}

export const CATEGORY_ICON = {
  domestic: 'building',
  imported: 'globe',
  assembled: 'layers',
};

export const SERVICE_ICON = {
  buy: 'car',
  sell: 'handshake',
  inspection: 'shield',
  valuation: 'scale',
  'trade-in': 'route',
  installment: 'calendar',
  finder: 'sparkles',
  visit: 'pin',
  consultation: 'users',
  guides: 'doc',
};

export default Icon;
