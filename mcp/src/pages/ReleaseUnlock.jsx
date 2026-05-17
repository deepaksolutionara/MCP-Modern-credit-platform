import React from 'react';
import '../App.css';
import { KeyRound, ArrowRight } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const heldOrders = [
  {
    orderId:    'ORD-77321',
    dealer:     'Alpine Equipment Co',
    holdReason: 'Past due + utilization breach',
    amount:     240000,
  },
  {
    orderId:    'ORD-77342',
    dealer:     'ProGear Distribution',
    holdReason: 'Open order pushes exposure above limit',
    amount:     180000,
  },
  {
    orderId:    'ORD-77390',
    dealer:     'SportMax Dealers',
    holdReason: 'Return $28K pending posting',
    amount:     95000,
  },
  {
    orderId:    'ORD-77265',
    dealer:     'Riverside Sports Co',
    holdReason: 'Risk flag — credit review pending',
    amount:     27800,
  },
  {
    orderId:    'ORD-77241',
    dealer:     'Summit Athletics',
    holdReason: 'Annual review overdue — financials not submitted',
    amount:     15600,
  },
];

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

const totalBlocked = heldOrders.reduce((s, o) => s + o.amount, 0);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReleaseUnlock() {
  return (
    <div className="dashboard">

      {/* Page header */}
      <div className="reu-header">
        <div className="reu-header-left">
          <KeyRound size={22} className="reu-header-icon" />
          <div>
            <div className="reu-title">Release Unlock Explorer</div>
            <div className="reu-sub">
              Held orders ranked by revenue unlock potential. Open one to see what would clear it.
            </div>
          </div>
        </div>
        <div className="reu-total-badge">{fmt(totalBlocked)} total blocked</div>
      </div>

      {/* Table */}
      <div className="reu-table-card">
        <table className="reu-table">
          <thead>
            <tr>
              <th className="reu-th">Order</th>
              <th className="reu-th">Dealer</th>
              <th className="reu-th">Hold Reason</th>
              <th className="reu-th reu-th-right">Unlock</th>
            </tr>
          </thead>
          <tbody>
            {heldOrders.map((row) => (
              <tr key={row.orderId} className="reu-tr">
                <td className="reu-td reu-order-id">{row.orderId}</td>
                <td className="reu-td reu-dealer">{row.dealer}</td>
                <td className="reu-td reu-reason">{row.holdReason}</td>
                <td className="reu-td reu-unlock-cell">
                  <span className="reu-amount">{fmt(row.amount)}</span>
                  <button className="reu-explore-btn">
                    Explore <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
