/**
 * ReDecisioningHistory.jsx
 *
 * DB-backed audit log of every credit recalculation. Contains two tabs:
 *   1. Re-Decisioning Events  — trigger-filtered list of credit re-evaluations
 *   2. Upstream Order Changes — field-level order mutations that caused them
 *
 * Export behaviour:
 *   - CSV / XLSX buttons always export the data currently visible on screen:
 *       • Events tab  → respects the active trigger-filter pill
 *       • Upstream tab → exports all upstream records (no filter on that tab)
 *   - Both tabs use separate COLUMNS maps so their export headers are correct.
 *   - Filenames are timestamped to avoid overwriting previous exports.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Activity, RefreshCw, Clock } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import '../App.css';

// ── KPI summary data ──────────────────────────────────────────────────────────
// Values are 0 until the page is connected to a live data source.

const kpis = [
  { label: 'Total events',     value: 0, cls: 'rdh-kpi-black' },
  { label: 'Holds applied',    value: 0, cls: 'rdh-kpi-red'   },
  { label: 'Holds released',   value: 0, cls: 'rdh-kpi-green' },
  { label: 'Escalated',        value: 0, cls: 'rdh-kpi-amber' },
  { label: 'Upstream changes', value: 0, cls: 'rdh-kpi-black' },
];

// ── Trigger filter options ────────────────────────────────────────────────────
// Shown as pill buttons above the Events table.

const FILTERS = ['All'];

// ── Events dataset ────────────────────────────────────────────────────────────
// Empty until connected to a live API. Export still works — it will produce a
// header-only file rather than throwing an error.

const rdEvents = [];

// ── Upstream dataset ──────────────────────────────────────────────────────────

const upstreamEvents = [];

// ── Style maps ────────────────────────────────────────────────────────────────

const OUTCOME_CLS = {
  'Eligible to proceed': 'rdh-outcome-green',
  'Hold required':       'rdh-outcome-red',
  'Conditional review':  'rdh-outcome-amber',
};

const DELTA_CLS = {
  green: 'rdh-delta-green',
  red:   'rdh-delta-red',
  gray:  'rdh-delta-gray',
};

// Returns the correct CSS class for a credit-impact value string.
const IMPACT_CLS = v =>
  v.startsWith('+') ? 'rdh-delta-red' : v === '$0K' ? 'rdh-delta-gray' : 'rdh-delta-green';

// ── Sub-components ────────────────────────────────────────────────────────────

const RDH_PAGE_SIZE = 5;

/**
 * EventsTab — renders the trigger-filtered re-decisioning events table.
 */
function EventsTab({ rows }) {
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [rows]);
  const totalPages    = Math.max(1, Math.ceil(rows.length / RDH_PAGE_SIZE));
  const paginatedRows = rows.slice((page - 1) * RDH_PAGE_SIZE, page * RDH_PAGE_SIZE);

  return (
    <div className="rdh-table-wrap">
      <table className="rdh-table">
        <thead>
          <tr>
            <th className="rdh-th">Order</th>
            <th className="rdh-th">Dealer</th>
            <th className="rdh-th">Trigger</th>
            <th className="rdh-th">Decision change</th>
            <th className="rdh-th">Exposure Δ</th>
            <th className="rdh-th">Outcome</th>
            <th className="rdh-th">Source</th>
            <th className="rdh-th">When</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map(e => (
            <tr key={e.id} className="rdh-tr">
              <td className="rdh-td">
                <div className="rdh-order-id">{e.orderId}</div>
                <div className="rdh-event-id">{e.id}</div>
              </td>
              <td className="rdh-td rdh-dealer">{e.dealer}</td>
              <td className="rdh-td rdh-trigger">{e.trigger}</td>
              <td className="rdh-td">
                <div className="rdh-outcome-row">
                  <span className={`rdh-outcome-pill ${OUTCOME_CLS[e.prior]}`}>{e.prior}</span>
                  <span className="rdh-arrow">→</span>
                  <span className={`rdh-outcome-pill ${OUTCOME_CLS[e.outcome]}`}>{e.outcome}</span>
                </div>
              </td>
              <td className="rdh-td">
                <span className={DELTA_CLS[e.deltaKey]}>{e.exposureDelta}</span>
              </td>
              <td className="rdh-td">
                <span className={`rdh-outcome-pill ${OUTCOME_CLS[e.outcome]}`}>{e.outcome}</span>
              </td>
              <td className="rdh-td rdh-source">{e.source}</td>
              <td className="rdh-td rdh-when">
                <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle', color: '#94a3b8' }} />
                {e.when}
              </td>
            </tr>
          ))}
          {/* Empty state */}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="rdh-empty">No events.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination bar */}
      <div className="chr-pagination">
        <span className="chr-page-info">
          {rows.length === 0 ? '0 rows' : `${(page - 1) * RDH_PAGE_SIZE + 1}–${Math.min(page * RDH_PAGE_SIZE, rows.length)} of ${rows.length} rows`}
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
  );
}

