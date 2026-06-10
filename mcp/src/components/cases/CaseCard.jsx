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
  Critical: { background: '#dc2626', color: '#fff' },
  High:     { background: '#f97316', color: '#fff' },
  Medium:   { background: '#e2e8f0', color: '#475569' },
  Low:      { background: '#e2e8f0', color: '#64748b' },
};

export const statusBadge = {
  'Escalated':                { background: '#dc2626', color: '#fff' },
  'Breached SLA':             { background: '#991b1b', color: '#fff' },
  'Waiting on Dealer':        { background: '#f97316', color: '#fff' },
  'Waiting on Return Update': { background: '#f97316', color: '#fff' },
  'Near Breach':              { background: '#f59e0b', color: '#fff' },
  'Auto-Released':            { background: '#22c55e', color: '#fff' },
  'In Review':                { background: '#e2e8f0', color: '#475569' },
  'Open':                     { background: '#dbeafe', color: '#1d4ed8' },
  'Closed':                   { background: '#e2e8f0', color: '#64748b' },
};

const RIGHT_STATUSES = new Set(['Escalated', 'Breached SLA', 'Auto-Released']);

// Returns a colour for the SLA time text based on hours remaining
function slaColor(hoursLeft) {
  if (hoursLeft <= 0)  return '#dc2626';
  if (hoursLeft <= 4)  return '#dc2626';
  if (hoursLeft <= 12) return '#d97706';
  return '#64748b';
}

// Returns bar fill colour based on % elapsed
function barColor(progress) {
  if (progress >= 100) return '#dc2626';
  if (progress >= 85)  return '#f97316';
  if (progress >= 70)  return '#f59e0b';
  return '#3b82f6';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CaseCard({ c }) {
  const isBreached = c.slaHoursLeft <= 0;
  const progress   = isBreached
    ? 100
    : Math.min(100, ((c.slaTotalHours - c.slaHoursLeft) / c.slaTotalHours) * 100);
  const slaText    = isBreached
    ? `Breached +${Math.abs(c.slaHoursLeft)}h`
    : `${c.slaHoursLeft}h left of ${c.slaTotalHours}h`;

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

      {/* Row 4: Owner section — label, name + SLA bar, team */}
      <div className="case-card-owner-block">
        <div className="case-card-owner-label">Owner / Team</div>

        <div className="case-card-owner-sla">
          <span className="case-card-owner-name">{c.owner}</span>

          <div className="case-card-sla-inline">
            <Clock size={12} color="#94a3b8" aria-hidden="true" />
            <div className="case-card-sla-track" aria-hidden="true">
              <div
                className="progress-fill"
                style={{ width: `${progress}%`, background: barColor(progress) }}
              />
            </div>
            <span
              className="case-card-sla-text"
              style={{ color: slaColor(c.slaHoursLeft) }}
              aria-label={`SLA: ${slaText}`}
            >
              {slaText}
            </span>
          </div>
        </div>

        <div className="case-card-team">{c.team}</div>
      </div>

      {/* Row 5: Divider + footer (status label + time) */}
      <div className="case-card-footer-divider" />
      <div className="case-card-footer">
        {RIGHT_STATUSES.has(c.status) && (
          <span className="case-right-status">{c.status}</span>
        )}
        <span className="case-card-time">{c.createdAgo}</span>
      </div>

    </div>
  );
}
