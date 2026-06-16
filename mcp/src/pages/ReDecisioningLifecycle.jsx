import React, { useState } from 'react';
import { Activity, RefreshCw, Info, Clock } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import '../App.css';

// ── KPIs ─────────────────────────────────────────────────────────────────────

const kpis = [
  { label: 'Re-evaluations (24h)',    value: 6, cls: 'rdc-kpi-black' },
  { label: 'Holds required',          value: 2, cls: 'rdc-kpi-red'   },
  { label: 'Conditional',             value: 2, cls: 'rdc-kpi-amber' },
  { label: 'Cleared / Auto-released', value: 2, cls: 'rdc-kpi-green' },
  { label: 'JDE sync ops',            value: 6, cls: 'rdc-kpi-black' },
];

// ── Logic & Impact metadata ───────────────────────────────────────────────────

const metaRows = [
  { left: 'Triggers monitored',      leftVal: '10 event types', right: 'Recalculation latency',          rightVal: '< 5s p95'           },
  { left: 'JDE acknowledgement SLA', leftVal: '< 30s',          right: 'Pre-fulfillment review cadence', rightVal: 'Every 4h + on-event' },
];

const tags = ['Credit Policy v1.8', 'Source: Decision Engine + JDE'];

// ── Filters ───────────────────────────────────────────────────────────────────

const FILTERS = [
  'All', 'Scheduled pre-fulfillment review', 'AR balance change', 'Payment received',
  'Dispute opened', 'Dispute resolved', 'Return processed', 'Order modified',
  'Credit policy change', 'Ship date changed',
];

// ── Events data ───────────────────────────────────────────────────────────────

const rdEvents = [
  {
    id: 'RD-5001', orderId: 'ORD-77298', customer: 'Peak Outdoors',
    stage: 'Pick/Pack',  stageKey: 'pickpack',
    trigger: 'Payment received',
    prior: 'Hold required',       outcome: 'Eligible to proceed',
    exposureDelta: '$-65K',  deltaKey: 'green',
    jde: 'Release',    jdeKey: 'green',
    when: '398d ago',
  },
  {
    id: 'RD-5002', orderId: 'ORD-77321', customer: 'Alpine Equipment Co',
    stage: 'Allocated',  stageKey: 'allocated',
    trigger: 'AR balance change',
    prior: 'Hold required',       outcome: 'Hold required',
    exposureDelta: '$0K',    deltaKey: 'gray',
    jde: 'No change', jdeKey: 'gray',
    when: '398d ago',
  },
  {
    id: 'RD-5003', orderId: 'ORD-77342', customer: 'ProGear Distribution',
    stage: 'Scheduled',  stageKey: 'scheduled',
    trigger: 'Dispute opened',
    prior: 'Eligible to proceed', outcome: 'Conditional review',
    exposureDelta: '+$11K',  deltaKey: 'red',
    jde: 'Hold DS',    jdeKey: 'red',
    when: '398d ago',
  },
  {
    id: 'RD-5004', orderId: 'ORD-77390', customer: 'SportMax Dealers',
    stage: 'Allocated',  stageKey: 'allocated',
    trigger: 'Return processed',
    prior: 'Conditional review',  outcome: 'Hold required',
    exposureDelta: '+$15K',  deltaKey: 'red',
    jde: 'Hold PR',    jdeKey: 'red',
    when: '398d ago',
  },
  {
    id: 'RD-5005', orderId: 'ORD-77351', customer: 'ProGear Distribution',
    stage: 'Prebooked',  stageKey: 'prebooked',
    trigger: 'Order modified',
    prior: 'Hold required',       outcome: 'Conditional review',
    exposureDelta: '$-45K',  deltaKey: 'green',
    jde: 'Hold RV',    jdeKey: 'red',
    when: '398d ago',
  },
  {
    id: 'RD-5006', orderId: 'ORD-77411', customer: 'TrailBlaze Inc',
    stage: 'Submitted',  stageKey: 'submitted',
    trigger: 'Scheduled pre-fulfillment review',
    prior: 'Eligible to proceed', outcome: 'Eligible to proceed',
    exposureDelta: '$0K',    deltaKey: 'gray',
    jde: 'No change', jdeKey: 'gray',
    when: '398d ago',
  },
];

