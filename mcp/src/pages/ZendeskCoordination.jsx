import React, { useState, useMemo } from 'react';
import {
  Globe, Clock, CheckCircle2, ExternalLink,
  Search, RefreshCw,
} from 'lucide-react';
import DataTable from '../common/DataTable';
import OwnerCell from '../common/OwnerCell';
import '../App.css';

// ── KPI config ────────────────────────────────────────────────────────────────

const kpiCards = [
  { label: 'Total tickets', value: '9',  color: '#0f172a', Icon: null         },
  { label: 'Open',          value: '5',  color: '#2563eb', Icon: Clock        },
  { label: 'Pending',       value: '3',  color: '#f97316', Icon: Clock        },
  { label: 'Solved',        value: '1',  color: '#16a34a', Icon: CheckCircle2 },
  { label: 'MCM-linked',    value: '7',  color: '#0f172a', Icon: ExternalLink },
];

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'tickets', label: 'Tickets'      },
  { key: 'routing', label: 'Routing Map'  },
  { key: 'sync',    label: 'Sync Status', Icon: RefreshCw },
];

// ── Datasets ──────────────────────────────────────────────────────────────────

const ticketRows = [
  { id: 'ZD-10421', dealer: 'Alpine Equipment Co',  subject: 'Credit hold dispute — ORD-77321 not released after payment', category: 'Credit Hold',   owner: 'M. Patel',  linked: 'CASE-2506', status: 'Open'    },
  { id: 'ZD-10418', dealer: 'ProGear Distribution', subject: 'Invoice dispute — short-shipment credit not applied',         category: 'Dispute',       owner: 'T. Kim',    linked: 'INV-8821',  status: 'Pending' },
  { id: 'ZD-10415', dealer: 'Alpine Equipment Co',  subject: 'Account status update request — exposure clarification',      category: 'Account Query', owner: 'M. Patel',  linked: 'DLR-002',   status: 'Open'    },
  { id: 'ZD-10412', dealer: 'SportMax Dealers',     subject: 'Re-decisioning result — dealer requesting manual review',     category: 'Re-Decision',   owner: 'P. Menon',  linked: 'CASE-2503', status: 'Open'    },
  { id: 'ZD-10410', dealer: 'ProGear Distribution', subject: 'PTP not reflected in system — confirmation call made',        category: 'Collections',   owner: 'T. Kim',    linked: 'CASE-2504', status: 'Pending' },
  { id: 'ZD-10407', dealer: 'Riverside Sports Co',  subject: 'Statement not received for April 2025',                       category: 'Statement',     owner: 'J. Doe',    linked: 'DLR-004',   status: 'Pending' },
  { id: 'ZD-10403', dealer: 'Summit Athletics',     subject: 'Delivery preference update — switch from fax to email',       category: 'Preferences',   owner: 'J. Doe',    linked: 'DLR-005',   status: 'Open'    },
  { id: 'ZD-10401', dealer: 'SportMax Dealers',     subject: 'Dispute status — dealer requesting expedited review',         category: 'Dispute',       owner: 'P. Menon',  linked: 'DSP-0112',  status: 'Open'    },
  { id: 'ZD-10395', dealer: 'ProGear Distribution', subject: 'Hold released — confirmed payment received',                  category: 'Credit Hold',   owner: 'T. Kim',    linked: 'ORD-77342', status: 'Solved'  },
];

const routingRules = [
  { trigger: 'Tag: credit-hold',     destination: 'Credit Team',      assignee: 'M. Patel',  priority: 'High',   linkedType: 'Case'    },
  { trigger: 'Tag: invoice-dispute', destination: 'Credit Team',      assignee: 'T. Kim',    priority: 'High',   linkedType: 'Invoice' },
  { trigger: 'Tag: re-decision',     destination: 'Credit Team',      assignee: 'P. Menon',  priority: 'Medium', linkedType: 'Case'    },
  { trigger: 'Tag: statement',       destination: 'Credit Ops',       assignee: 'J. Doe',    priority: 'Low',    linkedType: 'Dealer'  },
  { trigger: 'Tag: collections',     destination: 'Collections Team', assignee: 'T. Kim',    priority: 'High',   linkedType: 'Case'    },
  { trigger: 'Tag: ptp',             destination: 'Collections Team', assignee: 'P. Menon',  priority: 'High',   linkedType: 'Case'    },
  { trigger: 'Tag: preferences',     destination: 'Credit Ops',       assignee: 'J. Doe',    priority: 'Low',    linkedType: 'Dealer'  },
];

