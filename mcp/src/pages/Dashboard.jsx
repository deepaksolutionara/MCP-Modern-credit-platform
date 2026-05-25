import React, { useEffect } from 'react';
import { useState } from 'react';
import '../App.css';
import PageHeader from '../common/PageHeader';
import {
  Briefcase, Package, Clock, AlertTriangle, CheckCircle2,
  ArrowUpRight, RefreshCw, ShieldAlert,
  Activity, Settings2, Zap, Timer,
} from 'lucide-react';

import Announcement from '../common/Announcement'
import Kpicard from '../common/Kpicard'
import SLAHotlist from '../components/dashboard/SLAHotlist';
import { Link } from 'lucide-react';

// ── KPI Data ──────────────────────────────────────────────────────────────────

const kpiRow1 = [
  { value: '28',   label: 'Orders Pending Credit Review',    Icon: Briefcase,    color: '#3b82f6', bg: '#eff6ff',to: '/queues' },
  { value: '28',   label: 'Reviewed Orders Remaining on hold',   Icon: Package,      color: '#f97316', bg: '#fff7ed', to: '/held-orders'             },
  { value: '22',   label: 'SLA Risk Queue (near breach)',         Icon: Clock,        color: '#f59e0b', bg: '#fffbeb'                                                       },
  { value: '16',   label: 'Breached SLA',            Icon: AlertTriangle,color: '#ef4444', bg: '#fef2f2', to: '/queues?queue=breached'   },
  { value: '1',   label: 'Recently Auto-Released',  Icon: CheckCircle2, color: '#22c55e', bg: '#f0fdf4'                                                                     },
  { value: '14',   label: 'Escalation queue',        Icon: ArrowUpRight, color: '#ef4444', bg: '#fef2f2', to: '/queues?queue=escalated'  },
  { value: '6',      label: 'Re-decisioning Events:6/Resulting Holds: 2', Icon: RefreshCw,    color: '#3b82f6', bg: '#eff6ff' },
  { value: '$16.9M',  label: 'Critical Collections Exposure(3 critical)',        Icon: ShieldAlert,  color: '#e11d48', bg: '#fff1f2' },
  { value: '1',               label: 'Pending referrals',  Icon: ArrowUpRight, color: '#f97316', bg: '#fff7ed' },
];


// ── SLA Hotlist Data ──────────────────────────────────────────────────────────

const slaItems = [
  { id: 'CASE-2506', status: 'Escalated',               priority: 'Critical', dealerName: 'Alpine Equipment Co',  slaTargetHours: 96, slaElapsedHours: 132 },
  { id: 'CASE-2504', status: 'Waiting on Dealer',        priority: 'Medium',   dealerName: 'ProGear Distribution', slaTargetHours: 96, slaElapsedHours: 94  },
  { id: 'CASE-2501', status: 'Escalated',               priority: 'Critical', dealerName: 'Alpine Equipment Co',  slaTargetHours: 96, slaElapsedHours: 92  },
  { id: 'CASE-2502', status: 'In Review',               priority: 'High',     dealerName: 'ProGear Distribution', slaTargetHours: 96, slaElapsedHours: 52  },
  { id: 'CASE-2503', status: 'Waiting on Return Update', priority: 'Medium',   dealerName: 'SportMax Dealers',     slaTargetHours: 96, slaElapsedHours: 44  },
];

// ── Rule Changes & Auto-Releases ──────────────────────────────────────────────

const ruleChanges = [
  { rule: 'R-THR-001', oldVal: '80%', newVal: '85%', author: 'M. Patel', time: '369d ago' },
  { rule: 'R-SLA-001', oldVal: '96h', newVal: '72h', author: 'M. Patel', time: '371d ago' },
];

const autoReleases = [
  {
    dealer: 'Peak Outdoors',
    orderId: 'ORD-77298',
    reason: 'Qualifying payment received; policy criteria met',
    badge: 'AUTO-RELEASE-PAYMENT',
    time: '370d ago',
  },
];



// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const [showBanner, setShowBanner] = useState(true);
   const [userdata, setUserData] = useState([]);

 useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("http://localhost:3001/api/cases");

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  fetchData();
}, []);
  

  return (
    <div className="dashboard">

      {/* Announcement Banner */}
      {showBanner && (
       <Announcement/>
      )}

      <PageHeader
        title="Control Tower"
        subtitle="Operational visibility for credit decisioning, SLA, escalation, and release orchestration"
        actions={<div className="live-badge"><Activity size={12} /> Live</div>}
      />

      {/* KPI grid — 3 columns × 3 rows, all uniform */}
      <div className="kpi-grid">
        {kpiRow1.map(({ value, label, Icon, color, bg, to }) => (
          <Kpicard
            key={label}
            label={label}
            value={value}
            Icon={Icon}
            color={color}
            bg={bg}
            to={to}
          />
        ))}
      </div>

      {/* SLA Hotlist + Recent Rule Changes */}
      <div className="sla-rules-row">
        <div className="card">
          <div className="section-header">
            <Timer size={16} color="#3b82f6" />
            <span className="section-title">SLA Hotlist</span>
          </div>
          <SLAHotlist items={userdata} />
        </div>

        <div className="card">
          <div className="section-header">
            <Settings2 size={16} color="#3b82f6" />
            <span className="section-title">Recent Rule Changes</span>
          </div>
          <div className="rule-changes-list">
            {ruleChanges.map((rc, i) => (
              <div key={i} className="rule-change-item">
                <div className="rule-change-name">Rule updated: {rc.rule}</div>
                <div className="rule-change-vals">
                  <span className="rule-old">{rc.oldVal}</span>
                  <span className="rule-arrow"> → </span>
                  <span className="rule-new">{rc.newVal}</span>
                </div>
                <div className="rule-change-meta">{rc.author} · {rc.time}</div>
              </div>
            ))}
          </div>
          <a href="#" className="audit-log-link">View full audit log →</a>
        </div>
      </div>

      {/* Recent Auto-Releases */}
      <div className="card">
        <div className="section-header">
          <Zap size={16} color="#3b82f6" />
          <span className="section-title">Recent Auto-Releases</span>
        </div>
        {autoReleases.map((ar, i) => (
          <div key={i} className="auto-release-item">
            <div className="ar-left">
              <div className="ar-dealer">
                {ar.dealer} · <span className="ar-order">{ar.orderId}</span>
              </div>
              <div className="ar-reason">{ar.reason}</div>
            </div>
            <div className="ar-right">
              <span className="ar-badge">{ar.badge}</span>
              <span className="ar-time">{ar.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
