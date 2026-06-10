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

import React, { useState, useMemo } from 'react';
import { Activity, RefreshCw, Clock, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
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

const FILTERS = [
  'All', 'AR balance change', 'Payment received', 'Dispute opened',
  'Dispute resolved', 'Return processed', 'Order modified',
  'Credit policy change', 'Ship date changed',
];

// ── Events dataset ────────────────────────────────────────────────────────────
// Empty until connected to a live API. Export still works — it will produce a
// header-only file rather than throwing an error.

const rdEvents = [];

// ── Upstream dataset ──────────────────────────────────────────────────────────

const upstreamEvents = [];

// ── Column maps ───────────────────────────────────────────────────────────────
// Each map defines the export column order and human-readable header labels.
// Having two separate maps keeps Events and Upstream exports independent.

const EVENT_COLUMNS = [
  { key: 'id',            label: 'Event ID'       },
  { key: 'orderId',       label: 'Order #'        },
  { key: 'dealer',        label: 'Dealer'         },
  { key: 'trigger',       label: 'Trigger'        },
  { key: 'prior',         label: 'Prior Decision' },
  { key: 'outcome',       label: 'New Decision'   },
  { key: 'exposureDelta', label: 'Exposure Δ'     },
  { key: 'source',        label: 'Source'         },
  { key: 'when',          label: 'When'           },
];

const UPSTREAM_COLUMNS = [
  { key: 'id',           label: 'Event ID'      },
  { key: 'orderId',      label: 'Order #'       },
  { key: 'dealer',       label: 'Dealer'        },
  { key: 'changeType',   label: 'Change Type'   },
  { key: 'field',        label: 'Field'         },
  { key: 'from',         label: 'From'          },
  { key: 'to',           label: 'To'            },
  { key: 'creditImpact', label: 'Credit Impact' },
  { key: 'when',         label: 'When'          },
];

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

// ── Timestamp helper ──────────────────────────────────────────────────────────
// Produces a compact, filename-safe string (no colons or slashes).

function fileTimestamp() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

// ── Export: CSV ───────────────────────────────────────────────────────────────
// Generic CSV exporter. Accepts the rows to export, the column map to use, and
// a base filename. Always exports whatever rows are passed in — callers are
// responsible for passing the correctly filtered set.

function exportToCSV(rows, columns, baseName) {
  const headers  = columns.map(c => c.label);
  const dataRows = rows.map(row =>
    columns.map(({ key }) => {
      const val = row[key] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csv  = [headers.join(','), ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href     = url;
  link.download = `${baseName}_${fileTimestamp()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

// ── Export: XLSX ──────────────────────────────────────────────────────────────
// Generic XLSX exporter. Same signature as exportToCSV for consistency.

function exportToXLSX(rows, columns, baseName, sheetName) {
  const sheetData = [
    columns.map(c => c.label),
    ...rows.map(row => columns.map(({ key }) => row[key] ?? '')),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${baseName}_${fileTimestamp()}.xlsx`);
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * EventsTab — renders the trigger-filtered re-decisioning events table.
 * Receives the already-filtered rows from the parent so the parent can also
 * pass those same rows to the export handlers.
 */
function EventsTab({ rows }) {
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
          {rows.map(e => (
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
    </div>
  );
}

/**
 * UpstreamTab — renders the upstream order-change log table.
 * No filter UI; always shows all upstreamEvents.
 */
function UpstreamTab() {
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
          {upstreamEvents.map(e => (
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

  // Dispatches the correct export based on which tab is currently visible.
  // Events tab  → exports filteredEvents (respects trigger-filter pill).
  // Upstream tab → exports all upstreamEvents (no filter exists there).
  function handleCSV() {
    if (activeTab === 'events') {
      exportToCSV(filteredEvents, EVENT_COLUMNS, 'redecisioning_history_events');
    } else {
      exportToCSV(upstreamEvents, UPSTREAM_COLUMNS, 'redecisioning_history_upstream');
    }
  }

  function handleXLSX() {
    if (activeTab === 'events') {
      exportToXLSX(filteredEvents, EVENT_COLUMNS, 'redecisioning_history_events', 'Events');
    } else {
      exportToXLSX(upstreamEvents, UPSTREAM_COLUMNS, 'redecisioning_history_upstream', 'Upstream Changes');
    }
  }

  return (
    <div className="dashboard">

      {/* ── Page header with export buttons ─────────────────────────────── */}
      <PageHeader
        icon={<Activity size={18} color="#3b82f6" />}
        title="Re-Decisioning History"
        subtitle="DB-backed audit of every recalculation triggered by AR changes, disputes, returns, payments, policy updates, and ship-date changes."
        actions={
          <div className="chr-export-btns">
            {/* Exports the currently visible tab's filtered data */}
            <button onClick={handleCSV}  className="chr-btn-csv">
              <FileText size={13} /> CSV
            </button>
            <button onClick={handleXLSX} className="chr-btn-xlsx">
              <Download size={13} /> XLSX
            </button>
          </div>
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
