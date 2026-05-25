import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const rdEvents = [
  {
    id: 'RD-5001', trigger: 'Payment received',
    customer: 'Peak Outdoors',        accountNo: 'DLR-005', orderId: 'ORD-77298',
    prior: 'Hold required',           outcome: 'Eligible to proceed',
    jde: 'Release',         exposureDelta: '$-65K',  rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5002', trigger: 'AR balance change',
    customer: 'Alpine Equipment Co',  accountNo: 'DLR-001', orderId: 'ORD-77321',
    prior: 'Hold required',           outcome: 'Hold required',
    jde: 'No change (AR)',  exposureDelta: null,     rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5003', trigger: 'Dispute opened',
    customer: 'ProGear Distribution', accountNo: 'DLR-002', orderId: 'ORD-77342',
    prior: 'Eligible to proceed',     outcome: 'Conditional review',
    jde: 'Hold (DS)',       exposureDelta: '+$11K',  rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5004', trigger: 'Return processed',
    customer: 'SportMax Dealers',     accountNo: 'DLR-003', orderId: 'ORD-77390',
    prior: 'Conditional review',      outcome: 'Hold required',
    jde: 'Hold (PR)',       exposureDelta: '+$15K',  rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5005', trigger: 'Order modified',
    customer: 'ProGear Distribution', accountNo: 'DLR-002', orderId: 'ORD-77351',
    prior: 'Hold required',           outcome: 'Conditional review',
    jde: 'Hold (RV)',       exposureDelta: '$-45K',  rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5006', trigger: 'Scheduled pre-fulfillment review',
    customer: 'TrailBlaze Inc',       accountNo: 'DLR-106', orderId: 'ORD-77411',
    prior: 'Eligible to proceed',     outcome: 'Eligible to proceed',
    jde: 'No change',       exposureDelta: null,     rule: 'Credit Policy v1.7', when: '392d ago',
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────

const OUTCOME_STYLE = {
  'Eligible to proceed': { background: '#22c55e', color: '#fff' },
  'Hold required':       { background: '#ef4444', color: '#fff' },
  'Conditional review':  { background: '#f59e0b', color: '#fff' },
};

function OutcomeBadge({ outcome }) {
  const s = OUTCOME_STYLE[outcome] || { background: '#e2e8f0', color: '#475569' };
  return <span className="rde-outcome-badge" style={s}>{outcome}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReDecisioningEvents() {
  const total       = rdEvents.length;
  const holds       = rdEvents.filter(e => e.outcome === 'Hold required').length;
  const eligible    = rdEvents.filter(e => e.outcome === 'Eligible to proceed').length;
  const conditional = rdEvents.filter(e => e.outcome === 'Conditional review').length;

  return (
    <div className="dashboard">

      <PageHeader
        icon={<RefreshCw size={18} color="#3b82f6" />}
        title="Re-Decisioning Events"
        subtitle='Each row is a credit re-evaluation triggered by a payment, dispute, return, modification, or scheduled review. "Resulting Holds" counts events whose outcome was a new or maintained credit hold.'
      />

      {/* KPI row — connected cards */}
      <div className="rde-kpi-row">
        <div className="rde-kpi-card">
          <div className="rde-kpi-label">Total events</div>
          <div className="rde-kpi-value rde-kpi-black">{total}</div>
        </div>
        <div className="rde-kpi-card">
          <div className="rde-kpi-label">Resulting Holds</div>
          <div className="rde-kpi-value rde-kpi-red">{holds}</div>
        </div>
        <div className="rde-kpi-card">
          <div className="rde-kpi-label">Eligible to proceed</div>
          <div className="rde-kpi-value rde-kpi-green">{eligible}</div>
        </div>
        <div className="rde-kpi-card rde-kpi-card-last">
          <div className="rde-kpi-label">Conditional review</div>
          <div className="rde-kpi-value rde-kpi-amber">{conditional}</div>
        </div>
      </div>

      {/* Table */}
      <div className="card rde-table-card">
        <table className="rde-table">
          <thead>
            <tr>
              <th className="rde-th rde-th-event">Event</th>
              <th className="rde-th">Trigger</th>
              <th className="rde-th">Customer</th>
              <th className="rde-th">Order</th>
              <th className="rde-th">Prior → New</th>
              <th className="rde-th">JDE</th>
              <th className="rde-th">Exposure<br />Δ</th>
              <th className="rde-th">Rule</th>
              <th className="rde-th">When</th>
            </tr>
          </thead>
          <tbody>
            {rdEvents.map(e => (
              <tr key={e.id} className="rde-tr">
                <td className="rde-td rde-td-event">{e.id}</td>
                <td className="rde-td">
                  <span className="rde-trigger-pill">{e.trigger}</span>
                </td>
                <td className="rde-td rde-td-customer">
                  <Link to={`/customers/${e.accountNo}`} className="rde-customer-link">
                    {e.customer}
                  </Link>
                </td>
                <td className="rde-td">
                  <Link to={`/held-orders?order=${e.orderId}`} className="rde-order-link">
                    {e.orderId}
                  </Link>
                </td>
                <td className="rde-td rde-td-outcome">
                  <div className="rde-prior-row">{e.prior} →</div>
                  <OutcomeBadge outcome={e.outcome} />
                </td>
                <td className="rde-td rde-td-jde">{e.jde}</td>
                <td className="rde-td rde-td-exposure">
                  {e.exposureDelta
                    ? <span className="rde-delta-val">{e.exposureDelta}</span>
                    : <span className="rde-dash">—</span>}
                </td>
                <td className="rde-td rde-td-rule">{e.rule}</td>
                <td className="rde-td rde-td-when">{e.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
