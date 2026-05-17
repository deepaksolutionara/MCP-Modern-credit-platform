import React, { useState, useMemo } from 'react';
import {
  Globe, Clock, CheckCircle2, ExternalLink,
  Search, RefreshCw,
} from 'lucide-react';
import '../App.css';

// ── KPI config ────────────────────────────────────────────────────────────────

const kpiCards = [
  { label: 'Total tickets', value: '9',  color: '#0f172a', Icon: null         },
  { label: 'Open',          value: '5',  color: '#2563eb', Icon: Clock        },
  { label: 'Pending',       value: '3',  color: '#f97316', Icon: Clock        },
  { label: 'Solved',        value: '1',  color: '#16a34a', Icon: CheckCircle2 },
  { label: 'MCM-linked',    value: '7',  color: '#0f172a', Icon: ExternalLink },
];

// ── Ticket data ───────────────────────────────────────────────────────────────

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

// ── Routing map ───────────────────────────────────────────────────────────────

const routingRules = [
  { trigger: 'Tag: credit-hold',     destination: 'Credit Team',      assignee: 'M. Patel',  priority: 'High',   linkedType: 'Case'    },
  { trigger: 'Tag: invoice-dispute', destination: 'Credit Team',      assignee: 'T. Kim',    priority: 'High',   linkedType: 'Invoice' },
  { trigger: 'Tag: re-decision',     destination: 'Credit Team',      assignee: 'P. Menon',  priority: 'Medium', linkedType: 'Case'    },
  { trigger: 'Tag: statement',       destination: 'Credit Ops',       assignee: 'J. Doe',    priority: 'Low',    linkedType: 'Dealer'  },
  { trigger: 'Tag: collections',     destination: 'Collections Team', assignee: 'T. Kim',    priority: 'High',   linkedType: 'Case'    },
  { trigger: 'Tag: ptp',             destination: 'Collections Team', assignee: 'P. Menon',  priority: 'High',   linkedType: 'Case'    },
  { trigger: 'Tag: preferences',     destination: 'Credit Ops',       assignee: 'J. Doe',    priority: 'Low',    linkedType: 'Dealer'  },
];

// ── Sync events ───────────────────────────────────────────────────────────────