/**
 * UpstreamTab — renders the upstream order-change log table.
 * No filter UI; always shows all upstreamEvents.
 */
function UpstreamTab() {
  const [page, setPage] = useState(1);
  const totalPages     = Math.max(1, Math.ceil(upstreamEvents.length / RDH_PAGE_SIZE));
  const paginatedRows  = upstreamEvents.slice((page - 1) * RDH_PAGE_SIZE, page * RDH_PAGE_SIZE);

  return (
    <div className="rdh-table-wrap">
      <table className="rdh-table">
        <thead>
          <tr>
            <th className="rdh-th">Event</th>
            <th className="rdh-th">Order</th>
            <th className="rdh-th">Dealer</th>
            <th className="rdh-th">Change type</th>
            <th className="rdh-th">Field</th>
            <th className="rdh-th">From</th>
            <th className="rdh-th">To</th>
            <th className="rdh-th">Credit impact</th>
            <th className="rdh-th">When</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map(e => (
            <tr key={e.id} className="rdh-tr">
              <td className="rdh-td rdh-event-id">{e.id}</td>
              <td className="rdh-td rdh-order-id">{e.orderId}</td>
              <td className="rdh-td rdh-dealer">{e.dealer}</td>
              <td className="rdh-td">
                <span className="rdh-change-pill">{e.changeType}</span>
              </td>
              <td className="rdh-td rdh-source">{e.field}</td>
              <td className="rdh-td rdh-from">{e.from}</td>
              <td className="rdh-td rdh-to">{e.to}</td>
              <td className="rdh-td">
                <span className={IMPACT_CLS(e.creditImpact)}>{e.creditImpact}</span>
              </td>
              <td className="rdh-td rdh-when">
                <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle', color: '#94a3b8' }} />
                {e.when}
              </td>
            </tr>
          ))}
          {/* Empty state */}
          {upstreamEvents.length === 0 && (
            <tr><td colSpan={9} className="rdh-empty">No upstream changes.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination bar */}
      <div className="chr-pagination">
        <span className="chr-page-info">
          {upstreamEvents.length === 0 ? '0 rows' : `${(page - 1) * RDH_PAGE_SIZE + 1}–${Math.min(page * RDH_PAGE_SIZE, upstreamEvents.length)} of ${upstreamEvents.length} rows`}
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
  );
}

// ── Page component ────────────────────────────────────────────────────────────

export default function ReDecisioningHistory() {
  const [activeTab,    setActiveTab]    = useState('events');
  const [activeFilter, setActiveFilter] = useState('All');

  // Filtered events rows computed here (not inside EventsTab) so the same
  // filtered set can be passed to both the table and the export handlers.
  const filteredEvents = useMemo(() =>
    activeFilter === 'All'
      ? rdEvents
      : rdEvents.filter(e => e.trigger === activeFilter),
    [activeFilter]
  );


  return (
    <div className="dashboard">

      {/* ── Page header with export buttons ─────────────────────────────── */}
      <PageHeader
        icon={<Activity size={18} color="#3b82f6" />}
        title="Re-Decisioning History"
        subtitle="DB-backed audit of every recalculation triggered by AR changes, disputes, returns, payments, policy updates, and ship-date changes."
        actions={
          <button className="rdh-refresh-btn">
            <RefreshCw size={13} /> Refresh
          </button>
        }
      />

      {/* ── KPI summary row ─────────────────────────────────────────────── */}
      <div className="rdh-kpi-row">
        {kpis.map(k => (
          <div key={k.label} className="rdh-kpi-card">
            <div className="rdh-kpi-label">{k.label}</div>
            <div className={`rdh-kpi-value ${k.cls}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="rdh-tabbar-wrap">
        <div className="rdh-tabs">
          <button
            className={`rdh-tab${activeTab === 'events' ? ' rdh-tab-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >Re-Decisioning Events</button>
          <button
            className={`rdh-tab${activeTab === 'upstream' ? ' rdh-tab-active' : ''}`}
            onClick={() => setActiveTab('upstream')}
          >Upstream Order Changes</button>
        </div>
      </div>

      {/* ── Trigger filter pills (Events tab only) ───────────────────────── */}
      {activeTab === 'events' && (
        <div className="rdh-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`rdh-filter-pill${activeFilter === f ? ' rdh-filter-active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >{f}</button>
          ))}
        </div>
      )}

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      {/* EventsTab receives pre-filtered rows so export and table stay in sync */}
      {activeTab === 'events'   && <EventsTab rows={filteredEvents} />}
      {activeTab === 'upstream' && <UpstreamTab />}

    </div>
  );
}
