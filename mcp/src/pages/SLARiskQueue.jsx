/**
 * SLARiskQueue.jsx
 *
 * All operational objects at or near SLA breach — holds, disputes,
 * collections, credit reviews, and JDE exceptions.
 *
 * Mobile layout matches reference: responsive header, wrapping filter tabs
 * with counts, horizontally-scrollable table.
 *
 * WCAG 2.2: h1 heading, aria-pressed on tabs, aria-live on result count,
 *           scope="col" on headers, skip link, decorative icons hidden.
 */

import React, { useState, useMemo } from 'react';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const slaItems = [
  { type: 'Credit Review', id: 'CASE-2501', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',    due: '48h target', time: '4h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-77321', action: 'Escalated',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2504', customer: 'ProGear Distribution',   owner: 'Unassigned',  due: '72h target', time: '2h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-77351', action: 'Waiting on Dealer',   category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2506', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',    due: '48h target', time: '+36h over', timeOver: true,  severity: 'Breached',    related: 'ORD-77260', action: 'Escalated',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2604', customer: 'Scheels All Sports',     owner: 'Jane Doe',    due: '72h target', time: '+7h over',  timeOver: true,  severity: 'Near Breach', related: 'ORD-80005', action: 'Waiting on Payment', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2605', customer: 'Scheels All Sports',     owner: 'Unassigned',  due: '72h target', time: '3h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-80006', action: 'In Review',           category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2607', customer: 'Costco Wholesale Golf',  owner: 'Unassigned',  due: '72h target', time: '+3h over',  timeOver: true,  severity: 'Near Breach', related: 'ORD-80009', action: 'In Review',           category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2608', customer: 'Walmart Golf Division',  owner: 'Unassigned',  due: '72h target', time: '+3h over',  timeOver: true,  severity: 'Near Breach', related: 'ORD-80012', action: 'Needs Escalation',   category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2610', customer: 'Golfsmith Direct',       owner: 'Jane Doe',    due: '72h target', time: '1h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-80015', action: 'In Review',           category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2611', customer: 'TrailBlaze Inc',         owner: 'Unassigned',  due: '48h target', time: '+12h over', timeOver: true,  severity: 'Breached',    related: 'ORD-80018', action: 'Escalated',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2612', customer: 'Peak Outdoors',          owner: 'Jane Doe',    due: '72h target', time: '5h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-80020', action: 'Waiting on Dealer',  category: 'credit_review' },
  { type: 'Hold',          id: 'ORD-77342', customer: 'ProGear Distribution',   owner: 'J. Lopez',    due: '24h target', time: '+2h over',  timeOver: true,  severity: 'Near Breach', related: 'DLR-002',   action: 'Needs Release',      category: 'hold'          },
  { type: 'Hold',          id: 'ORD-94705', customer: 'Peak Outdoors',          owner: 'J. Lopez',    due: '24h target', time: '+8h over',  timeOver: true,  severity: 'Breached',    related: 'DLR-005',   action: 'Escalated',          category: 'hold'          },
  { type: 'Hold',          id: 'ORD-77321', customer: 'Alpine Equipment Co',    owner: 'T. Kim',      due: '24h target', time: '1h left',   timeOver: false, severity: 'Near Breach', related: 'DLR-001',   action: 'Pending Review',     category: 'hold'          },
  { type: 'Hold',          id: 'ORD-94496', customer: 'TrailBlaze Inc',         owner: 'J. Lopez',    due: '48h target', time: '6h left',   timeOver: false, severity: 'Near Breach', related: 'DLR-004',   action: 'Awaiting Payment',   category: 'hold'          },
  { type: 'Dispute',       id: 'DISP-7001', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',    due: '5d target',  time: '+2d over',  timeOver: true,  severity: 'Breached',    related: 'INV-30021', action: 'Escalated',          category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7002', customer: 'SportMax Dealers',       owner: 'T. Kim',      due: '5d target',  time: '1d left',   timeOver: false, severity: 'Near Breach', related: 'INV-30032', action: 'Waiting on Return',  category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7003', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',    due: '5d target',  time: '+1d over',  timeOver: true,  severity: 'Near Breach', related: 'INV-30019', action: 'In Review',           category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7004', customer: 'Golfsmith Direct',       owner: 'Unassigned',  due: '5d target',  time: '3h left',   timeOver: false, severity: 'Near Breach', related: 'INV-30040', action: 'Needs Response',     category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7005', customer: 'Costco Wholesale Golf',  owner: 'Unassigned',  due: '5d target',  time: '+4h over',  timeOver: true,  severity: 'Near Breach', related: 'INV-30055', action: 'Waiting on Dealer',  category: 'dispute'       },
  { type: 'Collections',   id: 'CASE-2502', customer: 'Alpine Equipment Co',    owner: 'Mike Chen',   due: '3d target',  time: '+1d over',  timeOver: true,  severity: 'Breached',    related: 'INV-30021', action: 'Escalated',          category: 'collections'   },
  { type: 'Collections',   id: 'CASE-2503', customer: 'SportMax Dealers',       owner: 'T. Kim',      due: '3d target',  time: '4h left',   timeOver: false, severity: 'Near Breach', related: 'INV-30032', action: 'In Review',           category: 'collections'   },
];

const FILTER_CONFIG = [
  { key: 'all',           label: 'All'           },
  { key: 'hold',          label: 'Hold'          },
  { key: 'dispute',       label: 'Dispute'       },
  { key: 'collections',   label: 'Collections'   },
  { key: 'credit_review', label: 'Credit Review' },
  { key: 'jde_exception', label: 'JDE Exception' },
];

const COLUMNS = [
  { key: 'type',     label: 'Type',            render: item => <span className="sla-type-badge">{item.type}</span>                                        },
  { key: 'id',       label: 'ID',              render: item => <Link to="/cases" className="sla-id-link">{item.id}</Link>                                 },
  { key: 'customer', label: 'Customer',        className: 'sla-td-customer'                                                                               },
  { key: 'owner',    label: 'Owner',           className: item => `sla-td-owner${item.owner === 'Unassigned' ? ' sla-unassigned' : ''}`                   },
  { key: 'due',      label: 'Due',             className: 'sla-td-due'                                                                                    },
  { key: 'time',     label: 'Time',            render: item => <span className={item.timeOver ? 'sla-time-over' : 'sla-time-left'}>{item.time}</span>     },
  { key: 'severity', label: 'Severity',        render: item => <span className={`sla-severity-badge ${item.severity === 'Breached' ? 'sla-badge-breached' : 'sla-badge-near'}`}>{item.severity}</span> },
  { key: 'related',  label: 'Related',         className: 'sla-td-related'                                                                                },
  { key: 'action',   label: 'Required Action', className: 'sla-td-action'                                                                                 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SLAHeader() {
  return (
    <header className="sla-page-header">
      <div className="sla-header-icon" aria-hidden="true">
        <Timer size={18} color="#f59e0b" />
      </div>
      <div className="sla-header-content">
        <h1 className="sla-title">SLA Risk Queue</h1>
        <p className="sla-subtitle">
          All operational objects (holds, disputes, collections, credit reviews,
          JDE exceptions) at or near SLA breach
        </p>
      </div>
    </header>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

export default function SLARiskQueue() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filterTabs = useMemo(() =>
    FILTER_CONFIG.map(tab => ({
      ...tab,
      count: tab.key === 'all'
        ? slaItems.length
        : slaItems.filter(item => item.category === tab.key).length,
    })),
  []);

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? slaItems
      : slaItems.filter(i => i.category === activeFilter),
    [activeFilter]
  );

  const totalPages     = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <a href="#sla-table" className="skip-link">Skip to SLA risk table</a>

      <div className="dashboard">

        <SLAHeader />

        {/* ── Filter tabs — wrap across lines on mobile ── */}
        <div className="sla-filter-tabs" role="group" aria-label="Filter by object type">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              className={`sla-filter-tab${activeFilter === tab.key ? ' sla-filter-tab-active' : ''}`}
              onClick={() => { setActiveFilter(tab.key); setPage(1); }}
              aria-pressed={activeFilter === tab.key}
            >
              {tab.label}
              <span className="sla-tab-count" aria-label={`${tab.count} items`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="card sla-table-card" id="sla-table">
          <div
            className="sla-results-label"
            aria-live="polite"
            aria-atomic="true"
          >
            {filtered.length} object(s) at SLA risk
            {filtered.length > 0 && ` — page ${page} of ${totalPages}`}
          </div>

          <div className="sla-table-scroll">
            <table className="sla-table" aria-label="SLA risk items">
              <caption className="visually-hidden">
                SLA risk objects filtered by {activeFilter}
              </caption>
              <thead>
                <tr>
                  {COLUMNS.map(col => (
                    <th key={col.key} scope="col">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(item => (
                  <tr key={item.id}>
                    {COLUMNS.map(col => {
                      const cls = typeof col.className === 'function'
                        ? col.className(item)
                        : col.className || '';
                      return (
                        <td key={col.key} className={cls}>
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      );
                    })}
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
    </>
  );
}
