import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, AlertTriangle, Inbox } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const rdEvents = [
  {
    id: 'RD-5001', trigger: 'Payment received',
    customer: 'Peak Outdoors', accountNo: 'DLR-005', orderId: 'ORD-77298',
    prior: 'Hold required', outcome: 'Eligible to proceed',
    jde: 'Release', exposureDelta: '$-65K', rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5002', trigger: 'AR balance change',
    customer: 'Alpine Equipment Co', accountNo: 'DLR-001', orderId: 'ORD-77321',
    prior: 'Hold required', outcome: 'Hold required',
    jde: 'No change (AR)', exposureDelta: null, rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5003', trigger: 'Dispute opened',
    customer: 'ProGear Distribution', accountNo: 'DLR-002', orderId: 'ORD-77342',
    prior: 'Eligible to proceed', outcome: 'Conditional review',
    jde: 'Hold (DS)', exposureDelta: '+$11K', rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5004', trigger: 'Return processed',
    customer: 'SportMax Dealers', accountNo: 'DLR-003', orderId: 'ORD-77390',
    prior: 'Conditional review', outcome: 'Hold required',
    jde: 'Hold (PR)', exposureDelta: '+$15K', rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5005', trigger: 'Order modified',
    customer: 'ProGear Distribution', accountNo: 'DLR-002', orderId: 'ORD-77351',
    prior: 'Hold required', outcome: 'Conditional review',
    jde: 'Hold (RV)', exposureDelta: '$-45K', rule: 'Credit Policy v1.7', when: '392d ago',
  },
  {
    id: 'RD-5006', trigger: 'Scheduled pre-fulfillment review',
    customer: 'TrailBlaze Inc', accountNo: 'DLR-106', orderId: 'ORD-77411',
    prior: 'Eligible to proceed', outcome: 'Eligible to proceed',
    jde: 'No change', exposureDelta: null, rule: 'Credit Policy v1.7', when: '392d ago',
  },
];
// Columns----------
const COLUMNS = [
  { key: 'id', label: 'Event', thClass: 'rde-th-event', tdClass: 'rde-td-event' },
  {
    key: 'trigger',
    label: 'Trigger',
    render: e => <span className="rde-trigger-pill">{e.trigger}</span>,
  },
  {
    key: 'customer',
    label: 'Customer',
    tdClass: 'rde-td-customer',
    render: e => (
      <Link to={`/customers/${e.accountNo}`} className="rde-customer-link">
        {e.customer}
      </Link>
    ),
  },
  {
    key: 'orderId',
    label: 'Order',
    render: e => (
      <Link
        to={`/held-orders?order=${e.orderId}`}
        className="rde-order-link"
        aria-label={`Order ${e.orderId}`}
      >
        {e.orderId}
      </Link>
    ),
  },
  {
    key: 'outcome',
    label: 'Prior → New outcome',
    tdClass: 'rde-td-outcome',
    render: e => (
      <span aria-label={`Prior: ${e.prior}. New outcome: ${e.outcome}`}>
        <div className="rde-prior-row" aria-hidden="true">{e.prior} →</div>
        <OutcomeBadge outcome={e.outcome} />
      </span>
    ),
  },
  { key: 'jde', label: 'JDE action', tdClass: 'rde-td-jde' },
  {
    key: 'exposureDelta',
    label: 'Exposure Δ',
    tdClass: 'rde-td-exposure',
    render: e =>
      e.exposureDelta ? (
        <span className="rde-delta-val">{e.exposureDelta}</span>
      ) : (
        <span className="rde-dash" aria-label="No exposure change">—</span>
      ),
  },
  { key: 'rule', label: 'Rule', tdClass: 'rde-td-rule' },
  { key: 'when', label: 'When', tdClass: 'rde-td-when' },
];

// Number of columns — used in colSpan for state rows. Update if columns change.
const COLUMN_COUNT = COLUMNS.length;

// ── helpers ───────────────────────────────────────────────────────────────────

const OUTCOME_CLS = {
  'Eligible to proceed': 'rde-outcome-green',
  'Hold required': 'rde-outcome-red',
  'Conditional review': 'rde-outcome-amber',
};

