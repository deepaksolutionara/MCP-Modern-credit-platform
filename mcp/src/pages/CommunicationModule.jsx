/**
 * CommunicationModule.jsx
 *
 * Reminders, statements, fax-to-email transition, dealer delivery preferences,
 * and the template library — all governed by MCM.
 *
 * All four tab tables are rendered through the shared <DataTable> component.
 * Column definitions are declared at module level so they are never recreated
 * on re-renders.
 */

import React, { useState, useMemo } from 'react';
import {
  Send, Clock, AlertTriangle, Printer, CheckCircle2, FileText,
  Inbox, LayoutGrid, Mail, Phone,
} from 'lucide-react';
import DataTable from '../common/DataTable';
import '../App.css';

// ── KPI cards ─────────────────────────────────────────────────────────────────

const kpiCards = [
  { label: 'Sent',         value: '0',   color: '#16a34a', Icon: Send          },
  { label: 'Pending',      value: '0',   color: '#f97316', Icon: Clock         },
  { label: 'Failed',       value: '0',   color: '#dc2626', Icon: AlertTriangle },
  { label: 'Fax (legacy)', value: '0',   color: '#0f172a', Icon: Printer       },
  { label: 'Email-only',   value: '0/0', color: '#16a34a', Icon: CheckCircle2  },
  { label: 'Templates',    value: '0',   color: '#0f172a', Icon: FileText      },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'outbound',   label: 'Outbound Log',          Icon: Send       },
  { key: 'delivery',   label: 'Delivery Preferences',  Icon: Inbox      },
  { key: 'statements', label: 'Statements',             Icon: FileText   },
  { key: 'templates',  label: 'Templates',              Icon: LayoutGrid },
];

// ── Dataset ───────────────────────────────────────────────────────────────────

const outboundRows = [
  { id: 'OL-001', channel: 'Email',  dealer: 'Alpine Equipment Co',  recipient: 'dana@alpine.com',      subject: 'Payment reminder — 30 days overdue',      category: 'Reminder', status: 'Delivered', sent: '22/4/2025, 9:00 am' },
  { id: 'OL-002', channel: 'Email',  dealer: 'ProGear Distribution', recipient: 'mike@progear.com',     subject: 'Final notice prior to external referral', category: 'Final',    status: 'Opened',    sent: '21/4/2025, 6:30 pm' },
  { id: 'OL-003', channel: 'Phone',  dealer: 'ProGear Distribution', recipient: 'Mike Chen',            subject: 'Collection call attempt',                 category: 'Outreach', status: 'No Answer', sent: '21/4/2025, 6:30 pm' },
  { id: 'OL-004', channel: 'Email',  dealer: 'SportMax Dealers',     recipient: 'admin@sportmax.com',   subject: 'Past-due notice (1–30)',                   category: 'Reminder', status: 'Delivered', sent: '19/4/2025, 9:00 am' },
  { id: 'OL-005', channel: 'Letter', dealer: 'Riverside Sports Co',  recipient: 'Mailing address',      subject: 'Demand letter (certified)',                category: 'Demand',   status: 'Pending',   sent: '17/4/2025, 8:00 am' },
];

const deliveryRows = [
  { dealer: 'Alpine Equipment Co',  preference: 'Email',        contact: 'dana@alpine.com',          faxLegacy: false, confirmed: true  },
  { dealer: 'ProGear Distribution', preference: 'Email',        contact: 'mike@progear.com',         faxLegacy: false, confirmed: true  },
  { dealer: 'SportMax Dealers',     preference: 'Email',        contact: 'admin@sportmax.com',       faxLegacy: false, confirmed: false },
  { dealer: 'Riverside Sports Co',  preference: 'Fax (legacy)', contact: '+1 555-201-4433',          faxLegacy: true,  confirmed: false },
  { dealer: 'Summit Athletics',     preference: 'Email',        contact: 'ops@summitathletics.com',  faxLegacy: false, confirmed: true  },
];