const syncEvents = [
  { time: '11/5/2026, 2:45 pm',  event: 'Ticket ZD-10421 status synced: Open → Open',         result: 'OK'   },
  { time: '11/5/2026, 2:30 pm',  event: 'Ticket ZD-10418 linked to INV-8821',                 result: 'OK'   },
  { time: '11/5/2026, 2:15 pm',  event: 'Ticket ZD-10395 resolved — MCM case closed',         result: 'OK'   },
  { time: '11/5/2026, 1:50 pm',  event: 'Routing rule applied: tag credit-hold → M. Patel',   result: 'OK'   },
  { time: '11/5/2026, 1:30 pm',  event: 'Sync heartbeat — 9 tickets active',                  result: 'OK'   },
  { time: '11/5/2026, 12:00 pm', event: 'Ticket ZD-10403 — no MCM entity matched (DLR-005)',  result: 'Warn' },
  { time: '11/5/2026, 11:45 am', event: 'Webhook payload received from Zendesk (batch: 4)',   result: 'OK'   },
  { time: '11/5/2026, 10:00 am', event: 'Full sync completed — 9 records processed',          result: 'OK'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const LINKED_COLOR = { CASE: '#2563eb', INV: '#7c3aed', DLR: '#0891b2', DSP: '#c2410c', ORD: '#475569' };

function linkedColor(id) {
  const prefix = id.split('-')[0];
  return LINKED_COLOR[prefix] || '#64748b';
}

function initials(name) {
  return name.split(/[\s.]/).filter(Boolean).map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ZendeskCoordination() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [search,    setSearch]    = useState('');

  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return ticketRows;
    return ticketRows.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.dealer.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.owner.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard">

      {/* ── Header ── */}
      <div className="zd-page-header">
        <div className="zd-page-icon">
          <Globe size={20} />
        </div>
        <div>
          <div className="zd-page-title">Zendesk Coordination</div>
          <div className="zd-page-sub">
            Read-only view of Zendesk tickets routed into MCM with linked cases, invoices, and disputes. MCM coordinates resolution; ticket maintenance stays in Zendesk.
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
        <button
          className={`zd-tab-btn ${activeTab === 'tickets' ? 'zd-tab-active' : ''}`}
          onClick={() => { setActiveTab('tickets');  setSearch(''); }}
        >Tickets</button>
        <button
          className={`zd-tab-btn ${activeTab === 'routing' ? 'zd-tab-active' : ''}`}
          onClick={() => { setActiveTab('routing');  setSearch(''); }}
        >Routing Map</button>
        <button
          className={`zd-tab-btn ${activeTab === 'sync' ? 'zd-tab-active' : ''}`}
          onClick={() => { setActiveTab('sync');     setSearch(''); }}
        >
          <RefreshCw size={12} />
          Sync Status
        </button>
      </div>

      {/* ── Tickets tab ── */}
      {activeTab === 'tickets' && (
        <div className="zd-table-card">
          <div className="zd-search-wrap">
            <Search size={13} className="zd-search-icon" />
            <input
              className="zd-search-input"
              placeholder="Search by ticket ID, subject, dealer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <table className="zd-table">
            <thead>
              <tr>
                {['Ticket','Dealer','Subject','Category','Owner','Linked','Status'].map(h => (
                  <th key={h} className="zd-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr><td colSpan={7} className="zd-empty">No tickets match your search.</td></tr>
              ) : filteredTickets.map(t => (
                <tr key={t.id} className="zd-tr">
                  <td className="zd-td">
                    <div className="zd-ticket-id">
                      <ExternalLink size={11} style={{ color: '#94a3b8' }} />
                      {t.id}
                    </div>
                  </td>
                  <td className="zd-td zd-dealer">{t.dealer}</td>
                  <td className="zd-td zd-subject">{t.subject}</td>
                  <td className="zd-td">
                    <span className="zd-category">{t.category}</span>
                  </td>
                  <td className="zd-td">
                    <div className="zd-owner-wrap">
                      <div className="zd-avatar">{initials(t.owner)}</div>
                      <span className="zd-owner-name">{t.owner}</span>
                    </div>
                  </td>
                  <td className="zd-td">
                    <span className="zd-linked-id" style={{ color: linkedColor(t.linked) }}>{t.linked}</span>
                  </td>
                  <td className="zd-td">
                    <span className="zd-status-badge" style={{
                      background: (STATUS_STYLE[t.status] || {}).bg || '#f8fafc',
                      color:      (STATUS_STYLE[t.status] || {}).color || '#64748b',
                    }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Routing Map tab ── */}
      {activeTab === 'routing' && (
        <div className="zd-table-card">
          <div className="zd-tab-section-title">Zendesk → MCM Routing Rules</div>
          <table className="zd-table">
            <thead>
              <tr>
                {['Trigger','Destination','Assignee','Priority','Linked Type'].map(h => (
                  <th key={h} className="zd-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routingRules.map((r, i) => (
                <tr key={i} className="zd-tr">
                  <td className="zd-td"><code className="zd-code">{r.trigger}</code></td>
                  <td className="zd-td zd-dealer">{r.destination}</td>
                  <td className="zd-td">
                    <div className="zd-owner-wrap">
                      <div className="zd-avatar">{initials(r.assignee)}</div>
                      <span className="zd-owner-name">{r.assignee}</span>
                    </div>
                  </td>
                  <td className="zd-td">
                    <span className="zd-status-badge" style={{
                      background: (PRIORITY_STYLE[r.priority] || {}).bg || '#f8fafc',
                      color:      (PRIORITY_STYLE[r.priority] || {}).color || '#64748b',
                    }}>{r.priority}</span>
                  </td>
                  <td className="zd-td">
                    <span className="zd-linked-id" style={{ color: LINKED_COLOR[r.linkedType.toUpperCase()] || LINKED_COLOR.DLR }}>
                      {r.linkedType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Sync Status tab ── */}
      {activeTab === 'sync' && (
        <div className="zd-table-card">
          <div className="zd-sync-header">
            <div className="zd-tab-section-title">Webhook &amp; Sync Log</div>
            <span className="zd-sync-live"><span className="zd-sync-dot" />Live</span>
          </div>
          <table className="zd-table">
            <thead>
              <tr>
                {['Timestamp','Event','Result'].map(h => (
                  <th key={h} className="zd-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {syncEvents.map((e, i) => (
                <tr key={i} className="zd-tr">
                  <td className="zd-td zd-muted zd-nowrap">{e.time}</td>
                  <td className="zd-td zd-subject">{e.event}</td>
                  <td className="zd-td">
                    <span className="zd-status-badge" style={
                      e.result === 'OK'
                        ? { background: '#f0fdf4', color: '#15803d' }
                        : { background: '#fffbeb', color: '#b45309' }
                    }>{e.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