const syncEvents = [
  { time: '11/5/2026, 2:45 pm',  event: 'Ticket ZD-10421 status synced: Open → Open',        result: 'OK'   },
  { time: '11/5/2026, 2:30 pm',  event: 'Ticket ZD-10418 linked to INV-8821',                result: 'OK'   },
  { time: '11/5/2026, 2:15 pm',  event: 'Ticket ZD-10395 resolved — MCM case closed',        result: 'OK'   },
  { time: '11/5/2026, 1:50 pm',  event: 'Routing rule applied: tag credit-hold → M. Patel',  result: 'OK'   },
  { time: '11/5/2026, 1:30 pm',  event: 'Sync heartbeat — 9 tickets active',                 result: 'OK'   },
  { time: '11/5/2026, 12:00 pm', event: 'Ticket ZD-10403 — no MCM entity matched (DLR-005)', result: 'Warn' },
  { time: '11/5/2026, 11:45 am', event: 'Webhook payload received from Zendesk (batch: 4)',  result: 'OK'   },
  { time: '11/5/2026, 10:00 am', event: 'Full sync completed — 9 records processed',         result: 'OK'   },
];

// ── Style maps ────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Open:    { bg: '#eff6ff', color: '#2563eb' },
  Pending: { bg: '#fff7ed', color: '#c2410c' },
  Solved:  { bg: '#f0fdf4', color: '#15803d' },
};

const PRIORITY_STYLE = {
  High:   { bg: '#fff7ed', color: '#c2410c' },
  Medium: { bg: '#fffbeb', color: '#b45309' },
  Low:    { bg: '#f0fdf4', color: '#15803d' },
};

const SYNC_STYLE = {
  OK:   { bg: '#f0fdf4', color: '#15803d' },
  Warn: { bg: '#fffbeb', color: '#b45309' },
};

