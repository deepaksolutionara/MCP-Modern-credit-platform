import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../App.css';
import { Inbox } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import Announcement from '../common/Announcement'

// ── Tab definitions ───────────────────────────────────────────────────────────

const tabs = [
  { key: 'new',           label: 'New' },
  { key: 'in_review',     label: 'In Review' },
  { key: 'waiting_dealer',label: 'Waiting on Dealer' },
  { key: 'waiting_payment',label: 'Waiting on Payment' },
  { key: 'waiting_return', label: 'Waiting on Return' },
  { key: 'escalated',     label: 'Escalated' },
  { key: 'near_breach',   label: 'Near Breach' },
  { key: 'breached_sla',  label: 'Breached SLA' },
  { key: 'auto_released', label: 'Ready / Auto-Released' },
  { key: 'closed',        label: 'Closed' },
];

// ── Mock case data per tab ────────────────────────────────────────────────────

const casesByTab = {
  new: [],
  in_review: [
    { id: 'CASE-2502', dealer: 'ProGear Distribution',  type: 'Credit Review', priority: 'High',     age: '2d',  sla: '44h left',    amount: '$34,000' },
  ],
  waiting_dealer: [
    { id: 'CASE-2504', dealer: 'ProGear Distribution',  type: 'Dispute',       priority: 'Medium',   age: '3d',  sla: '2h left',     amount: '$18,500' },
  ],
  waiting_payment: [],
  waiting_return: [
    { id: 'CASE-2503', dealer: 'SportMax Dealers',      type: 'Collections',   priority: 'Medium',   age: '4d',  sla: '52h left',    amount: '$22,300' },
  ],
  escalated: [
    { id: 'CASE-2506', dealer: 'Alpine Equipment Co',   type: 'Credit Review', priority: 'Critical', age: '5d',  sla: 'Breached +36h', amount: '$91,000' },
    { id: 'CASE-2501', dealer: 'Alpine Equipment Co',   type: 'Dispute',       priority: 'Critical', age: '4d',  sla: '4h left',     amount: '$45,200' },
  ],
  near_breach: [
    { id: 'CASE-2498', dealer: 'Riverside Sports Co',   type: 'Credit Review', priority: 'High',     age: '3d',  sla: '3h left',     amount: '$27,800' },
    { id: 'CASE-2495', dealer: 'Summit Athletics',      type: 'Onboarding',    priority: 'Medium',   age: '2d',  sla: '6h left',     amount: '$15,600' },
  ],
  breached_sla: [
    { id: 'CASE-2489', dealer: 'Nordic Sports Ltd',     type: 'Collections',   priority: 'Critical', age: '7d',  sla: 'Breached +12h', amount: '$63,400' },
  ],
  auto_released: [
    { id: 'CASE-2477', dealer: 'Peak Outdoors',         type: 'Credit Review', priority: 'Low',      age: '1d',  sla: 'Released',    amount: '$11,200' },
  ],
  closed: [],
};

// ── Style helpers ─────────────────────────────────────────────────────────────

const priorityStyle = {
  Critical: { background: '#ef4444', color: '#fff' },
  High:     { background: '#f97316', color: '#fff' },
  Medium:   { background: '#e2e8f0', color: '#475569' },
  Low:      { background: '#dcfce7', color: '#16a34a' },
};

function slaStyle(sla) {
  if (sla.startsWith('Breached')) return { color: '#dc2626', fontWeight: 600 };
  if (sla.includes('left')) {
    const h = parseInt(sla);
    if (h <= 4)  return { color: '#ea580c', fontWeight: 600 };
    if (h <= 12) return { color: '#d97706', fontWeight: 600 };
  }
  if (sla === 'Released') return { color: '#16a34a', fontWeight: 600 };
  return { color: '#64748b' };
}

// ── Component ─────────────────────────────────────────────────────────────────

// Maps ?queue=<value> → tab key
const QUEUE_PARAM_MAP = {
  breached:  'breached_sla',
  escalated: 'escalated',
};

export default function WorkQueue() {
  const [searchParams] = useSearchParams();
  const queueParam = searchParams.get('queue');
  const initialTab = QUEUE_PARAM_MAP[queueParam] ?? 'new';

  const [activeTab, setActiveTab] = useState(initialTab);

  const cases = casesByTab[activeTab] ?? [];

  return (
    <div className="dashboard">

     <Announcement/>

      <PageHeader
        icon={<Inbox size={20} color="#3b82f6" />}
        title="Work Queues"
        subtitle="Operational queues for credit ops triage and resolution"
      />

      {/* Tabs */}
      <div className="card wq-card">
        <div className="wq-tabs">
          {tabs.map(tab => {
            const count = (casesByTab[tab.key] ?? []).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`wq-tab ${isActive ? 'wq-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className={`wq-tab-count ${isActive ? 'wq-tab-count-active' : ''}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {cases.length === 0 ? (
          <div className="wq-empty">No cases in this queue</div>
        ) : (
          <div className="table-wrap">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Dealer</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Age</th>
                  <th>SLA</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id}>
                    <td><a href="#" className="case-id">{c.id}</a></td>
                    <td className="dealer-name">{c.dealer}</td>
                    <td className="case-type">{c.type}</td>
                    <td>
                      <span className="badge" style={priorityStyle[c.priority]}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="case-age">{c.age}</td>
                    <td className="wq-sla" style={slaStyle(c.sla)}>{c.sla}</td>
                    <td className="case-amount">{c.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
