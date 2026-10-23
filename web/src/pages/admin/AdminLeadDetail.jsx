import { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { ErrorState } from '../../components/States.jsx';
import { dateLabel, leadStatusLabels, leadTypeLabels } from '../../lib/format.js';

const STATUSES = ['new', 'contacted', 'scheduled', 'won', 'lost', 'closed'];

export default function AdminLeadDetail() {
  const { id } = useParams();
  const { user } = useOutletContext();
  const [lead, setLead] = useState(null);
  const [staff, setStaff] = useState([]);
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api
      .get(`/admin/leads/${id}`)
      .then((r) => {
        setLead(r.lead);
        setStatus(r.lead.status);
        setAssignedTo(r.lead.assigned_to ? String(r.lead.assigned_to) : '');
      })
      .catch((e) => setError(e.message));
    if (user.role === 'admin') {
      api.get('/admin/staff').then((r) => setStaff(r.items)).catch(() => setStaff([]));
    }
  }, [id, user.role]);

  const save = async () => {
    setNotice('');
    try {
      const body = { status };
      if (user.role === 'admin') body.assignedTo = assignedTo || null;
      const r = await api.patch(`/admin/leads/${id}`, body);
      setLead(r.lead);
      setNotice('ذخیره شد.');
    } catch (e) {
      setNotice(e.message);
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!lead) return <div className="skeleton skeleton-block" />;

  const payload = lead.payload || {};

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>درخواست {lead.public_code}</h1>
          <p className="muted">{leadTypeLabels[lead.type] || lead.type} · {dateLabel(lead.created_at)}</p>
        </div>
        <Link to="/admin/leads" className="btn btn-ghost">بازگشت</Link>
      </header>

      <div className="two-col">
        <div className="panel">
          <h2>اطلاعات تماس</h2>
          <dl className="spec-grid tight">
            <div><dt>نام</dt><dd>{lead.name}</dd></div>
            <div><dt>موبایل</dt><dd dir="ltr">{lead.phone}</dd></div>
            {lead.vehicle_id && <div><dt>خودرو</dt><dd><Link to={`/admin/vehicles/${lead.vehicle_id}`}>#{lead.vehicle_id}</Link></dd></div>}
            {lead.preferred_date && <div><dt>تاریخ پیشنهادی</dt><dd>{dateLabel(lead.preferred_date)}</dd></div>}
            {lead.preferred_slot && <div><dt>بازه</dt><dd>{lead.preferred_slot}</dd></div>}
          </dl>

          <h3>جزئیات درخواست</h3>
          <dl className="spec-grid tight">
            {Object.entries(payload)
              .filter(([k]) => !['name', 'phone', 'privacy', 'message', 'description', 'preferredDate', 'preferredSlot', 'vehicleId'].includes(k))
              .filter(([, v]) => v !== null && v !== '')
              .map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>
              ))}
          </dl>
          {(payload.message || payload.description) && (
            <div className="panel-inset">
              <h3>پیام</h3>
              <p>{payload.message || payload.description}</p>
            </div>
          )}
        </div>

        <div className="panel">
          <h2>پیگیری</h2>
          <div className="field">
            <label htmlFor="l-status">وضعیت</label>
            <select id="l-status" className="input select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{leadStatusLabels[s]}</option>)}
            </select>
          </div>
          {user.role === 'admin' && (
            <div className="field">
              <label htmlFor="l-assign">واگذاری به</label>
              <select id="l-assign" className="input select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                <option value="">واگذار نشده</option>
                {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {notice && <div className="form-message form-success" role="status">{notice}</div>}
          <button type="button" className="btn btn-primary" onClick={save}>ذخیره</button>
          <p className="muted small">کارشناس فروش فقط درخواست‌های واگذارشده به خود یا بدون واگذاری را می‌بیند.</p>
        </div>
      </div>
    </div>
  );
}
