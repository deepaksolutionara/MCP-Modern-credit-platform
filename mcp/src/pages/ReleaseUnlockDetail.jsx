import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { heldOrders } from '../data/releaseUnlockData';
import '../App.css';
import  formatCurrencyShort  from '../utils/formatters';



function DetailCard({ title, children }) {
  return (
    <div className="reu-det-card">
      <div className="reu-det-card-title">{title}</div>
      {children}
    </div>
  );
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

  const contextItems = [
    { label: 'Dealer', value: order.dealer },
    { label: 'Decision', value: order.decision },
    { label: 'Hold reason', value: order.holdReason },
    { label: 'Case', value: order.caseId },
  ];

  return (
    <div className="dashboard">

      <Link to="/release-unlock" className="reu-det-back">
        <ArrowLeft size={13} /> All release-unlock opportunities
      </Link>

      <PageHeader
        icon={<KeyRound size={20} color="#3b82f6" />}
        title="Release Unlock Explorer"
        subtitle={`What needs to change for ${order.orderId} to become release-eligible.`}
        actions={<div className="reu-total-badge">{formatCurrencyShort(order.amount)} blocked</div>}
      />

      {/* Order context */}

      <DetailCard title="Order Context" >
         <div className="reu-det-context-grid">
          <div className="reu-det-context-grid">
            {contextItems.map(item => (
              <div key={item.label}>
                <div className="reu-det-label">{item.label}</div>
                <div className="reu-det-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </DetailCard>

      {/* What needs to change */}

      <DetailCard title="What needs to change for release eligibility" >
 <div className="reu-det-criteria-list">
          {order.criteria.map((c, i) => (
            <div key={i} className="reu-det-criteria-row">
              {c.met
                ? <CheckCircle2 size={15} className="reu-det-icon-met" />
                : <AlertCircle size={15} className="reu-det-icon-block" />
              }
              <div>
                <div className="reu-det-criteria-text">{c.text}</div>
                {c.sub && <div className="reu-det-criteria-sub">{c.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </DetailCard>

      {/* Potential revenue unlock */}
    
    <DetailCard title="Potential revenue unlock">
<div className="reu-det-amount">{formatCurrencyShort(order.amount)}</div>
        <div className="reu-det-amount-sub">
          If all blocking conditions are cleared, this order will be released by the auto-release engine and synced to JDE.
        </div>
    </DetailCard>


    </div>
  );
}
