import React, { useEffect, useState } from 'react';
import '../App.css';
import PageHeader from '../common/PageHeader';
import { Link } from 'react-router-dom';
import {
  Briefcase, Package, Clock, AlertTriangle, CheckCircle2,
  ArrowUpRight, RefreshCw, ShieldAlert, Activity, Settings2, ShieldCheck, Timer,
} from 'lucide-react';
import Announcement from '../common/Announcement';
import Kpicard from '../common/Kpicard';
import SLAHotlist from '../components/dashboard/SLAHotlist';

const CASES_API_URL = 'http://localhost:3001/api/cases';

const kpiRow1 = [
  { value: '28',    label: 'Orders Pending Credit Review',              Icon: Briefcase,    color: '#3b82f6', bg: '#eff6ff', to: '/queues'                },
  { value: '28',    label: 'Reviewed Orders Remaining on Hold',         Icon: Package,      color: '#f97316', bg: '#fff7ed', to: '/held-orders'           },
  { value: '22',    label: 'SLA Risk Queue (near breach)',              Icon: Clock,        color: '#f59e0b', bg: '#fffbeb'                               },
  { value: '16',    label: 'Breached SLA',                             Icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', to: '/queues?queue=breached' },
  { value: '1',     label: 'Recently Auto-Released',                   Icon: CheckCircle2, color: '#22c55e', bg: '#f0fdf4'                               },
  { value: '14',    label: 'Escalation Queue',                         Icon: ArrowUpRight, color: '#ef4444', bg: '#fef2f2', to: '/queues?queue=escalated' },
  { value: '6',     label: 'Re-Decisioning Events — Resulting Holds: 2', Icon: RefreshCw,  color: '#3b82f6', bg: '#eff6ff'                               },
  { value: '$16.9M',label: 'Critical Collections Exposure (3 critical)', Icon: ShieldAlert, color: '#e11d48', bg: '#fff1f2'                              },
  { value: '1',     label: 'Pending Referrals',                        Icon: ArrowUpRight, color: '#f97316', bg: '#fff7ed'                               },
];

const slaItems = [
  { id: 'CASE-2506', status: 'Escalated',              priority: 'Critical', dealerName: 'Alpine Equipment Co',    slaTargetHours: 96, slaElapsedHours: 132 },
  { id: 'CASE-2504', status: 'Waiting on Dealer',      priority: 'Medium',   dealerName: 'ProGear Distribution',   slaTargetHours: 96, slaElapsedHours: 94  },
  { id: 'CASE-2501', status: 'Escalated',              priority: 'Critical', dealerName: 'Alpine Equipment Co',    slaTargetHours: 96, slaElapsedHours: 92  },
  { id: 'CASE-2502', status: 'In Review',              priority: 'High',     dealerName: 'ProGear Distribution',   slaTargetHours: 96, slaElapsedHours: 52  },
  { id: 'CASE-2503', status: 'Waiting on Return Update', priority: 'Medium', dealerName: 'SportMax Dealers',       slaTargetHours: 96, slaElapsedHours: 44  },
];

const ruleChanges = [
  { rule: 'R-THR-001', oldVal: '80%', newVal: '85%', author: 'M. Patel', time: '369d ago' },
  { rule: 'R-SLA-001', oldVal: '96h', newVal: '72h', author: 'M. Patel', time: '371d ago' },
];

const autoReleases = [
  { dealer: 'Peak Outdoors', orderId: 'ORD-77298', reason: 'Qualifying payment received; policy criteria met', badge: 'AUTO-RELEASE-PAYMENT', time: '370d ago' },
];

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ Icon, title, headingLevel = 'h2' }) {
  const Tag = headingLevel;
  return (
    <div className="section-header">
      <Icon size={16} color="#3b82f6" aria-hidden="true" />
      <Tag className="section-title">{title}</Tag>
    </div>
  );
}

// ── Rule change row ───────────────────────────────────────────────────────────

function RuleChangeItem({ rule, oldVal, newVal, author, time }) {
  return (
    <article className="rule-change-item" aria-label={`Rule ${rule} updated`}>
      <div className="rule-change-name">Rule updated: <strong>{rule}</strong></div>
      <div className="rule-change-vals" aria-label={`Changed from ${oldVal} to ${newVal}`}>
        <span className="rule-old" aria-hidden="true">{oldVal}</span>
        <span className="rule-arrow" aria-hidden="true"> → </span>
        <span className="rule-new" aria-hidden="true">{newVal}</span>
      </div>
      <div className="rule-change-meta">{author} · <time>{time}</time></div>
    </article>
  );
}

// ── Auto-release row ──────────────────────────────────────────────────────────

function AutoReleaseItem({ dealer, orderId, reason, badge, time }) {
  return (
    <article className="auto-release-item" aria-label={`Auto-release for ${dealer}, order ${orderId}`}>
      <div className="ar-left">
        <div className="ar-dealer">{dealer} · <span className="ar-order">{orderId}</span></div>
        <div className="ar-reason">{reason}</div>
      </div>
      <div className="ar-right">
        <span className="ar-badge" aria-label={`Type: ${badge}`}>{badge}</span>
        <time className="ar-time">{time}</time>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function Dashboard() {
  const [showBanner, setShowBanner] = useState(true);
  const [userData,   setUserData]   = useState(slaItems);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    async function fetchCases() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(CASES_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setUserData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCases();
  }, []);

  return (
    <>
      {/* Skip-navigation — WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="dashboard" id="main-content">
        {showBanner && <Announcement onClose={() => setShowBanner(false)} />}

        {/* Page title — renders an <h1> inside PageHeader via its title prop */}
        <PageHeader
          title="Control Tower"
          subtitle="Operational visibility for credit decisioning, SLA, escalation, and release orchestration"
          actions={
            <div className="live-badge" aria-label="Live data" role="status">
              <Activity size={12} aria-hidden="true" /> Live
            </div>
          }
        />

        {/* KPI grid — WCAG 1.3.1: labelled region */}
        <section aria-label="Key performance indicators">
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
        </section>

        {/* SLA + Rule Changes */}
        <div className="sla-rules-row">
          <section className="card" aria-label="SLA Hotlist">
            <SectionHeader Icon={Timer} title="SLA Hotlist" />

            {/* WCAG 4.1.3 — live region for async loading */}
            <div aria-live="polite" aria-atomic="true">
              {isLoading && <p>Loading SLA hotlist…</p>}
              {error && (
                <p className="error-text" role="alert">
                  Failed to load live SLA data. Showing fallback data.
                </p>
              )}
            </div>

            <SLAHotlist items={userData} />
          </section>

          <section className="card" aria-label="Recent Rule Changes">
            <SectionHeader Icon={Settings2} title="Recent Rule Changes" />
            <div className="rule-changes-list">
              {ruleChanges.map(item => (
                <RuleChangeItem key={item.rule} {...item} />
              ))}
            </div>
            <Link to="/audit-log" className="audit-log-link">
              View full audit log <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        {/* Auto-Releases */}
        <section className="card" aria-label="Recent Auto-Releases">
          <SectionHeader Icon={ShieldCheck} title="Recent Auto-Releases" />
          {autoReleases.map(item => (
            <AutoReleaseItem key={item.orderId} {...item} />
          ))}
        </section>
      </div>
    </>
  );
}

export default Dashboard;
