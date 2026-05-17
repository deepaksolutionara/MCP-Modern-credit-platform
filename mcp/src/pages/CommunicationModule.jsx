import React, { useState } from 'react';
import {
  Send, Clock, AlertTriangle, Printer, CheckCircle2, FileText,
  Inbox, LayoutGrid, Search, Mail, Phone,
} from 'lucide-react';
import '../App.css';

// ── KPI cards ─────────────────────────────────────────────────────────────────

const kpiCards = [
  { label: 'Sent',         value: '0',   color: '#16a34a', Icon: Send           },
  { label: 'Pending',      value: '0',   color: '#f97316', Icon: Clock          },
  { label: 'Failed',       value: '0',   color: '#dc2626', Icon: AlertTriangle  },
  { label: 'Fax (legacy)', value: '0',   color: '#0f172a', Icon: Printer        },
  { label: 'Email-only',   value: '0/0', color: '#16a34a', Icon: CheckCircle2   },
  { label: 'Templates',    value: '0',   color: '#0f172a', Icon: FileText       },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'outbound',    label: 'Outbound Log',         Icon: Send      },
  { key: 'delivery',    label: 'Delivery Preferences', Icon: Inbox     },
  { key: 'statements',  label: 'Statements',            Icon: FileText  },
  { key: 'templates',   label: 'Templates',             Icon: LayoutGrid },
];

// ── Outbound log sample data ──────────────────────────────────────────────────

const outboundRows = [
  { id: 'OL-001', channel: 'Email',  dealer: 'Alpine Equipment Co',  recipient: 'dana@alpine.com',    subject: 'Payment reminder — 30 days overdue',   category: 'Reminder',  status: 'Delivered', sent: '22/4/2025, 9:00 am'  },
  { id: 'OL-002', channel: 'Email',  dealer: 'ProGear Distribution', recipient: 'mike@progear.com',   subject: 'Final notice prior to external referral', category: 'Final',   status: 'Opened',    sent: '21/4/2025, 6:30 pm'  },
  { id: 'OL-003', channel: 'Phone',  dealer: 'ProGear Distribution', recipient: 'Mike Chen',          subject: 'Collection call attempt',               category: 'Outreach',  status: 'No Answer', sent: '21/4/2025, 6:30 pm'  },
  { id: 'OL-004', channel: 'Email',  dealer: 'SportMax Dealers',     recipient: 'admin@sportmax.com', subject: 'Past-due notice (1–30)',                 category: 'Reminder',  status: 'Delivered', sent: '19/4/2025, 9:00 am'  },
  { id: 'OL-005', channel: 'Letter', dealer: 'Riverside Sports Co',  recipient: 'Mailing address',   subject: 'Demand letter (certified)',              category: 'Demand',    status: 'Pending',   sent: '17/4/2025, 8:00 am'  },
];

// ── Delivery Preferences data ─────────────────────────────────────────────────

const deliveryRows = [
  { dealer: 'Alpine Equipment Co',  preference: 'Email',        contact: 'dana@alpine.com',       faxLegacy: false, confirmed: true  },
  { dealer: 'ProGear Distribution', preference: 'Email',        contact: 'mike@progear.com',      faxLegacy: false, confirmed: true  },
  { dealer: 'SportMax Dealers',     preference: 'Email',        contact: 'admin@sportmax.com',    faxLegacy: false, confirmed: false },
  { dealer: 'Riverside Sports Co',  preference: 'Fax (legacy)', contact: '+1 555-201-4433',       faxLegacy: true,  confirmed: false },
  { dealer: 'Summit Athletics',     preference: 'Email',        contact: 'ops@summitathletics.com', faxLegacy: false, confirmed: true },
];

// ── Statement data ────────────────────────────────────────────────────────────

