import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { Link } from 'react-router-dom';
import '../App.css';


// --COLUMN-----------------------------------------------------------------------


const COLUMNS = [
  { key: 'customer', label: 'Customer' },
  { key: 'order', label: 'Order' },
  { key: 'amount', label: 'Amount' },
  { key: 'trigger', label: 'Trigger / Rule' },
  { key: 'priorHold', label: 'Prior Hold Reason' },
  { key: 'jdeSync', label: 'JDE Sync' },
  { key: 'released', label: 'Released' },
  { key: 'audit', label: 'Audit' },
];

// ── Data ──────────────────────────────────────────────────────────────────────

const autoReleaseEvents = [
  {
    customer: 'Peak Outdoors',
    order: 'ORD-77298',
    amount: '—',
    trigger: 'AUTO-RELEASE-PAYMENT',
    priorHold: '—',
    jdeSync: 'Acknowledged',
    released: '392d ago',
    audit: 'CASE-2505',
  },
  {
    customer: 'SportMax Dealers',
    order: 'ORD-77390',
    amount: '$95K',
    trigger: 'AUTO-RELEASE-RETURN',
    priorHold: 'Awaiting return posting',
    jdeSync: 'Acknowledged',
    released: '12d ago',
    audit: 'CASE-2503',
  },
  {
    customer: 'Alpine Equipment Co',
    order: 'ORD-77210',
    amount: '$180K',
    trigger: 'AUTO-RELEASE-DISPUTE',
    priorHold: 'Open dispute',
    jdeSync: 'Pending',
    released: '5d ago',
    audit: 'CASE-2490',
  },
  {
    customer: 'ProGear Distribution',
    order: 'ORD-77100',
    amount: '$220K',
    trigger: 'AUTO-RELEASE-OVERRIDE',
    priorHold: 'Manual hold by credit',
    jdeSync: 'Acknowledged',
    released: '3d ago',
    audit: 'CASE-2480',
  },
];


// ── Helpers ───────────────────────────────────────────────────────────────────

function TriggerTag({ trigger }) {
  return <span className="ar-trigger-tag">{trigger}</span>;
}

function JdeBadge({ status }) {
  const cls = status === 'Acknowledged' ? 'ar-jde-ack' : 'ar-jde-pending';
  return <span className={`ar-jde-badge ${cls}`}>{status}</span>;
}

function renderCell(event, key) {
  if (key === 'order') {
    return <Link to="/held-orders" className="ar-link">{event.order}</Link>;
  }

  if (key === 'trigger') {
    return <TriggerTag trigger={event.trigger} />;
  }

  if (key === 'jdeSync') {
    return <JdeBadge status={event.jdeSync} />;
  }

  if (key === 'audit') {
    return <Link to="/cases" className="ar-link">{event.audit}</Link>;
  }

  return event[key];
}
// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 3;

export default function AutoReleased() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() =>
    filter === 'all'
      ? autoReleaseEvents
      : autoReleaseEvents.filter(e => e.jdeSync.toLowerCase() === filter),
    [filter]
  );

  const totalPages      = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedEvents = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="dashboard">

      <PageHeader
        icon={<CheckCircle2 size={20} color="#16a34a" />}
        iconBg="#f0fdf4"
        title="Recently Auto-Released"
        subtitle="Orders released by the auto-release engine after a qualifying resolution event (payment, return posting, dispute resolution, override)."
      />

      {/* Table card */}
      <div className="card ar-table-card">
        <div className="ar-results-label">
          {filtered.length} auto-release event{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Scroll wrapper — lets users swipe horizontally to see all columns */}
        <div className="ar-table-scroll">
          <table className="ar-table">
            <thead>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col.key} scope="col">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map(event => (
                <tr key={event.audit}>
                  {COLUMNS.map(col => (
                    <td key={col.key}>{renderCell(event, col.key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="chr-pagination">
          <span className="chr-page-info">
            {filtered.length === 0 ? '0 rows' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} rows`}
          </span>
          <div className="chr-page-btns">
            <button className="chr-page-btn" onClick={() => setPage(1)} disabled={page === 1} aria-label="First page">«</button>
            <button className="chr-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`chr-page-btn${page === n ? ' chr-page-btn-active' : ''}`} onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={page === n ? 'page' : undefined}>{n}</button>
            ))}
            <button className="chr-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
            <button className="chr-page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
