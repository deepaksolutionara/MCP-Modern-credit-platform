/**
 * CaseCard.jsx
 *
 * Displays a single case as a rounded white card.
 * Mobile: vertical stacked layout matching reference screenshot.
 * Desktop: compact multi-column row layout.
 */
import React from 'react';
import { Clock } from 'lucide-react';

// ── Style maps ────────────────────────────────────────────────────────────────

export const priorityBadge = {
  Critical: { background: 'hsl(0 72% 51%)',  color: '#0f172a' },
  High:     { background: '#f59f0a',          color: '#0f172a' },
  Medium:   { background: '#e2e8f0',          color: '#475569' },
  Low:      { background: '#e2e8f0',          color: '#64748b' },
};

export const statusBadge = {
  'Escalated':                { background: 'hsl(0 72% 51%)',   color: '#0f172a' },
  'Breached SLA':             { background: '#991b1b',          color: '#0f172a' },
  'Waiting on Dealer':        { background: 'hsl(38 92% 50%)',  color: '#0f172a' },
  'Waiting on Return Update': { background: 'hsl(38 92% 50%)',  color: '#0f172a' },
  'Near Breach':              { background: '#f59e0b',          color: '#0f172a' },
  'Auto-Released':            { background: '#22c55e',          color: '#0f172a' },
  'In Review':                { background: '#e2e8f0',          color: '#0f172a' },
  'New':                      { background: '#2662d9',          color: '#fff'    },
  'Closed':                   { background: '#e2e8f0',          color: '#0f172a' },
};

const RIGHT_STATUSES = new Set(['Escalated', 'Breached SLA', 'Auto-Released']);

function slaColor(hoursLeft) {
  if (hoursLeft <= 0)  return '#dc2626';
  if (hoursLeft <= 4)  return '#dc2626';
  if (hoursLeft <= 12) return '#d97706';
  return '#64748b';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CaseCard({ c }) {
  const isBreached = c.slaHoursLeft <= 0;
  const SLA_MAX    = 72;
  const progress   = isBreached ? 0 : Math.min(100, (c.slaHoursLeft / SLA_MAX) * 100);
  const slaText    = isBreached
    ? `Breached +${Math.abs(c.slaHoursLeft)}h`
    : `${c.slaHoursLeft}h left of ${SLA_MAX}h`;

  return (
    <div className="case-card">

      {/* Row 1: Case ID + Priority + Status badges */}
      <div className="case-card-top">
        <span className="case-card-id">{c.id}</span>
        <span className="case-solid-badge" style={priorityBadge[c.priority]}>
          {c.priority}
        </span>
        <span className="case-solid-badge" style={statusBadge[c.status]}>
          {c.status}
        </span>
      </div>

      {/* Row 2: Dealer name */}
      <div className="case-card-dealer">{c.dealer}</div>

      {/* Row 3: Order · Decision refs */}
      <div className="case-card-refs">{c.orderId} · {c.decId}</div>

      {/* Row 4: Owner left / SLA right */}
      <div className="case-card-owner-block">
        <div className="case-card-owner-left">
          <div className="case-card-owner-label">Owner / Team</div>
          <div className="case-card-owner-name">{c.owner}</div>
          <div className="case-card-team">{c.team}</div>
        </div>

        <div className="case-card-sla-right" aria-label={`SLA: ${slaText}`}>
          <div className="case-card-sla-bar-row">
            <Clock size={12} color="#94a3b8" aria-hidden="true" />
            <div className="case-card-sla-track">
              <div className="progress-fill" style={{ width: `${progress}%`, background: '#2662d9' }} />
            </div>
          </div>
          <span className="case-card-sla-text" style={{ color: slaColor(c.slaHoursLeft) }}>
            {slaText}
          </span>
        </div>
      </div>

      {/* Row 5: Footer — status + time stacked right */}
      <div className="case-card-footer">
        {RIGHT_STATUSES.has(c.status) && (
          <span className="case-right-status">{c.status}</span>
        )}
        <span className="case-card-time">{c.createdAgo}</span>
      </div>

    </div>
  );
}
