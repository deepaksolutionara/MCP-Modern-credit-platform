import React, { useState, useMemo } from 'react';
import { MessageSquare, Mail, Phone, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import '../App.css';

// ── Timeline data ─────────────────────────────────────────────────────────────

const timelineData = [
  {
    id: 'C1',
    channel: 'Portal Message',
    scope: 'Dealer',
    scopeId: 'DLR-002',
    status: 'Delivered',
    direction: 'out',
    title: 'Account status update',
    body: 'Account status: under credit review.',
    agent: 'Sales Rep: T. Kim',
    timestamp: '22/4/2025, 4:30:00 pm',
  },
  {
    id: 'C2',
    channel: 'Email',
    scope: 'Case',
    scopeId: 'COL-4001',
    status: 'Opened',
    direction: 'out',
    title: 'Final notice prior to external referral',
    body: 'Final notice sent.',
    agent: 'Collector: Mike Chen',
    timestamp: '21/4/2025, 6:30:00 pm',
  },
  {
    id: 'C3',
    channel: 'Email',
    scope: 'Case',
    scopeId: 'COL-4001',
    status: 'Refused',
    direction: 'out',
    title: 'Email touch — Refused',
    body: 'Dealer refusing further commitment without dispute resolution; dispute ruled invalid.',
    agent: 'Collector: Mike Chen',
    timestamp: '21/4/2025, 6:30:00 pm',
  },
  {
    id: 'C4',
    channel: 'Phone',
    scope: 'Dealer',
    scopeId: 'DLR-003',
    status: 'Promise to Pay',
    direction: 'in',
    title: 'PTP confirmation',
    body: 'Will pay $40K once short-shipment credit posts.',
    agent: 'Dealer Finance: Dana West',
    timestamp: '19/4/2025, 4:00:00 pm',
  },
  {
    id: 'C5',
    channel: 'Email',
    scope: 'Invoice',
    scopeId: 'INV-8821',
    status: 'Delivered',
    direction: 'out',
    title: 'Payment reminder — 30-day overdue',
    body: 'Automated reminder for overdue invoice balance of $18,500.',
    agent: 'System: Auto-Notify',
    timestamp: '17/4/2025, 9:00:00 am',
  },
  {
    id: 'C6',
    channel: 'Portal Message',
    scope: 'Dispute',
    scopeId: 'DSP-0112',
    status: 'Read',
    direction: 'in',
    title: 'Dispute acknowledgement',
    body: 'Dealer has acknowledged the dispute ruling and accepted partial credit.',
    agent: 'Dealer: SportMax Dealers',
    timestamp: '15/4/2025, 2:15:00 pm',
  },
  {
    id: 'C7',
    channel: 'Phone',
    scope: 'Case',
    scopeId: 'COL-4001',
    status: 'No Answer',
    direction: 'out',
    title: 'Collection call attempt',
    body: 'Attempted outreach — no answer. Left voicemail.',
    agent: 'Collector: Priya Menon',
    timestamp: '14/4/2025, 11:00:00 am',
  },
];

// ── Templates data ────────────────────────────────────────────────────────────

const templates = [
  { id: 'T1', code: 'TPL-PREDUE-1', name: 'Pre-Due Courtesy Reminder',    channel: 'Email',  caseType: 'Past Due', stage: 'Pre-Due · Reminder', audience: 'Dealer Finance', effectiveness: 78 },
  { id: 'T2', code: 'TPL-PD30-1',   name: 'Past-Due Notice (1–30)',        channel: 'Email',  caseType: 'Past Due', stage: '1-30 · Reminder',    audience: 'Dealer Finance', effectiveness: 71 },
  { id: 'T3', code: 'TPL-PD30-2',   name: 'Confirmation Call Script',      channel: 'Phone',  caseType: 'Past Due', stage: '1-30 · Reminder',    audience: 'Dealer Finance', effectiveness: 64 },
  { id: 'T4', code: 'TPL-PD60-1',   name: 'Mid-Stage Recovery Call',       channel: 'Phone',  caseType: 'Past Due', stage: '31-60 · Notice',     audience: 'Dealer Finance', effectiveness: 58 },
  { id: 'T5', code: 'TPL-PD60-4',   name: 'Mid-Stage Reminder Letter',     channel: 'Letter', caseType: 'Past Due', stage: '31-60 · Notice',     audience: 'Dealer Finance', effectiveness: 49 },
  { id: 'T6', code: 'TPL-PD90-2',   name: 'Demand Letter (Certified)',     channel: 'Letter', caseType: 'Past Due', stage: '61-90 · Demand',     audience: 'Dealer Finance', effectiveness: 42 },
  { id: 'T7', code: 'TPL-PD90-3',   name: 'Final Notice — Pre-Referral',   channel: 'Email',  caseType: 'Past Due', stage: '90+ · Final',        audience: 'Dealer Finance', effectiveness: 38 },
];

// ── Status badge colours ──────────────────────────────────────────────────────

const STATUS_STYLE = {
  'Delivered':      { bg: '#f0fdf4', color: '#16a34a' },
  'Opened':         { bg: '#eff6ff', color: '#2563eb' },
  'Refused':        { bg: '#fef2f2', color: '#dc2626' },
  'Promise to Pay': { bg: '#faf5ff', color: '#7c3aed' },
  'Read':           { bg: '#f0fdf4', color: '#16a34a' },
  'No Answer':      { bg: '#fff7ed', color: '#c2410c' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ChannelAvatar({ channel }) {
  if (channel === 'Phone') {
    return <div className="comm-avatar comm-avatar-blue"><Phone size={15} /></div>;
  }
  if (channel === 'Portal Message') {
    return <div className="comm-avatar comm-avatar-blue"><MessageSquare size={15} /></div>;
  }
  return <div className="comm-avatar comm-avatar-gray"><Mail size={15} /></div>;
}

function ChannelBadge({ channel }) {
  const cls = channel === 'Email'  ? 'comm-ch-email'
            : channel === 'Phone'  ? 'comm-ch-phone'
            : 'comm-ch-letter';
  return <span className={`comm-ch-badge ${cls}`}>{channel}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Communications() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [search,    setSearch]    = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return timelineData;
    return timelineData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.body.toLowerCase().includes(q) ||
      item.scopeId.toLowerCase().includes(q) ||
      item.agent.toLowerCase().includes(q) ||
      item.scope.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="comm-page-header">
        <div className="comm-page-icon">
          <MessageSquare size={22} />
        </div>
        <div>
          <div className="comm-page-title">Communications Timeline</div>
          <div className="comm-page-sub">
            Unified outbound + inbound history across dealer, invoice, case, and dispute scopes.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sim-tabbar">
        <button
          className={`sim-tab-btn ${activeTab === 'timeline'  ? 'sim-tab-active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >Timeline</button>
        <button
          className={`sim-tab-btn ${activeTab === 'templates' ? 'sim-tab-active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >Templates</button>
      </div>

      {/* ── Timeline tab ── */}
      {activeTab === 'timeline' && (
        <>
          <div className="comm-search-wrap">
            <Search size={14} className="comm-search-icon" />
            <input
              className="comm-search-input"
              placeholder="Search by dealer, invoice, case, or content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="comm-timeline">
            {filtered.map(item => {
              const st = STATUS_STYLE[item.status] || { bg: '#f8fafc', color: '#64748b' };
              return (
                <div key={item.id} className="comm-item">
                  <ChannelAvatar channel={item.channel} />
                  <div className="comm-body">
                    <div className="comm-tags">
                      <span className="comm-tag-channel">{item.channel}</span>
                      <span className="comm-tag-scope">{item.scope}</span>
                      <span className="comm-tag-id">{item.scopeId}</span>
                      <span className="comm-tag-status" style={{ background: st.bg, color: st.color }}>
                        {item.status}
                      </span>
                    </div>
                    <div className="comm-title">{item.title}</div>
                    <div className="comm-sub">{item.body}</div>
                    <div className="comm-agent">{item.agent}</div>
                  </div>
                  <div className="comm-meta">
                    {item.direction === 'out'
                      ? <ArrowUpRight  size={13} className="comm-dir-out" />
                      : <ArrowDownLeft size={13} className="comm-dir-in"  />
                    }
                    <span className="comm-time">{item.timestamp}</span>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="comm-empty">No communications match your search.</div>
            )}
          </div>
        </>
      )}

      {/* ── Templates tab ── */}
      {activeTab === 'templates' && (
        <div className="comm-tpl-card">
          <div className="comm-tpl-card-title">Communication Templates</div>

          <table className="comm-tpl-table">
            <thead>
              <tr>
                <th className="comm-tpl-th">Template</th>
                <th className="comm-tpl-th">Channel</th>
                <th className="comm-tpl-th">Case Type</th>
                <th className="comm-tpl-th">Stage</th>
                <th className="comm-tpl-th">Audience</th>
                <th className="comm-tpl-th comm-tpl-th-right">Effectiveness</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} className="comm-tpl-tr">
                  <td className="comm-tpl-td">
                    <div className="comm-tpl-name">{t.name}</div>
                    <div className="comm-tpl-code">{t.code}</div>
                  </td>
                  <td className="comm-tpl-td">
                    <ChannelBadge channel={t.channel} />
                  </td>
                  <td className="comm-tpl-td comm-tpl-text">{t.caseType}</td>
                  <td className="comm-tpl-td comm-tpl-text">{t.stage}</td>
                  <td className="comm-tpl-td comm-tpl-text">{t.audience}</td>
                  <td className="comm-tpl-td comm-tpl-eff">{t.effectiveness}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
