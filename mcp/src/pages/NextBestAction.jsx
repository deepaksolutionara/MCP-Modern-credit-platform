import React, { useState } from 'react';
import '../App.css';
import { Sparkles, CreditCard, Lock, Scale, Clock, User } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import CashTab     from '../components/nextbestaction/CashTab';
import ReleaseTab  from '../components/nextbestaction/ReleaseTab';
import DisputesTab from '../components/nextbestaction/DisputesTab';
import SLATab      from '../components/nextbestaction/SLATab';
import WorkloadTab from '../components/nextbestaction/WorkloadTab';

// ── Tabs ──────────────────────────────────────────────────────────────────────

const tabs = [
  { key: 'cash',     label: 'Cash',     Icon: CreditCard },
  { key: 'release',  label: 'Release',  Icon: Lock       },
  { key: 'disputes', label: 'Disputes', Icon: Scale      },
  { key: 'sla',      label: 'SLA',      Icon: Clock      },
  { key: 'workload', label: 'Workload', Icon: User       },
];

// ── Data (passed as props to each tab) ───────────────────────────────────────

const cashRecovery = [
  {
    dealer: 'Alpine Equipment Co', tier: 'D', badges: [],
    amount: '$580K', score: 85, bucket: '90+', invoices: 3,
    suggestedPlay: 'Late-Stage Pre-Referral',
  },
  {
    dealer: 'ProGear Distribution', tier: 'C', badges: ['Open dispute'],
    amount: '$240K', score: 71, bucket: '31-60', invoices: 2,
    suggestedPlay: 'Dispute-Driven Hold Pattern',
  },
  {
    dealer: 'SportMax Dealers', tier: 'C', badges: ['Strategic', 'Open dispute'],
    amount: '$67K', score: 38, bucket: '1-30', invoices: 1,
    suggestedPlay: 'Strategic-Account Coordinated Touch',
  },
];

const slaCases = [
  { id: 'CASE-2506', status: 'Escalated',          priority: 'Critical', dealer: 'Alpine Equipment Co',               breached: 'Breached +36h' },
  { id: 'CASE-2667', status: 'Escalated',          priority: 'Medium',   dealer: 'Hilltop Golf Center (Collections)', breached: 'Breached +17h' },
  { id: 'CASE-2677', status: 'Escalated',          priority: 'Low',      dealer: 'Tradition Golf Outfitters',         breached: 'Breached +17h' },
  { id: 'CASE-2635', status: 'New',                priority: 'Critical', dealer: 'Sand Trap Golf Co',                 breached: 'Breached +16h' },
  { id: 'CASE-2655', status: 'Waiting on Payment', priority: 'Critical', dealer: 'Tennis Express',                    breached: 'Breached +14h' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NextBestAction() {
  const [activeTab, setActiveTab] = useState('cash');

  return (
    <div className="dashboard">

      <PageHeader
        icon={<Sparkles size={18} color="#3b82f6" />}
        title="Next-Best-Action Hub"
        subtitle="Prioritized worklists that put cash recovery, release unlock, and SLA-critical actions first."
      />

      {/* Tab bar */}
      <div className="nba-tabbar">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nba-tab${activeTab === key ? ' nba-tab-active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'cash'     && <CashTab cashRecovery={cashRecovery} />}
      {activeTab === 'release'  && <ReleaseTab />}
      {activeTab === 'disputes' && <DisputesTab />}
      {activeTab === 'sla'      && <SLATab slaCases={slaCases} />}
      {activeTab === 'workload' && <WorkloadTab />}

    </div>
  );
}
