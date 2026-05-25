import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { KeyRound, ArrowRight } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { heldOrders } from '../data/releaseUnlockData';

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

const totalBlocked = heldOrders.reduce((s, o) => s + o.amount, 0);

export default function ReleaseUnlock() {
  return (
    <div className="dashboard">

      <PageHeader
        icon={<KeyRound size={20} color="#3b82f6" />}
        title="Release Unlock Explorer"
        subtitle="Held orders ranked by revenue unlock potential. Open one to see what would clear it."
        actions={<div className="reu-total-badge">{fmt(totalBlocked)} total blocked</div>}
      />

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
                  <Link to={`/release-unlock/${row.orderId}`} className="reu-explore-btn">
                    Explore <ArrowRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