function OutcomeBadge({ outcome }) {
  return (
    <span className={`rde-outcome-badge ${OUTCOME_CLS[outcome] ?? 'rde-outcome-default'}`}>
      {outcome}
    </span>
  );
}

// ── Table body states ─────────────────────────────────────────────────────────

// Shimmer skeleton — shown while data is loading. Keeps the <thead> stable so
// the page doesn't shift when real rows arrive.
function LoadingRows() {
  return Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className="rde-tr" aria-hidden="true">
      {Array.from({ length: COLUMN_COUNT }, (_, ci) => (
        <td key={ci} className="rde-td">
          <span className="rde-skeleton" />
        </td>
      ))}
    </tr>
  ));
}

// Full-width empty state row.
function EmptyRow() {
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className="rde-state-cell">
        <div className="rde-state-wrap">
          <Inbox size={28} className="rde-state-icon rde-state-icon-empty" aria-hidden="true" />
          <p className="rde-state-msg">No re-decisioning events found.</p>
          <p className="rde-state-sub">Events will appear here once the engine processes a trigger.</p>
        </div>
      </td>
    </tr>
  );
}

// Full-width error state row with a retry callback.
function ErrorRow({ onRetry }) {
  return (
    <tr>

      <td colSpan={COLUMN_COUNT} className="rde-state-cell">
        <div className="rde-state-wrap">
          <AlertTriangle size={28} className="rde-state-icon rde-state-icon-error" aria-hidden="true" />
          <p className="rde-state-msg">Failed to load events.</p>
          <p className="rde-state-sub">Check your connection and try again.</p>
          <button className="rde-retry-btn" onClick={onRetry}>Retry</button>
        </div>
      </td>
    </tr>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReDecisioningEvents() {
  // In production, drive this from a useEffect fetch:
  //   'loading' → 'ready' | 'error'
  // Defaulting to 'ready' here since rdEvents is static mock data.
  const [status, setStatus] = useState('ready');

  // rdEvents is a module-level constant so [] is the correct dep array —
  // these values are computed once on mount and never recalculated.
 const stats = useMemo(() => {
  return rdEvents.reduce(
    (acc, event) => {
      acc.total += 1;

      if (event.outcome === 'Hold required') acc.holds += 1;
      if (event.outcome === 'Eligible to proceed') acc.eligible += 1;
      if (event.outcome === 'Conditional review') acc.conditional += 1;

      return acc;
    },
    { total: 0, holds: 0, eligible: 0, conditional: 0 }
  );
}, []);

const { total, holds, eligible, conditional } = stats;
  const kpis = [
    { label: 'Total events', value: total, className: 'rde-kpi-black' },
    { label: 'Resulting Holds', value: holds, className: 'rde-kpi-red' },
    { label: 'Eligible to proceed', value: eligible, className: 'rde-kpi-green' },
    { label: 'Conditional review', value: conditional, className: 'rde-kpi-amber' },
  ];

  return (
    <div className="dashboard">

      <PageHeader
        icon={<RefreshCw size={18} color="#3b82f6" />}
        title="Re-Decisioning Events"
        subtitle='Each row is a credit re-evaluation triggered by a payment, dispute, return, modification, or scheduled review. "Resulting Holds" counts events whose outcome was a new or maintained credit hold.'
      />

      {/* KPI row — connected cards */}
      <div className="rde-kpi-row">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.label}
            className={`rde-kpi-card ${index === kpis.length - 1 ? 'rde-kpi-card-last' : ''}`}
          >
            <div className="rde-kpi-label">{kpi.label}</div>
            <div className={`rde-kpi-value ${kpi.className}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card rde-table-card">
        <table className="rde-table" aria-label="Re-decisioning events">
          <caption className="rde-caption">
            Credit re-evaluation events — each row is one engine recalculation
          </caption>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className={`rde-th ${col.thClass || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && <LoadingRows />}
            {status === 'error' && <ErrorRow onRetry={() => setStatus('loading')} />}
            {status === 'ready' && rdEvents.length === 0 && <EmptyRow />}
            {status === 'ready' && rdEvents.map(event => (
              <tr key={event.id} className="rde-tr">
                {COLUMNS.map(col => (
                  <td
                    key={col.key}
                    className={`rde-td ${col.tdClass || ''}`}
                  >
                    {col.render ? col.render(event) : event[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