const statementRows = [
  { id: 'STM-001', dealer: 'Alpine Equipment Co',  period: 'April 2025',  type: 'Monthly Statement', status: 'Sent',    sent: '1/5/2025' },
  { id: 'STM-002', dealer: 'ProGear Distribution', period: 'April 2025',  type: 'Monthly Statement', status: 'Sent',    sent: '1/5/2025' },
  { id: 'STM-003', dealer: 'SportMax Dealers',     period: 'April 2025',  type: 'Monthly Statement', status: 'Pending', sent: '—'        },
  { id: 'STM-004', dealer: 'Riverside Sports Co',  period: 'April 2025',  type: 'Monthly Statement', status: 'Failed',  sent: '1/5/2025' },
  { id: 'STM-005', dealer: 'Summit Athletics',     period: 'March 2025',  type: 'Monthly Statement', status: 'Sent',    sent: '1/4/2025' },
];

// ── Template library data ─────────────────────────────────────────────────────

const templateRows = [
  { code: 'TPL-PREDUE-1', name: 'Pre-Due Courtesy Reminder',  channel: 'Email',  caseType: 'Past Due', stage: 'Pre-Due · Reminder', effectiveness: 78 },
  { code: 'TPL-PD30-1',   name: 'Past-Due Notice (1–30)',      channel: 'Email',  caseType: 'Past Due', stage: '1-30 · Reminder',    effectiveness: 71 },
  { code: 'TPL-PD30-2',   name: 'Confirmation Call Script',    channel: 'Phone',  caseType: 'Past Due', stage: '1-30 · Reminder',    effectiveness: 64 },
  { code: 'TPL-PD60-1',   name: 'Mid-Stage Recovery Call',     channel: 'Phone',  caseType: 'Past Due', stage: '31-60 · Notice',     effectiveness: 58 },
  { code: 'TPL-PD60-4',   name: 'Mid-Stage Reminder Letter',   channel: 'Letter', caseType: 'Past Due', stage: '31-60 · Notice',     effectiveness: 49 },
  { code: 'TPL-PD90-2',   name: 'Demand Letter (Certified)',   channel: 'Letter', caseType: 'Past Due', stage: '61-90 · Demand',     effectiveness: 42 },
  { code: 'TPL-PD90-3',   name: 'Final Notice — Pre-Referral', channel: 'Email',  caseType: 'Past Due', stage: '90+ · Final',        effectiveness: 38 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Delivered: { bg: '#f0fdf4', color: '#16a34a' },
  Opened:    { bg: '#eff6ff', color: '#2563eb' },
  Pending:   { bg: '#fff7ed', color: '#c2410c' },
  Failed:    { bg: '#fef2f2', color: '#dc2626' },
  'No Answer': { bg: '#fafafa', color: '#64748b' },
  Sent:      { bg: '#f0fdf4', color: '#16a34a' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: '#f8fafc', color: '#64748b' };
  return (
    <span className="cmod-status-badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function ChannelIcon({ channel }) {
  if (channel === 'Phone')  return <Phone  size={13} style={{ color: '#64748b' }} />;
  if (channel === 'Letter') return <FileText size={13} style={{ color: '#64748b' }} />;
  return <Mail size={13} style={{ color: '#64748b' }} />;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CommunicationModule() {
  const [activeTab, setActiveTab] = useState('outbound');
  const [search,    setSearch]    = useState('');

  const filteredOutbound = outboundRows.filter(r => {
    const q = search.toLowerCase();
    return !q ||
      r.dealer.toLowerCase().includes(q) ||
      r.recipient.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q);
  });

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="cmod-page-header">
        <div className="cmod-page-icon">
          <Send size={20} />
        </div>
        <div>
          <div className="cmod-page-title">Communication Module</div>
          <div className="cmod-page-sub">
            Reminders, statements, fax-to-email transition, dealer delivery preferences, and the template library — all governed by MCM.
          </div>
        </div>
      </div>

      {/* KPI stat cards */}
      <div className="cmod-kpi-grid">
        {kpiCards.map(({ label, value, color, Icon }) => (
          <div key={label} className="cmod-kpi-card">
            <div className="cmod-kpi-top">
              <Icon size={13} style={{ color: '#94a3b8' }} />
              <span className="cmod-kpi-label">{label}</span>
            </div>
            <div className="cmod-kpi-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="cmod-tabbar">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`cmod-tab-btn ${activeTab === key ? 'cmod-tab-active' : ''}`}
            onClick={() => { setActiveTab(key); setSearch(''); }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Outbound Log ── */}
      {activeTab === 'outbound' && (
        <div className="cmod-table-card">
          <div className="cmod-search-wrap">
            <Search size={13} className="cmod-search-icon" />
            <input
              className="cmod-search-input"
              placeholder="Search by dealer, recipient, subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <table className="cmod-table">
            <thead>
              <tr>
                {['Channel','Dealer','Recipient','Subject','Category','Status','Sent'].map(h => (
                  <th key={h} className="cmod-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOutbound.length === 0 ? (
                <tr>
                  <td colSpan={7} className="cmod-empty">No outbound records found.</td>
                </tr>
              ) : filteredOutbound.map(r => (
                <tr key={r.id} className="cmod-tr">
                  <td className="cmod-td">
                    <div className="cmod-channel-cell">
                      <ChannelIcon channel={r.channel} />
                      <span className="cmod-channel-text">{r.channel}</span>
                    </div>
                  </td>
                  <td className="cmod-td cmod-dealer">{r.dealer}</td>
                  <td className="cmod-td cmod-muted">{r.recipient}</td>
                  <td className="cmod-td cmod-subject">{r.subject}</td>
                  <td className="cmod-td cmod-muted">{r.category}</td>
                  <td className="cmod-td"><StatusBadge status={r.status} /></td>
                  <td className="cmod-td cmod-muted cmod-nowrap">{r.sent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delivery Preferences ── */}
      {activeTab === 'delivery' && (
        <div className="cmod-table-card">
          <table className="cmod-table">
            <thead>
              <tr>
                {['Dealer','Preference','Contact / Address','Fax Legacy','Confirmed'].map(h => (
                  <th key={h} className="cmod-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveryRows.map((r, i) => (
                <tr key={i} className="cmod-tr">
                  <td className="cmod-td cmod-dealer">{r.dealer}</td>
                  <td className="cmod-td">
                    <span className={`cmod-pref-badge ${r.faxLegacy ? 'cmod-pref-fax' : 'cmod-pref-email'}`}>
                      {r.preference}
                    </span>
                  </td>
                  <td className="cmod-td cmod-muted">{r.contact}</td>
                  <td className="cmod-td">
                    <span className={r.faxLegacy ? 'cmod-flag-yes' : 'cmod-flag-no'}>
                      {r.faxLegacy ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="cmod-td">
                    <span className={r.confirmed ? 'cmod-flag-yes' : 'cmod-flag-no'}>
                      {r.confirmed ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Statements ── */}
      {activeTab === 'statements' && (
        <div className="cmod-table-card">
          <table className="cmod-table">
            <thead>
              <tr>
                {['ID','Dealer','Period','Type','Status','Sent'].map(h => (
                  <th key={h} className="cmod-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statementRows.map(r => (
                <tr key={r.id} className="cmod-tr">
                  <td className="cmod-td cmod-muted cmod-mono">{r.id}</td>
                  <td className="cmod-td cmod-dealer">{r.dealer}</td>
                  <td className="cmod-td cmod-muted">{r.period}</td>
                  <td className="cmod-td cmod-muted">{r.type}</td>
                  <td className="cmod-td"><StatusBadge status={r.status} /></td>
                  <td className="cmod-td cmod-muted">{r.sent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Templates ── */}
      {activeTab === 'templates' && (
        <div className="cmod-table-card">
          <div className="cmod-tpl-heading">Communication Templates</div>
          <table className="cmod-table">
            <thead>
              <tr>
                {['Template','Channel','Case Type','Stage','Effectiveness'].map(h => (
                  <th key={h} className={`cmod-th ${h === 'Effectiveness' ? 'cmod-th-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templateRows.map(t => (
                <tr key={t.code} className="cmod-tr">
                  <td className="cmod-td">
                    <div className="cmod-dealer">{t.name}</div>
                    <div className="cmod-tpl-code">{t.code}</div>
                  </td>
                  <td className="cmod-td">
                    <span className="cmod-ch-pill">{t.channel}</span>
                  </td>
                  <td className="cmod-td cmod-muted">{t.caseType}</td>
                  <td className="cmod-td cmod-muted">{t.stage}</td>
                  <td className="cmod-td cmod-eff">{t.effectiveness}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
