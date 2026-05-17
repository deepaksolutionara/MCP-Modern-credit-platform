import React from 'react';
import { Clock } from 'lucide-react';

export const priorityBadge = {
  Critical: { background: '#dc2626', color: '#fff' },
  High:     { background: '#f97316', color: '#fff' },
  Medium:   { background: '#e2e8f0', color: '#475569' },
  Low:      { background: '#e2e8f0', color: '#64748b' },
};

export const statusBadge = {
  'Escalated':               { background: '#dc2626', color: '#fff' },
  'Breached SLA':            { background: '#991b1b', color: '#fff' },
  'Waiting on Dealer':       { background: '#f97316', color: '#fff' },
  'Waiting on Return Update':{ background: '#f97316', color: '#fff' },
  'Near Breach':             { background: '#f59e0b', color: '#fff' },
  'Auto-Released':           { background: '#22c55e', color: '#fff' },
  'In Review':               { background: '#e2e8f0', color: '#475569' },
  'Open':                    { background: '#dbeafe', color: '#1d4ed8' },
  'Closed':                  { background: '#e2e8f0', color: '#64748b' },
};

const RIGHT_STATUSES = new Set(['Escalated', 'Breached SLA', 'Auto-Released']);

function slaColor(hoursLeft) {
  if (hoursLeft <= 0)  return '#dc2626';
  if (hoursLeft <= 4)  return '#dc2626';
  if (hoursLeft <= 12) return '#d97706';
  return '#64748b';
}

export default function CaseCard({ c }) {
  const isBreached = c.slaHoursLeft <= 0;
  const progress   = isBreached ? 0 : Math.min(100, (c.slaHoursLeft / c.slaTotalHours) * 100);
  const slaText    = isBreached
    ? `Breached +${Math.abs(c.slaHoursLeft)}h`
    : `${c.slaHoursLeft}h left of ${c.slaTotalHours}h`;

  return (
    <div className="case-card">

      {/* Left — case identity */}
      <div className="case-card-left">
        <div className="case-card-meta">
          <span className="case-card-id">{c.id}</span>
          <span className="case-solid-badge" style={priorityBadge[c.priority]}>{c.priority}</span>
          <span className="case-solid-badge" style={statusBadge[c.status]}>{c.status}</span>
        </div>
        <div className="case-card-dealer">{c.dealer}</div>
        <div className="case-card-refs">{c.orderId} · {c.decId}</div>
      </div>

      {/* Middle — owner */}
      <div className="case-card-owner">
        <div className="case-card-owner-label">Owner / Team</div>
        <div className="case-card-owner-name">{c.owner}</div>
        <div className="case-card-team">{c.team}</div>
      </div>

      {/* SLA bar */}
      <div className="case-card-sla">
        <div className="case-card-sla-row">
          <Clock size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
          <div className="case-card-sla-track">
            {!isBreached && (
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            )}
          </div>
        </div>
        <div className="case-card-sla-text" style={{ color: slaColor(c.slaHoursLeft) }}>
          {slaText}
        </div>
      </div>

      {/* Far right — optional status + time */}
      <div className="case-card-far-right">
        {RIGHT_STATUSES.has(c.status) && (
          <span className="case-right-status">{c.status}</span>
        )}
        <span className="case-card-time">{c.createdAgo}</span>
      </div>

    </div>
  );
}