const statementRows = [
  { id: 'STM-001', dealer: 'Alpine Equipment Co',  period: 'April 2025', type: 'Monthly Statement', status: 'Sent',    sent: '1/5/2025' },
  { id: 'STM-002', dealer: 'ProGear Distribution', period: 'April 2025', type: 'Monthly Statement', status: 'Sent',    sent: '1/5/2025' },
  { id: 'STM-003', dealer: 'SportMax Dealers',     period: 'April 2025', type: 'Monthly Statement', status: 'Pending', sent: '—'        },
  { id: 'STM-004', dealer: 'Riverside Sports Co',  period: 'April 2025', type: 'Monthly Statement', status: 'Failed',  sent: '1/5/2025' },
  { id: 'STM-005', dealer: 'Summit Athletics',     period: 'March 2025', type: 'Monthly Statement', status: 'Sent',    sent: '1/4/2025' },
];

const templateRows = [
  { code: 'TPL-PREDUE-1', name: 'Pre-Due Courtesy Reminder',  channel: 'Email',  caseType: 'Past Due', stage: 'Pre-Due · Reminder', effectiveness: 78 },
  { code: 'TPL-PD30-1',   name: 'Past-Due Notice (1–30)',      channel: 'Email',  caseType: 'Past Due', stage: '1-30 · Reminder',    effectiveness: 71 },
  { code: 'TPL-PD30-2',   name: 'Confirmation Call Script',    channel: 'Phone',  caseType: 'Past Due', stage: '1-30 · Reminder',    effectiveness: 64 },
  { code: 'TPL-PD60-1',   name: 'Mid-Stage Recovery Call',     channel: 'Phone',  caseType: 'Past Due', stage: '31-60 · Notice',     effectiveness: 58 },
  { code: 'TPL-PD60-4',   name: 'Mid-Stage Reminder Letter',   channel: 'Letter', caseType: 'Past Due', stage: '31-60 · Notice',     effectiveness: 49 },
  { code: 'TPL-PD90-2',   name: 'Demand Letter (Certified)',   channel: 'Letter', caseType: 'Past Due', stage: '61-90 · Demand',     effectiveness: 42 },
  { code: 'TPL-PD90-3',   name: 'Final Notice — Pre-Referral', channel: 'Email',  caseType: 'Past Due', stage: '90+ · Final',        effectiveness: 38 },
];