const LINKED_COLOR = {
  CASE: '#2563eb', INV: '#7c3aed', DLR: '#0891b2', DSP: '#c2410c', ORD: '#475569',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function linkedColor(id) {
  return LINKED_COLOR[id.split('-')[0]] || '#64748b';
}

function Badge({ value, styles }) {
  const s = styles[value] || { bg: '#f8fafc', color: '#64748b' };
  return (
    <span className="zd-status-badge" style={{ background: s.bg, color: s.color }}>
      {value}
    </span>
  );
}

// ── DataTable class overrides for zd-* styling ────────────────────────────────
// Passed as the `classes` prop so DataTable renders with Zendesk styles instead
// of the default cmod-* classes.

const ZD_CLASSES = {
  card:        'zd-table-card',
  title:       'zd-tab-section-title',
  searchWrap:  'zd-search-wrap',
  searchIcon:  'zd-search-icon',
  searchInput: 'zd-search-input',
  table:       'zd-table',
  th:          'zd-th',
  tr:          'zd-tr',
  td:          'zd-td',
  empty:       'zd-empty',
};

// ── Column definitions ────────────────────────────────────────────────────────
// Module-level so they are never recreated on re-render.

const ticketColumns = [
  {
    label: 'Ticket',
    render: (_, t) => (
      <div className="zd-ticket-id">
        <ExternalLink size={11} style={{ color: '#94a3b8' }} />
        {t.id}
      </div>
    ),
  },
  { label: 'Dealer',   key: 'dealer',   className: 'zd-dealer'  },
  { label: 'Subject',  key: 'subject',  className: 'zd-subject' },
  { label: 'Category', render: (_, t) => <span className="zd-category">{t.category}</span> },
  { label: 'Owner',    render: (_, t) => <OwnerCell name={t.owner} /> },
  {
    label: 'Linked',
    render: (_, t) => (
      <span className="zd-linked-id" style={{ color: linkedColor(t.linked) }}>
        {t.linked}
      </span>
    ),
  },
  { label: 'Status', render: (_, t) => <Badge value={t.status} styles={STATUS_STYLE} /> },
];

const routingColumns = [
  { label: 'Trigger',      render: (_, r) => <code className="zd-code">{r.trigger}</code> },
  { label: 'Destination',  key: 'destination', className: 'zd-dealer' },
  { label: 'Assignee',     render: (_, r) => <OwnerCell name={r.assignee} /> },
  { label: 'Priority',     render: (_, r) => <Badge value={r.priority} styles={PRIORITY_STYLE} /> },
  {
    label: 'Linked Type',
    render: (_, r) => (
      <span className="zd-linked-id"
        style={{ color: LINKED_COLOR[r.linkedType.toUpperCase()] || LINKED_COLOR.DLR }}>
        {r.linkedType}
      </span>
    ),
  },
];

const syncColumns = [
  { label: 'Timestamp', key: 'time',  className: 'zd-muted zd-nowrap' },
  { label: 'Event',     key: 'event', className: 'zd-subject'         },
  { label: 'Result',    render: (_, e) => <Badge value={e.result} styles={SYNC_STYLE} /> },
];

// ── Page component ────────────────────────────────────────────────────────────

export default function ZendeskCoordination() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [search,    setSearch]    = useState('');

  const SEARCH_FIELDS = ['id', 'dealer', 'subject', 'category', 'owner'];

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ticketRows;
    return ticketRows.filter(t =>
      SEARCH_FIELDS.some(f => String(t[f]).toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="dashboard">

      {/* ── Header ── */}
      <div className="zd-page-header">
        <div className="zd-page-icon"><Globe size={20} /></div>
        <div>
          <div className="zd-page-title">Zendesk Coordination</div>
          <div className="zd-page-sub">
            Read-only view of Zendesk tickets routed into MCM with linked cases, invoices,
            and disputes. MCM coordinates resolution; ticket maintenance stays in Zendesk.
          </div>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="zd-kpi-row">
        {kpiCards.map(({ label, value, color, Icon }, i) => (
          <div key={label} className={`zd-kpi-cell${i < kpiCards.length - 1 ? ' zd-kpi-cell-border' : ''}`}>
            <div className="zd-kpi-top">
              {Icon && <Icon size={13} style={{ color: '#94a3b8' }} />}
              <span className="zd-kpi-label">{label}</span>
            </div>
            <div className="zd-kpi-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div className="zd-tabbar">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`zd-tab-btn ${activeTab === key ? 'zd-tab-active' : ''}`}
            onClick={() => { setActiveTab(key); setSearch(''); }}
          >
            {Icon && <Icon size={12} />}
            {label}
          </button>
        ))}
      </div>

      {/* ── Tickets tab ── */}
      {activeTab === 'tickets' && (
        <DataTable
          columns={ticketColumns}
          rows={filteredTickets}
          rowKey="id"
          emptyMessage="No tickets match your search."
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search by ticket ID, subject, dealer..."
          classes={ZD_CLASSES}
        />
      )}

      {/* ── Routing Map tab ── */}
      {activeTab === 'routing' && (
        <DataTable
          columns={routingColumns}
          rows={routingRules}
          rowKey="trigger"
          title="Zendesk → MCM Routing Rules"
          classes={ZD_CLASSES}
        />
      )}

      {/* ── Sync Status tab ── */}
      {/* The sync tab needs a custom header (title + Live badge), so we pass a
          ReactNode via the `title` prop instead of a plain string. */}
      {activeTab === 'sync' && (
        <DataTable
          columns={syncColumns}
          rows={syncEvents}
          rowKey={(_, i) => i}
          title={
            <div className="zd-sync-header">
              <div className="zd-tab-section-title">Webhook &amp; Sync Log</div>
              <span className="zd-sync-live"><span className="zd-sync-dot" />Live</span>
            </div>
          }
          classes={ZD_CLASSES}
        />
      )}

    </div>
  );
}
