import { lifecycleLabels } from '../lib/format.js';

const CLASS = {
  available: 'badge-ok',
  reserved: 'badge-warn',
  sold: 'badge-muted',
  withdrawn: 'badge-muted',
  draft: 'badge-muted',
  pending_review: 'badge-warn',
  published: 'badge-ok',
};

export function StatusBadge({ status, label }) {
  return <span className={`badge ${CLASS[status] || 'badge-muted'}`}>{label || lifecycleLabels[status] || status}</span>;
}
