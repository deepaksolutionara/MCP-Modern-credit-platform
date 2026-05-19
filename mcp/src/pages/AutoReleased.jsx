import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const autoReleaseEvents = [
  {
    customer:      'Peak Outdoors',
    order:         'ORD-77298',
    amount:        '—',
    trigger:       'AUTO-RELEASE-PAYMENT',
    priorHold:     '—',
    jdeSync:       'Acknowledged',
    released:      '392d ago',
    audit:         'CASE-2505',
  },
  {
    customer:      'SportMax Dealers',
    order:         'ORD-77390',
    amount:        '$95K',
    trigger:       'AUTO-RELEASE-RETURN',
    priorHold:     'Awaiting return posting',
    jdeSync:       'Acknowledged',
    released:      '12d ago',
    audit:         'CASE-2503',
  },
  {
    customer:      'Alpine Equipment Co',
    order:         'ORD-77210',
    amount:        '$180K',
    trigger:       'AUTO-RELEASE-DISPUTE',
    priorHold:     'Open dispute',
    jdeSync:       'Pending',
    released:      '5d ago',
    audit:         'CASE-2490',
  },
  {
    customer:      'ProGear Distribution',
    order:         'ORD-77100',
    amount:        '$220K',
    trigger:       'AUTO-RELEASE-OVERRIDE',
    priorHold:     'Manual hold by credit',
    jdeSync:       'Acknowledged',
    released:      '3d ago',
    audit:         'CASE-2480',
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

      {/* Header */}
      <div className="ar-page-header">
        <div className="ar-header-icon">
          <CheckCircle2 size={22} color="#16a34a" />
        </div>
        <div>
          <div className="dash-title">Recently Auto-Released</div>
          <div className="dash-sub">
            Orders released by the auto-release engine after a qualifying resolution event
            (payment, return posting, dispute resolution, override).
            Each row links to the case, decision, and JDE confirmation.
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="card ar-table-card">
        <div className="ar-results-label">{filtered.length} auto-release event{filtered.length !== 1 ? 's' : ''}</div>
        <table className="ar-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Trigger / Rule</th>
              <th>Prior Hold Reason</th>
              <th>JDE Sync</th>
              <th>Released</th>
              <th>Audit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i}>
                <td className="ar-td-customer">{e.customer}</td>
                <td><Link to="/held-orders" className="ar-link">{e.order}</Link></td>
                <td className="ar-td-meta">{e.amount}</td>
                <td><TriggerTag trigger={e.trigger} /></td>
                <td className="ar-td-meta">{e.priorHold}</td>
                <td><JdeBadge status={e.jdeSync} /></td>
                <td className="ar-td-meta">{e.released}</td>
                <td><Link to="/cases" className="ar-link">{e.audit}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