// ── Style maps ────────────────────────────────────────────────────────────────

const STAGE_CLS = {
  pickpack:  'rdc-stage-pickpack',
  allocated: 'rdc-stage-allocated',
  scheduled: 'rdc-stage-scheduled',
  prebooked: 'rdc-stage-prebooked',
  submitted: 'rdc-stage-submitted',
};

const OUTCOME_CLS = {
  'Eligible to proceed': 'rdc-outcome-green',
  'Hold required':       'rdc-outcome-red',
  'Conditional review':  'rdc-outcome-amber',
};

const JDE_CLS = {
  green: 'rdc-jde-green',
  red:   'rdc-jde-red',
  gray:  'rdc-jde-gray',
};

const DELTA_CLS = {
  green: 'rdc-delta-green',
  red:   'rdc-delta-red',
  gray:  'rdc-delta-gray',
};

// ── Sub-components ────────────────────────────────────────────────────────────

const RDC_PAGE_SIZE = 5;

function ReDecisioningEventsTab({ filter }) {
  const [page, setPage] = useState(1);

  const rows = filter === 'All'
    ? rdEvents
    : rdEvents.filter(e => e.trigger === filter);

  const totalPages    = Math.max(1, Math.ceil(rows.length / RDC_PAGE_SIZE));
  const paginatedRows = rows.slice((page - 1) * RDC_PAGE_SIZE, page * RDC_PAGE_SIZE);

  // Reset page when filter changes
  React.useEffect(() => { setPage(1); }, [filter]);

  return (
    <div className="rdc-table-wrap">
      <table className="rdc-table">
        <thead>
          <tr>
            <th className="rdc-th">Event</th>
            <th className="rdc-th">Order</th>
            <th className="rdc-th">Stage</th>
            <th className="rdc-th">Trigger</th>
            <th className="rdc-th">Outcome change</th>
            <th className="rdc-th">Exposure Δ</th>
            <th className="rdc-th">JDE</th>
            <th className="rdc-th">When</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map(e => (
            <tr key={e.id} className="rdc-tr">
              <td className="rdc-td rdc-td-event">{e.id}</td>
              <td className="rdc-td">
                <div className="rdc-order-id">{e.orderId}</div>
                <div className="rdc-order-customer">{e.customer}</div>
              </td>
              <td className="rdc-td">
                <span className={`rdc-stage-pill ${STAGE_CLS[e.stageKey]}`}>{e.stage}</span>
              </td>
              <td className="rdc-td rdc-td-trigger">{e.trigger}</td>
              <td className="rdc-td">
                <div className="rdc-outcome-row">
                  <span className={`rdc-outcome-pill ${OUTCOME_CLS[e.prior]}`}>{e.prior}</span>
                  <span className="rdc-arrow">→</span>
                  <span className={`rdc-outcome-pill ${OUTCOME_CLS[e.outcome]}`}>{e.outcome}</span>
                </div>
              </td>
              <td className="rdc-td">
                <span className={DELTA_CLS[e.deltaKey]}>{e.exposureDelta}</span>
              </td>
              <td className="rdc-td">
                {e.jdeKey === 'gray'
                  ? <span className="rdc-jde-plain">{e.jde}</span>
                  : <span className={`rdc-jde-badge ${JDE_CLS[e.jdeKey]}`}>{e.jde}</span>
                }
              </td>
              <td className="rdc-td rdc-td-when">
                <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle', color: '#94a3b8' }} />
                {e.when}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="rdc-empty">No events match this filter.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination bar */}
      <div className="chr-pagination">
        <span className="chr-page-info">
          {rows.length === 0 ? '0 rows' : `${(page - 1) * RDC_PAGE_SIZE + 1}–${Math.min(page * RDC_PAGE_SIZE, rows.length)} of ${rows.length} rows`}
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

// ── JDE tab data ──────────────────────────────────────────────────────────────

const holdCodes = [
  { code: 'CR', name: 'Credit Limit Exceeded',            category: 'Exposure' },
  { code: 'AR', name: 'AR Past-Due',                      category: 'AR Aging' },
  { code: 'DS', name: 'Disputed Invoice Impacting Exposure', category: 'Dispute' },
  { code: 'RV', name: 'Manual Credit Review Required',    category: 'Review'   },
  { code: 'PR', name: 'Pending Return Allowance',         category: 'Return'   },
];

const jdeEvents = [
  { id: 'JDE-1001', orderId: 'ORD-77298', action: 'Hold released', actionKey: 'released', holdCode: '—',  reason: 'Payment cleared. Auto-release engine fired.',                   actor: 'Auto-Release Engine', status: 'Acknowledged', when: '398d ago' },
  { id: 'JDE-1002', orderId: 'ORD-77342', action: 'Hold applied',  actionKey: 'applied',  holdCode: 'DS', reason: 'Dispute opened on linked invoice. Conditional band breached.',   actor: 'Credit Engine',       status: 'Acknowledged', when: '398d ago' },
  { id: 'JDE-1003', orderId: 'ORD-77390', action: 'Hold applied',  actionKey: 'applied',  holdCode: 'PR', reason: 'Return allowance lower than projected.',                        actor: 'Credit Engine',       status: 'Acknowledged', when: '398d ago' },
  { id: 'JDE-1004', orderId: 'ORD-77321', action: 'Status sync',   actionKey: 'sync',     holdCode: 'AR', reason: 'Pre-fulfillment review confirmed AR hold.',                     actor: 'System',              status: 'Acknowledged', when: '398d ago' },
  { id: 'JDE-1005', orderId: 'ORD-77351', action: 'Hold updated',  actionKey: 'updated',  holdCode: 'RV', reason: 'Hold code changed from CR to RV after order modification.',     actor: 'Credit Engine',       status: 'Acknowledged', when: '398d ago' },
  { id: 'JDE-1006', orderId: 'ORD-77260', action: 'Hold applied',  actionKey: 'applied',  holdCode: 'AR', reason: 'AR aging breach.',                                             actor: 'Credit Engine',       status: 'Acknowledged', when: '398d ago' },
];

const ACTION_CLS = {
  released: 'rdc-action-released',
  applied:  'rdc-action-applied',
  sync:     'rdc-action-sync',
  updated:  'rdc-action-updated',
};

function JDELogTab() {
  const [page, setPage] = useState(1);
  const totalPages     = Math.max(1, Math.ceil(jdeEvents.length / RDC_PAGE_SIZE));
  const paginatedJde   = jdeEvents.slice((page - 1) * RDC_PAGE_SIZE, page * RDC_PAGE_SIZE);

  return (
    <div>
      {/* Hold Code Reference */}
      <div className="rdc-jde-ref-card">
        <div className="rdc-jde-ref-title">JDE Hold Code Reference</div>
        <div className="rdc-jde-ref-grid">
          {holdCodes.map(hc => (
            <div key={hc.code} className="rdc-jde-code-card">
              <span className="rdc-jde-code-badge">{hc.code}</span>
              <div className="rdc-jde-code-name">{hc.name}</div>
              <div className="rdc-jde-code-cat">{hc.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* JDE Log Table */}
      <div className="rdc-table-wrap">
        <table className="rdc-table">
          <thead>
            <tr>
              <th className="rdc-th">JDE Event</th>
              <th className="rdc-th">Order</th>
              <th className="rdc-th">Action</th>
              <th className="rdc-th">Hold Code</th>
              <th className="rdc-th">Reason</th>
              <th className="rdc-th">Actor</th>
              <th className="rdc-th">Status</th>
              <th className="rdc-th">When</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJde.map(e => (
              <tr key={e.id} className="rdc-tr">
                <td className="rdc-td rdc-td-event">{e.id}</td>
                <td className="rdc-td rdc-order-id">{e.orderId}</td>
                <td className="rdc-td">
                  <span className={`rdc-action-pill ${ACTION_CLS[e.actionKey]}`}>{e.action}</span>
                </td>
                <td className="rdc-td rdc-jde-holdcode">{e.holdCode}</td>
                <td className="rdc-td rdc-td-trigger">{e.reason}</td>
                <td className="rdc-td rdc-jde-actor">{e.actor}</td>
                <td className="rdc-td rdc-jde-status">{e.status}</td>
                <td className="rdc-td rdc-td-when">
                  <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle', color: '#94a3b8' }} />
                  {e.when}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination bar */}
        <div className="chr-pagination">
          <span className="chr-page-info">
            {`${(page - 1) * RDC_PAGE_SIZE + 1}–${Math.min(page * RDC_PAGE_SIZE, jdeEvents.length)} of ${jdeEvents.length} rows`}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReDecisioningLifecycle() {
  const [activeTab,    setActiveTab]    = useState('events');
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="dashboard">

      <PageHeader
        icon={<Activity size={18} color="#3b82f6" />}
        title="Re-Decisioning Console"
        subtitle="Continuous credit evaluation of unfulfilled orders. Every change in AR, disputes, returns, or policy re-evaluates impacted orders before they ship."
        actions={
          <button className="rdc-run-btn">
            <RefreshCw size={13} /> Run pre-fulfillment review
          </button>
        }
      />

      {/* KPI row */}
      <div className="rdc-kpi-row">
        {kpis.map(k => (
          <div key={k.label} className="rdc-kpi-card">
            <div className="rdc-kpi-label">{k.label}</div>
            <div className={`rdc-kpi-value ${k.cls}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Logic & Impact */}
      <div className="rdc-logic-card">
        <div className="rdc-logic-title">
          <Info size={14} color="#3b82f6" />
          Logic &amp; Impact
        </div>
        <p className="rdc-logic-body">
          Each event below was triggered by a real-world change to the dealer's financial position, the order,
          or the schedule. The engine recalculates net exposure and available credit, then issues a hold or
          release instruction to JDE before fulfillment.
        </p>
        <div className="rdc-meta-grid">
          {metaRows.map((row, i) => (
            <React.Fragment key={i}>
              <div className="rdc-meta-item">
                <span className="rdc-meta-key">{row.left}</span>
                <span className="rdc-meta-val">{row.leftVal}</span>
              </div>
              <div className="rdc-meta-item">
                <span className="rdc-meta-key">{row.right}</span>
                <span className="rdc-meta-val">{row.rightVal}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="rdc-tags">
          {tags.map(t => <span key={t} className="rdc-tag">{t}</span>)}
        </div>
      </div>

      {/* Tabs */}
      <div className="rdc-tabbar-wrap">
        <div className="rdc-tabs">
          <button
            className={`rdc-tab${activeTab === 'events' ? ' rdc-tab-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >Re-Decisioning Events</button>
          <button
            className={`rdc-tab${activeTab === 'jde' ? ' rdc-tab-active' : ''}`}
            onClick={() => setActiveTab('jde')}
          >JDE Hold/Release Log</button>
        </div>
      </div>

      {/* Filter pills */}
      {activeTab === 'events' && (
        <div className="rdc-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`rdc-filter-pill${activeFilter === f ? ' rdc-filter-active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >{f}</button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'events' && <ReDecisioningEventsTab filter={activeFilter} />}
      {activeTab === 'jde'    && <JDELogTab />}

    </div>
  );
}