// ── Shared helpers ────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Delivered:  { bg: '#f0fdf4', color: '#16a34a' },
  Opened:     { bg: '#eff6ff', color: '#2563eb' },
  Pending:    { bg: '#fff7ed', color: '#c2410c' },
  Failed:     { bg: '#fef2f2', color: '#dc2626' },
  'No Answer':{ bg: '#fafafa', color: '#64748b' },
  Sent:       { bg: '#f0fdf4', color: '#16a34a' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: '#f8fafc', color: '#64748b' };
  return (
    <span className="cmod-status-badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

const CHANNEL_ICONS = {
  Phone,
  Letter: FileText,
  Email: Mail,
};

function ChannelCell({ channel }) {
  const Icon = CHANNEL_ICONS[channel] || Mail;
  return <Icon size={13} className="cmod-channel-icon" />;
}

// ── Column definitions ────────────────────────────────────────────────────────
// Defined at module level — never recreated on re-render.
// render(value, row) → ReactNode

const outboundColumns = [
  { label: 'Channel',   render: (_, r) => <ChannelCell channel={r.channel} /> },
  { label: 'Dealer',    key: 'dealer',    className: 'cmod-dealer'            },
  { label: 'Recipient', key: 'recipient', className: 'cmod-muted'             },
  { label: 'Subject',   key: 'subject',   className: 'cmod-subject'           },
  { label: 'Category',  key: 'category',  className: 'cmod-muted'             },
  { label: 'Status',    render: (_, r) => <StatusBadge status={r.status} />   },
  { label: 'Sent',      key: 'sent',      className: 'cmod-muted cmod-nowrap' },
];

const deliveryColumns = [
  { label: 'Dealer',            key: 'dealer',     className: 'cmod-dealer' },
  {
    label: 'Preference',
    render: (_, r) => (
      <span className={`cmod-pref-badge ${r.faxLegacy ? 'cmod-pref-fax' : 'cmod-pref-email'}`}>
        {r.preference}
      </span>
    ),
  },
  { label: 'Contact / Address', key: 'contact',    className: 'cmod-muted' },
  {
    label: 'Fax Legacy',
    render: (_, r) => (
      <span className={r.faxLegacy ? 'cmod-flag-yes' : 'cmod-flag-no'}>
        {r.faxLegacy ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    label: 'Confirmed',
    render: (_, r) => (
      <span className={r.confirmed ? 'cmod-flag-yes' : 'cmod-flag-no'}>
        {r.confirmed ? 'Yes' : 'No'}
      </span>
    ),
  },
];

const statementColumns = [
  { label: 'ID',     key: 'id',     className: 'cmod-muted cmod-mono' },
  { label: 'Dealer', key: 'dealer', className: 'cmod-dealer'          },
  { label: 'Period', key: 'period', className: 'cmod-muted'           },
  { label: 'Type',   key: 'type',   className: 'cmod-muted'           },
  { label: 'Status', render: (_, r) => <StatusBadge status={r.status} /> },
  { label: 'Sent',   key: 'sent',   className: 'cmod-muted'           },
];

const templateColumns = [
  {
    label: 'Template',
    render: (_, r) => (
      <>
        <div className="cmod-dealer">{r.name}</div>
        <div className="cmod-tpl-code">{r.code}</div>
      </>
    ),
  },
  { label: 'Channel',       render: (_, r) => <span className="cmod-ch-pill">{r.channel}</span> },
  { label: 'Case Type',     key: 'caseType',     className: 'cmod-muted' },
  { label: 'Stage',         key: 'stage',        className: 'cmod-muted' },
  { label: 'Effectiveness', key: 'effectiveness', render: val => `${val}%`, className: 'cmod-eff', align: 'right' },
];

// ── Page component ────────────────────────────────────────────────────────────

export default function CommunicationModule() {
  const [activeTab, setActiveTab] = useState('outbound');
  const [search,    setSearch]    = useState('');

  // Filter outbound rows by dealer / recipient / subject
  const filteredOutbound = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return outboundRows;
    return outboundRows.filter(r =>
      ['dealer', 'recipient', 'subject'].some(f =>
        String(r[f]).toLowerCase().includes(q)
      )
    );
  }, [search]);

  return (
    <div className="dashboard">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="cmod-page-header">
        <div className="cmod-page-icon"><Send size={20} /></div>
        <div>
          <div className="cmod-page-title">Communication Module</div>
          <div className="cmod-page-sub">
            Reminders, statements, fax-to-email transition, dealer delivery preferences,
            and the template library — all governed by MCM.
          </div>
        </div>
      </div>

      {/* ── KPI stat cards ──────────────────────────────────────────────── */}
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

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
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

      {/* ── Tab content — all rendered via DataTable ─────────────────────── */}

      {activeTab === 'outbound' && (
        <DataTable
          columns={outboundColumns}
          rows={filteredOutbound}
          rowKey="id"
          emptyMessage="No outbound records found."
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search by dealer, recipient, subject..."
        />
      )}

      {activeTab === 'delivery' && (
        <DataTable
          columns={deliveryColumns}
          rows={deliveryRows}
          rowKey="dealer"
        />
      )}

      {activeTab === 'statements' && (
        <DataTable
          columns={statementColumns}
          rows={statementRows}
          rowKey="id"
        />
      )}

      {activeTab === 'templates' && (
        <DataTable
          columns={templateColumns}
          rows={templateRows}
          rowKey="code"
          title="Communication Templates"
        />
      )}

    </div>
  );
}
