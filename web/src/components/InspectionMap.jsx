const PART_LABELS = {
  kaput: 'کاپوت',
  roof: 'سقف',
  front_door_r: 'درب جلو راست',
  front_door_l: 'درب جلو چپ',
  rear_door_r: 'درب عقب راست',
  rear_door_l: 'درب عقب چپ',
  fender_r: 'گلگیر جلو راست',
  fender_l: 'گلگیر جلو چپ',
  trunk: 'صندوق',
  bumper_f: 'سپر جلو',
  bumper_r: 'سپر عقب',
};

const STATUS = {
  ok: { label: 'بدون ایراد', cls: 'part-ok' },
  painted: { label: 'رنگ‌شده', cls: 'part-painted' },
  replaced: { label: 'تعویض‌شده', cls: 'part-replaced' },
  damaged: { label: 'آسیب‌دیده', cls: 'part-damaged' },
  unknown: { label: 'بررسی‌نشده', cls: 'part-unknown' },
};

export function InspectionMap({ bodyParts = {} }) {
  const entries = Object.keys(PART_LABELS).map((key) => {
    const status = bodyParts?.[key] || 'unknown';
    return { key, label: PART_LABELS[key], status: STATUS[status] ? status : 'unknown' };
  });

  return (
    <div>
      <div className="inspection-grid">
        {entries.map((p) => {
          const s = STATUS[p.status];
          return (
            <div key={p.key} className={`inspection-part ${s.cls}`}>
              <span className="part-name">{p.label}</span>
              <span className="part-status">{s.label}</span>
            </div>
          );
        })}
      </div>
      <p className="muted small">
        «بررسی‌نشده» با «سالم» یکی نیست. این نمودار نمای عمومی وضعیت بدنه است و مدل سه‌بعدی اختصاصی خودرو محسوب نمی‌شود.
      </p>
    </div>
  );
}
