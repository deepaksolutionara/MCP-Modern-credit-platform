import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../App.css';
import { Inbox, Clock, ArrowUp } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import Announcement from '../common/Announcement';

// ── Category filters ──────────────────────────────────────────────────────────

const CATEGORIES = [
  'All', 'Credit Holds', 'Credit Reviews', 'Disputes',
  'Collections Follow-Ups', 'Past-Due Workouts', 'High-Risk Accounts',
  'Exemption Reviews', 'Manual Hold Reviews', 'JDE Exception Items',
];

// ── Status tabs ───────────────────────────────────────────────────────────────

const tabs = [
  { key: 'new',             label: 'New'                   },
  { key: 'in_review',       label: 'In Review'             },
  { key: 'waiting_dealer',  label: 'Waiting on Dealer'     },
  { key: 'waiting_payment', label: 'Waiting on Payment'    },
  { key: 'waiting_return',  label: 'Waiting on Return'     },
  { key: 'escalated',       label: 'Escalated'             },
  { key: 'near_breach',     label: 'Near Breach'           },
  { key: 'breached_sla',    label: 'Breached SLA'          },
  { key: 'auto_released',   label: 'Ready / Auto-Released' },
  { key: 'closed',          label: 'Closed'                },
];

// ── Case data ─────────────────────────────────────────────────────────────────

