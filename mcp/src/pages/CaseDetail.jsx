import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Clock, User, Users, Calendar,
  AlertTriangle, FileText, Scale, TrendingUp, Bell, Activity,
  CheckCircle2, ArrowLeft, ArrowUpRight, Shield, Send,
} from 'lucide-react';
import { getCaseDetail } from '../data/casesData';
import { priorityBadge, statusBadge } from '../components/cases/CaseCard';
import '../App.css';


const invoiceBadgeMap = {
  Overdue: { background: '#fee2e2', color: '#dc2626' },
  'Past Due': { background: '#fef3c7', color: '#92400e' },
  Disputed: { background: '#fef9c3', color: '#854d0e' },
  'Pending Return': { background: '#ede9fe', color: '#6d28d9' },
  Paid: { background: '#dcfce7', color: '#15803d' },
  Open: { background: '#dbeafe', color: '#1d4ed8' },
};

const disputeBadgeMap = {
  Open: { background: '#dbeafe', color: '#1d4ed8' },
  Closed: { background: '#dcfce7', color: '#15803d' },
};
// ── tiny helpers ──────────────────────────────────────────────────────────────

function slaColor(h) {
  if (h <= 0) return '#dc2626';
  if (h <= 12) return '#f59e0b';
  return '#3b82f6';
}

function Badge({ status, map }) {
  const style = map[status] || { background: '#f1f5f9', color: '#475569' };
  return (
    <span className="cdv-badge" style={style}>
      {status}
    </span>
  );
}

// ── Decision section ──────────────────────────────────────────────────────────

