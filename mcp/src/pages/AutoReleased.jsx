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

export default function AutoReleased() {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() =>
    filter === 'all'
      ? autoReleaseEvents
      : autoReleaseEvents.filter(e => e.jdeSync.toLowerCase() === filter),
    [filter]
  );

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
        <div className="ar-results-label">{filtered.length} auto-release event{filtered.length !== 1 ? 's' : ''}</div>
        <table className="ar-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                return <th key={col.key}>{col.label}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.audit}>
                {COLUMNS.map(col => (
                  <td key={col.key}>
                    {renderCell(event, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
