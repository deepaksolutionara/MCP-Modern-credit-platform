import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { heldOrders } from '../data/releaseUnlockData';
import '../App.css';

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

export default function ReleaseUnlockDetail() {
  const { orderId } = useParams();
  const order = heldOrders.find(o => o.orderId === orderId);

  if (!order) {
    return (
      <div className="dashboard">
        <div className="reu-det-not-found">Order {orderId} not found.</div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <Link to="/release-unlock" className="reu-det-back">
        <ArrowLeft size={13} /> All release-unlock opportunities
      </Link>

      <PageHeader
        icon={<KeyRound size={20} color="#3b82f6" />}
        title="Release Unlock Explorer"
        subtitle={`What needs to change for ${order.orderId} to become release-eligible.`}
        actions={<div className="reu-total-badge">{fmt(order.amount)} blocked</div>}
      />

      {/* Order context */}
      <div className="reu-det-card">
        <div className="reu-det-card-title">Order context</div>
        <div className="reu-det-context-grid">
          <div>
            <div className="reu-det-label">Dealer</div>
            <div className="reu-det-value">{order.dealer}</div>
          </div>
          <div>
            <div className="reu-det-label">Decision</div>
            <div className="reu-det-value">{order.decision}</div>
          </div>
          <div>
            <div className="reu-det-label">Hold reason</div>
            <div className="reu-det-value">{order.holdReason}</div>
          </div>
          <div>
            <div className="reu-det-label">Case</div>
            <div className="reu-det-value">{order.caseId}</div>
          </div>
        </div>
      </div>

      {/* What needs to change */}
      <div className="reu-det-card">
        <div className="reu-det-card-title">What needs to change for release eligibility</div>
        <div className="reu-det-criteria-list">
          {order.criteria.map((c, i) => (
            <div key={i} className="reu-det-criteria-row">
              {c.met
                ? <CheckCircle2 size={15} className="reu-det-icon-met" />
                : <AlertCircle  size={15} className="reu-det-icon-block" />
              }
              <div>
                <div className="reu-det-criteria-text">{c.text}</div>
                {c.sub && <div className="reu-det-criteria-sub">{c.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Potential revenue unlock */}
      <div className="reu-det-card">
        <div className="reu-det-card-title">Potential revenue unlock</div>
        <div className="reu-det-amount">{fmt(order.amount)}</div>
        <div className="reu-det-amount-sub">
          If all blocking conditions are cleared, this order will be released by the auto-release engine and synced to JDE.
        </div>
      </div>

    </div>
  );
}