const casesByTab = {
  new: [
    { id: 'CASE-2608', dealer: 'Walmart Golf Division',  orderId: 'ORD-80012', team: 'Credit Ops', type: 'Credit Review', priority: 'Low',      status: 'New', owner: 'Unassigned', sla: 'Breached +3h',  slaElapsed: 75, slaTotal: 72,  created: '10d ago' },
    { id: 'CASE-2611', dealer: 'PGA Tour Superstore',    orderId: 'ORD-80018', team: 'Credit Ops', type: 'Credit Review', priority: 'Low',      status: 'New', owner: 'Unassigned', sla: '34h of 72h left', slaElapsed: 38, slaTotal: 72, created: '2d ago'  },
  ],
  in_review: [
    { id: 'CASE-2502', dealer: 'ProGear Distribution',   orderId: 'ORD-77342', team: 'Credit Ops', type: 'Credit Review', priority: 'High',     status: 'In Review',     owner: 'Mike Chen',   sla: '44h left',      slaElapsed: 28, slaTotal: 72,  created: '2d ago'  },
  ],
  waiting_dealer: [
    { id: 'CASE-2504', dealer: 'ProGear Distribution',   orderId: 'ORD-77321', team: 'Credit Ops', type: 'Dispute',       priority: 'Medium',   status: 'Waiting on Dealer', owner: 'Jane Doe', sla: '2h left',       slaElapsed: 70, slaTotal: 72,  created: '3d ago'  },
  ],
  waiting_payment:  [],
  waiting_return: [
    { id: 'CASE-2503', dealer: 'SportMax Dealers',       orderId: 'ORD-77390', team: 'Collections', type: 'Collections', priority: 'Medium',   status: 'Waiting on Return', owner: 'Jane Doe', sla: '52h left',      slaElapsed: 20, slaTotal: 72,  created: '4d ago'  },
  ],
  escalated: [
    { id: 'CASE-2506', dealer: 'Alpine Equipment Co',    orderId: 'ORD-77298', team: 'Credit Ops', type: 'Credit Review', priority: 'Critical', status: 'Escalated',     owner: 'M. Patel',    sla: 'Breached +36h', slaElapsed: 108, slaTotal: 72, created: '5d ago'  },
    { id: 'CASE-2501', dealer: 'Alpine Equipment Co',    orderId: 'ORD-77260', team: 'Credit Ops', type: 'Dispute',       priority: 'Critical', status: 'Escalated',     owner: 'M. Patel',    sla: '4h left',       slaElapsed: 68, slaTotal: 72,  created: '4d ago'  },
  ],
  near_breach: [
    { id: 'CASE-2498', dealer: 'Riverside Sports Co',    orderId: 'ORD-77280', team: 'Credit Ops', type: 'Credit Review', priority: 'High',     status: 'Near Breach',   owner: 'Mike Chen',   sla: '3h left',       slaElapsed: 69, slaTotal: 72,  created: '3d ago'  },
    { id: 'CASE-2495', dealer: 'Summit Athletics',       orderId: 'ORD-77255', team: 'Credit Ops', type: 'Onboarding',    priority: 'Medium',   status: 'Near Breach',   owner: 'Jane Doe',    sla: '6h left',       slaElapsed: 66, slaTotal: 72,  created: '2d ago'  },
  ],
  breached_sla: [
    { id: 'CASE-2489', dealer: 'Nordic Sports Ltd',      orderId: 'ORD-77200', team: 'Collections', type: 'Collections', priority: 'Critical', status: 'Breached SLA',  owner: 'Mike Chen',   sla: 'Breached +12h', slaElapsed: 84, slaTotal: 72,  created: '7d ago'  },
  ],
  auto_released: [
    { id: 'CASE-2477', dealer: 'Peak Outdoors',          orderId: 'ORD-77298', team: 'Credit Ops', type: 'Credit Review', priority: 'Low',      status: 'Released',      owner: 'System',      sla: 'Released',      slaElapsed: 0,  slaTotal: 72,  created: '1d ago'  },
  ],
  closed: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_STYLE = {
  Critical: { background: '#ef4444', color: '#fff' },
  High:     { background: '#f97316', color: '#fff' },
  Medium:   { background: '#e2e8f0', color: '#475569' },
  Low:      { background: '#f1f5f9', color: '#64748b' },
};

const STATUS_STYLE = {
  'New':               { background: '#2563eb', color: '#fff' },
  'In Review':         { background: '#fef9c3', color: '#854d0e' },
  'Waiting on Dealer': { background: '#fff7ed', color: '#c2410c' },
  'Waiting on Return': { background: '#fff7ed', color: '#c2410c' },
  'Escalated':         { background: '#fee2e2', color: '#b91c1c' },
  'Near Breach':       { background: '#fef3c7', color: '#d97706' },
  'Breached SLA':      { background: '#fee2e2', color: '#b91c1c' },
  'Released':          { background: '#dcfce7', color: '#15803d' },
};

function slaColor(sla) {
  if (sla.startsWith('Breached')) return '#dc2626';
  if (sla.includes('left')) {
    const h = parseInt(sla);
    if (h <= 4)  return '#ea580c';
    if (h <= 12) return '#d97706';
    return '#2563eb';
  }
  if (sla === 'Released') return '#16a34a';
  return '#64748b';
}

function slaBarColor(slaElapsed, slaTotal) {
  const pct = (slaElapsed / slaTotal) * 100;
  if (pct >= 100) return '#ef4444';
  if (pct >= 90)  return '#f97316';
  if (pct >= 75)  return '#f59e0b';
  return '#3b82f6';
}

// ── Column config (desktop table) ────────────────────────────────────────────

const COLUMNS = [
  { label: 'Case ID',  render: (_, c) => <a href="#" className="case-id">{c.id}</a> },
  { label: 'Dealer',   key: 'dealer',   tdClass: 'dealer-name' },
  { label: 'Type',     key: 'type',     tdClass: 'case-type'   },
  { label: 'Priority', render: (_, c) => <span className="badge" style={PRIORITY_STYLE[c.priority]}>{c.priority}</span> },
  { label: 'Age',      key: 'created',  tdClass: 'case-age'    },
  { label: 'SLA',      render: (_, c) => <span className="wq-sla" style={{ color: slaColor(c.sla), fontWeight: 600 }}>{c.sla}</span> },
  { label: 'Owner',    key: 'owner',    tdClass: 'case-type'   },
];

// ── Case card ─────────────────────────────────────────────────────────────────

function CaseCard({ c }) {
  const isBreach    = c.sla.startsWith('Breached');
  const barPct      = Math.min((c.slaElapsed / c.slaTotal) * 100, 100);
  const barColor    = slaBarColor(c.slaElapsed, c.slaTotal);
  const statusStyle = STATUS_STYLE[c.status] || { background: '#f1f5f9', color: '#64748b' };

  return (
    <div className="wq-cc">

      {/* Left: case ID + dealer + meta */}
      <div className="wq-cc-left">
        <div className="wq-cc-top">
          <span className="wq-cc-id">{c.id}</span>
          <span className="wq-cc-badge" style={PRIORITY_STYLE[c.priority]}>{c.priority}</span>
        </div>
        <div className="wq-cc-dealer">{c.dealer}</div>
        <div className="wq-cc-meta">
          <span>{c.orderId}</span>
          <span className="wq-cc-sep">·</span>
          <span>{c.team}</span>
        </div>
      </div>

      {/* Status + owner */}
      <div className="wq-cc-status-col">
        <span className="wq-cc-status" style={statusStyle}>{c.status}</span>
        <div className="wq-cc-owner-row">Owner: {c.owner}</div>
      </div>

      {/* End wrapper: row on desktop, column on mobile */}
      <div className="wq-cc-end">

        {/* Center: clock + SLA bar, breach/time below */}
        <div className="wq-cc-sla-col">
          <div className="wq-cc-sla-bar-row">
            <Clock size={11} className="wq-cc-clock" aria-hidden="true" />
            <div className="wq-cc-sla-bar-bg">
              <div className="wq-cc-sla-bar" style={{ width: `${barPct}%`, background: barColor }} />
            </div>
          </div>
          {isBreach ? (
            <span className="wq-cc-breach-txt">{c.sla}</span>
          ) : c.sla !== 'Released' && (
            <span className="wq-cc-sla-time" style={{ color: barColor }}>{c.sla}</span>
          )}
        </div>

        {/* Far right: created */}
        <div className="wq-cc-right">
          <ArrowUp size={10} className="wq-cc-arrow" aria-hidden="true" />
          <span className="wq-cc-created">Created {c.created}</span>
        </div>

      </div>
    </div>
  );
}

// ── Route param → tab key ─────────────────────────────────────────────────────

const QUEUE_PARAM_MAP = { breached: 'breached_sla', escalated: 'escalated' };

// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

export default function WorkQueue() {
  const [searchParams] = useSearchParams();
  const initialTab    = QUEUE_PARAM_MAP[searchParams.get('queue')] ?? 'new';
  const [activeTab,  setActiveTab]  = useState(initialTab);
  const [activeCat,  setActiveCat]  = useState('All');
  const [page,       setPage]       = useState(1);

  const cases = casesByTab[activeTab] ?? [];
  const totalPages    = Math.max(1, Math.ceil(cases.length / PAGE_SIZE));
  const paginatedCases = cases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="dashboard">
      <Announcement />

      {/* ── Page header ── */}
      <div className="mwq-header">
        <div className="mwq-header-icon">
          <Inbox size={22} color="#3b82f6" />
        </div>
        <div className="mwq-header-text">
          <h1 className="mwq-title">My Work Queue</h1>
          <p className="mwq-subtitle">
            Personal credit-operations work queue: items currently assigned to or owned
            by you across credit holds, reviews, disputes, collections, and JDE exceptions.
            Prioritised by SLA, exposure, risk, and revenue impact.
          </p>
        </div>
      </div>

      {/* ── Category filters (mobile) / shown on all screens ── */}
      <div className="mwq-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`mwq-cat-btn${activeCat === cat ? ' mwq-cat-active' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div className="wq-tabs mwq-tabs-wrap" role="tablist">
        {tabs.map(tab => {
          const count    = (casesByTab[tab.key] ?? []).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              className={`wq-tab${isActive ? ' wq-tab-active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
            >
              {tab.label}
              <span className={`wq-tab-count${isActive ? ' wq-tab-count-active' : ''}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Cases ── */}
      {cases.length === 0 ? (
        <div className="wq-empty">No cases in this queue</div>
      ) : (
        <>
          <div className="wq-cases-grid">
            {paginatedCases.map(c => <CaseCard key={c.id} c={c} />)}
          </div>

          <div className="chr-pagination">
            <span className="chr-page-info">
              {`${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, cases.length)} of ${cases.length} rows`}
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
        </>
      )}
    </div>
  );
}
