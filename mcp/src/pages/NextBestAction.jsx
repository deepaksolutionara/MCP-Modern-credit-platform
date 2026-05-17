import React, { useState } from 'react';
import '../App.css';
import {
  Sparkles, Banknote, LockOpen, Scale, Timer, Users2, ChevronRight,
} from 'lucide-react';

// ── Tabs ──────────────────────────────────────────────────────────────────────

const tabs = [
  { key: 'cash',     label: 'Cash',     Icon: Banknote  },
  { key: 'release',  label: 'Release',  Icon: LockOpen  },
  { key: 'disputes', label: 'Disputes', Icon: Scale     },
  { key: 'sla',      label: 'SLA',      Icon: Timer     },
  { key: 'workload', label: 'Workload', Icon: Users2    },
];

// ── Cash tab data ─────────────────────────────────────────────────────────────

const cashRecovery = [
  {
    dealer:        'Alpine Equipment Co',
    tier:          'D',
    badges:        [],
    amount:        '$580K',
    score:         85,
    bucket:        '90+',
    invoices:      3,
    suggestedPlay: 'Late-Stage Pre-Referral',
  },
  {
    dealer:        'ProGear Distribution',
    tier:          'C',
    badges:        ['Open dispute'],
    amount:        '$240K',
    score:         71,
    bucket:        '31-60',
    invoices:      2,
    suggestedPlay: 'Dispute-Driven Hold Pattern',
  },
  {
    dealer:        'SportMax Dealers',
    tier:          'C',
    badges:        ['Strategic', 'Open dispute'],
    amount:        '$67K',
    score:         38,
    bucket:        '1-30',
    invoices:      1,
    suggestedPlay: 'Strategic-Account Coordinated Touch',
  },
];

const resumeItems = [
  { id: 'COL-4001', dealer: 'Alpine Equipment Co',  stage: 'Pending External Referral' },
  { id: 'COL-4002', dealer: 'ProGear Distribution', stage: 'Dispute Review'            },
  { id: 'COL-4003', dealer: 'SportMax Dealers',     stage: 'Promise to Pay'            },
];

// ── Badge helper ──────────────────────────────────────────────────────────────

function BadgePill({ label }) {
  if (label === 'Open dispute') {
    return <span className="nba-badge-dispute">{label}</span>;
  }
  if (label === 'Strategic') {
    return <span className="nba-badge-strategic">{label}</span>;
  }
  return null;
}

// ── Cash tab ──────────────────────────────────────────────────────────────────

function CashTab() {
  return (
    <div className="nba-tab-content">

      {/* Highest Cash Recovery */}
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Highest Cash Recovery Opportunity</div>
          <div className="nba-section-sub">
            Past-due dealers ranked by configurable priority score (amount, aging, risk, held-order impact).
          </div>
        </div>

        <div className="nba-dealer-list">
          {cashRecovery.map((item, i) => (
            <div className="nba-dealer-row" key={i}>
              <div className="nba-dealer-left">
                <div className="nba-dealer-top">
                  <span className="nba-dealer-name">{item.dealer}</span>
                  <span className="nba-tier-badge">Tier {item.tier}</span>
                  {item.badges.map(b => <BadgePill key={b} label={b} />)}
                </div>
                <div className="nba-dealer-detail">
                  Worst bucket {item.bucket} · {item.invoices} inv · suggested play:{' '}
                  <strong>{item.suggestedPlay}</strong>
                </div>
              </div>
              <div className="nba-dealer-right">
                <div className="nba-dealer-amount">{item.amount}</div>
                <div className="nba-dealer-score">Score {item.score}</div>
              </div>
              <ChevronRight size={16} className="nba-dealer-arrow" />
            </div>
          ))}
        </div>
      </div>

      {/* Resume where you left off */}
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Resume where you left off</div>
        </div>

        <div className="nba-resume-grid">
          {resumeItems.map(item => (
            <div className="nba-resume-card" key={item.id}>
              <div className="nba-resume-id">{item.id}</div>
              <div className="nba-resume-dealer">{item.dealer}</div>
              <div className="nba-resume-stage">Stage: {item.stage}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Placeholder tab ───────────────────────────────────────────────────────────

function PlaceholderTab({ label, Icon }) {
  return (
    <div className="nba-tab-content">
      <div className="nba-section-card nba-placeholder">
        <Icon size={32} color="#cbd5e1" />
        <div className="nba-placeholder-title">{label}</div>
        <div className="nba-placeholder-sub">This worklist is coming soon.</div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NextBestAction() {
  const [activeTab, setActiveTab] = useState('cash');

  return (
    <div className="dashboard">

      {/* Page header */}
      <div className="nba-page-header">
        <Sparkles size={22} className="nba-page-icon" />
        <div>
          <div className="nba-page-title">Next-Best-Action Hub</div>
          <div className="nba-page-sub">
            Prioritized worklists that put cash recovery, release unlock, and SLA-critical actions first.
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="nba-tabbar">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nba-tab ${activeTab === key ? 'nba-tab-active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'cash'     && <CashTab />}
      {activeTab === 'release'  && <PlaceholderTab label="Release Unlock Worklist"  Icon={LockOpen} />}
      {activeTab === 'disputes' && <PlaceholderTab label="Disputes Worklist"        Icon={Scale}    />}
      {activeTab === 'sla'      && <PlaceholderTab label="SLA-Critical Worklist"    Icon={Timer}    />}
      {activeTab === 'workload' && <PlaceholderTab label="Workload Balancing"       Icon={Users2}   />}

    </div>
  );
}