function DecisionSection({ c }) {
  return (
    <div className="cdv-section cdv-decision-card">
      <div className="cdv-decision-header">
        <div className="cdv-decision-title-row">
          <span className="cdv-section-label">Decision</span>
          <span className="cdv-under-review">Under Review</span>
        </div>
        <div className="cdv-decision-meta">
          <Clock size={12} color="#94a3b8" />
          Last evaluated {c.lastEvaluated}
          {c.creditPolicy && <> · <span>{c.creditPolicy}</span></>}
        </div>
      </div>

      {c.drivers && c.drivers.length > 0 && (
        <div className="cdv-drivers-block">
          <div className="cdv-sub-label">TOP DRIVERS</div>
          <ul className="cdv-driver-list">
            {c.drivers.map((d, i) => (
              <li key={i} className="cdv-driver-item">
                <span className="cdv-driver-dot" />
                <span>
                  <strong>{d.term}</strong>
                  {d.desc && <> — {d.desc}</>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.nextActions && c.nextActions.length > 0 && (
        <div className="cdv-next-block">
          <div className="cdv-sub-label">NEXT REQUIRED ACTION</div>
          <ul className="cdv-next-list">
            {c.nextActions.map((a, i) => (
              <li key={i} className="cdv-next-item">
                <span className="cdv-arrow">→</span> {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── SLA & Assignment section ──────────────────────────────────────────────────

function SLASection({ c }) {
  const breached = c.slaHoursLeft <= 0;
  const progress = breached ? 0 : Math.min(100, (c.slaHoursLeft / c.slaTotalHours) * 100);
  const slaLabel = breached
    ? `Breached +${Math.abs(c.slaHoursLeft)}h`
    : `${c.slaHoursLeft}h left`;

    const slaActions = [
  { label: 'Reassign', Icon: User, className: 'cdv-btn-ghost' },
  { label: 'Escalate', Icon: ArrowUpRight, className: 'cdv-btn-escalate' },
  { label: 'Override', Icon: Shield, className: 'cdv-btn-ghost' },
];

  return (
    <div className="cdv-section">

      <SectionTitle Icon={Clock} >SLA &amp; Assignment</SectionTitle>
      <div className="cdv-stat-grid">
        {[
          { Icon: User, label: 'Owner', value: c.owner },
          { Icon: Users, label: 'Team', value: c.team },
          { Icon: Calendar, label: 'Created', value: c.createdAgo },
          { Icon: Calendar, label: 'Due', value: c.dueDate || '—' },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="cdv-stat-box">
            <div className="cdv-stat-label">
              <Icon size={11} color="#94a3b8" /> {label}
            </div>
            <div className="cdv-stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="cdv-sla-row">
        <span className="cdv-sla-countdown-label">SLA Countdown</span>
        <span className="cdv-sla-countdown-val" style={{ color: slaColor(c.slaHoursLeft) }}>
          {slaLabel}
        </span>
      </div>
      <div className="cdv-sla-track">
        <div className="cdv-sla-fill" style={{ width: `${progress}%`, background: slaColor(c.slaHoursLeft) }} />
      </div>

      <div className="cdv-action-row">
        <div className="cdv-action-left">
          <div className="cdv-select-wrap">
            <select className="cdv-status-select no-arrow">
              <option>{c.status}</option>
            </select>
            <ChevronDown size={12} className="cdv-select-chevron" />
          </div>
          <button className="cdv-btn cdv-btn-ghost">
            <User size={13} /> Reassign
          </button>
          <button className="cdv-btn cdv-btn-escalate">
            <ArrowUpRight size={13} /> Escalate
          </button>
          <button className="cdv-btn cdv-btn-ghost">
            <Shield size={13} /> Override
          </button>
        </div>
      </div>
      <div className="cdv-resolve-row">
        <button className="cdv-btn-resolve">
          <CheckCircle2 size={14} /> Resolve
        </button>
      </div>
    </div>
  );
}

// ── Decision Context section ──────────────────────────────────────────────────

function DecisionContextSection({ c }) {
  const ctx = c.decisionContext;

  return (
    <div className="cdv-section">

      <SectionTitle Icon={Activity} > Decision Context</SectionTitle>

      <div className="cdv-ctx-grid">
        <div className="cdv-ctx-box">
          <div className="cdv-ctx-label">Outcome</div>
          <div className="cdv-ctx-val">{ctx.outcome}</div>
        </div>
        <div className="cdv-ctx-box">
          <div className="cdv-ctx-label">Engine Score</div>
          <div className="cdv-ctx-val">
            {ctx.engineScore !== null
              ? <>{ctx.engineScore}{ctx.engineGrade && <span className="cdv-grade"> ({ctx.engineGrade})</span>}</>
              : <span className="cdv-na">N/A</span>}
          </div>
        </div>
        <div className="cdv-ctx-box">
          <div className="cdv-ctx-label">Workflow</div>
          <div className="cdv-ctx-val">{ctx.workflow}</div>
        </div>
      </div>

      {ctx.reasonCodes.length > 0 && (
        <div className="cdv-reason-block">
          <div className="cdv-sub-label">Reason Codes</div>
          {ctx.reasonCodes.map(rc => (
            <div key={rc.code} className="cdv-reason-row">
              <span className="cdv-reason-pill">{rc.code}</span>
              <span className="cdv-reason-desc">{rc.description}</span>
            </div>
          ))}
        </div>
      )}

      {ctx.thresholdBreaches.length > 0 && (
        <div className="cdv-breach-block">
          <div className="cdv-sub-label">Threshold Breaches</div>
          {ctx.thresholdBreaches.map((b, i) => (
            <div key={i} className="cdv-breach-row">
              <span className="cdv-breach-rule">{b.rule}</span>
              <span className="cdv-breach-vals">
                Threshold {b.threshold} · Actual{' '}
                <strong className="cdv-breach-actual">{b.actual}</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Notes section ─────────────────────────────────────────────────────────────

function NotesSection({ notes }) {
  const [draft, setDraft] = useState('');
  return (
    <div className="cdv-section">

      <SectionTitle Icon={FileText} >Notes</SectionTitle>

      {notes.length > 0 && (
        <div className="cdv-notes-list">
          {notes.map((n, i) => (
            <div key={i} className="cdv-note-item">
              <div className="cdv-note-meta">
                <span className="cdv-note-author">{n.author}</span>
                <span className="cdv-note-time">{n.timeAgo || n.date}</span>
              </div>
              <div className="cdv-note-text">{n.text}</div>
            </div>
          ))}
        </div>
      )}

      <div className="cdv-note-input-row">
        <input
          className="cdv-note-input"
          placeholder="Add note..."
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        <button className="cdv-note-send" onClick={() => setDraft('')}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Sidebar sections ──────────────────────────────────────────────────────────

function LinkedItems({ Icon, title, items, total, BadgeComponent }) {
  return (
    <div className="cdv-sb-section">
      <div className="cdv-sb-header">
        <Icon size={13} color="#64748b" />
        <span>{title} ({items.length})</span>
        {total && <span className="cdv-sb-total">{total}</span>}
      </div>

      {items.length === 0 ? (
        <div className="cdv-sb-empty">None linked</div>
      ) : (
        items.map(item => (
          <div key={item.id} className="cdv-linked-row">
            <span className="cdv-linked-id">{item.id}</span>
            {BadgeComponent(item.status)}
            <span className="cdv-linked-amt">{item.amount}</span>
          </div>
        ))
      )}
    </div>
  );
}

function FinancialSummary({ fin }) {
  if (!fin) return null;
  const pastDueColor = parseFloat(fin.pastDue) > 0 ? '#dc2626' : '#0f172a';
  const availColor = fin.available !== '$0' ? '#15803d' : '#0f172a';

  return (
    <div className="cdv-sb-section">
      <div className="cdv-sb-header">
        <TrendingUp size={13} color="#64748b" />
        <span>Vendor Financial Summary</span>
      </div>
      <div className="cdv-fin-rows">
        {[
          { label: 'Total AR', val: fin.totalAR, color: '#0f172a' },
          { label: 'Past Due', val: fin.pastDue, color: pastDueColor },
          { label: 'Credit Limit', val: fin.creditLimit, color: '#0f172a' },
          { label: 'Available', val: fin.available, color: availColor },
          { label: 'Utilization', val: fin.utilization, color: '#0f172a' },
          { label: 'Aging Trend', val: fin.agingTrend, color: '#0f172a' },
          { label: 'Open Order Impact', val: fin.openOrderImpact, color: '#0f172a' },
          { label: 'Pending Returns', val: fin.pendingReturns, color: '#0f172a' },
        ].map(({ label, val, color }) => (
          <div key={label} className="cdv-fin-row">
            <span className="cdv-fin-label">{label}</span>
            <span className="cdv-fin-val" style={{ color }}>{val}</span>
          </div>
        ))}
        {fin.liquidityFlag && (
          <div className="cdv-fin-flag">
            <AlertTriangle size={12} color="#dc2626" />
            <span>Liquidity flag raised</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityAudit({ timeline }) {
  return (
    <div className="cdv-sb-section">
      <div className="cdv-sb-header">
        <Activity size={13} color="#64748b" />
        <span>Activity &amp; Audit</span>
      </div>
      <div className="cdv-audit-list">
        {timeline.map((t, i) => (
          <div key={i} className="cdv-audit-item">
            <div className="cdv-audit-bar" />
            <div className="cdv-audit-body">
              <div className="cdv-audit-action">{t.action}</div>
              <div className="cdv-audit-detail">{t.detail}</div>
              <div className="cdv-audit-meta">{t.user} · {t.timeAgo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSent({ notifications }) {
  return (
    <div className="cdv-sb-section">
      <div className="cdv-sb-header">
        <Bell size={13} color="#64748b" />
        <span>Notifications Sent</span>
      </div>
      {notifications.length === 0
        ? <div className="cdv-sb-empty">No notifications sent</div>
        : notifications.map((n, i) => (
          <div key={i} className="cdv-notif-item">
            <div className="cdv-notif-top">
              <span className="cdv-notif-channel">{n.channel}</span>
              <span className="cdv-notif-time">{n.timeAgo}</span>
            </div>
            <div className="cdv-notif-subject">{n.subject}</div>
            <div className="cdv-notif-recipient">→ {n.recipient}</div>
          </div>
        ))}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────

function SectionTitle({ Icon, children }) {
  return (
    <div className="cdv-section-title">
      <Icon size={14} color="#64748b" />
      {children}
    </div>
  );
}


// ── Main component ────────────────────────────────────────────────────────────

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = getCaseDetail(caseId);

  if (!c) {
    return (
      <div className="dashboard">
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
          Case <strong>{caseId}</strong> not found.{' '}
          <Link to="/cases" style={{ color: '#2563eb' }}>Back to Cases</Link>
        </div>
      </div>
    );
  }

  const pBadge = priorityBadge[c.priority] || { background: '#e2e8f0', color: '#475569' };
  const sBadge = statusBadge[c.status] || { background: '#e2e8f0', color: '#475569' };

  return (
    <div className="dashboard">

      {/* Breadcrumb */}
      <div className="cdv-breadcrumb">
        <Link to="/cases" className="cdv-bc-link">Cases</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <Link to={`/customers/${c.accountNo}`} className="cdv-bc-link">{c.dealer}</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <span className="cdv-bc-current">{c.id}</span>
      </div>

      {/* Meta row: back + case ID + badges + escalation */}
      <div className="cdv-meta-row">
        <button className="cdv-back-btn" onClick={() => navigate('/cases')}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="cdv-case-id">{c.id}</span>
        <span className="case-solid-badge" style={pBadge}>{c.priority}</span>
        <span className="case-solid-badge" style={sBadge}>{c.status}</span>
        {c.escalatedTo && (
          <span className="cdv-escalated-to">
            {c.status} — {c.escalatedTo}
          </span>
        )}
      </div>

      {/* Dealer title */}
      <h1 className="cdv-dealer-title">{c.dealer}</h1>
      <div className="cdv-order-sub">
        Order {c.orderId} · Decision{' '}
        <Link to={`/customers/${c.accountNo}`} className="cdv-dec-link">{c.decId}</Link>
      </div>

      {/* Body: main + sidebar */}
      <div className="cdv-body">

        <div className="cdv-main">
          <DecisionSection c={c} />
          <SLASection c={c} />
          <DecisionContextSection c={c} />
          <NotesSection notes={c.notes} />
        </div>

        <div className="cdv-sidebar">
          <LinkedItems
            Icon={FileText}
            title="Linked Invoices"
            items={c.invoices}
            total={c.invoicesTotal}
            BadgeComponent={(status) => <Badge status={status} map={invoiceBadgeMap} />}
          />
          <LinkedItems
            Icon={Scale}
            title="Linked Disputes"
            items={c.disputes}
            total={c.disputesTotal}
            BadgeComponent={(status) => <Badge status={status} map={disputeBadgeMap} />}
          />
          <FinancialSummary fin={c.financial} />
          <ActivityAudit timeline={c.timeline} />
          <NotificationsSent notifications={c.notifications} />
        </div>

      </div>
    </div>
  );
}
