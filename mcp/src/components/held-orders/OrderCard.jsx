import React from 'react'
import { Package, Clock, CheckCircle, ArrowUp, ShieldCheck, Bell, History } from 'lucide-react';
import { InvoiceBadge,DisputeBadge,AgingBadge } from '../../pages/HeldOrders';

function OrderCard({ order }) {
  const isEligible = order.status === 'release-eligible';

  return (
    <div className="ho-card">
      {/* ── Card header ── */}
      <div className="ho-card-header">
        <div className="ho-card-meta">
          <span className="ho-order-id">{order.id}</span>
          {isEligible ? (
            <span className="ho-status-badge ho-status-eligible">
              <CheckCircle size={12} /> Release-eligible
            </span>
          ) : (
            <span className="ho-status-badge ho-status-held">
              <Clock size={12} /> Held
            </span>
          )}
        </div>
        <div className="ho-card-links">
          <a href="#" className="ho-link">{order.dealerId}</a>
          <span className="ho-link-dot">·</span>
          <a href="#" className="ho-link">{order.caseId}</a>
          <span className="ho-link-dot">·</span>
          <a href="#" className="ho-link">{order.decId}</a>
        </div>
      </div>

      <div className="ho-card-title">{order.dealer} — {order.amount}</div>
      <div className="ho-card-subtitle">{order.holdReason} · Submitted {order.submittedAgo}</div>

      {/* ── Auto-release status ── */}
      <div className="ho-auto-release-box">
        <div className="ho-auto-release-label">AUTO-RELEASE STATUS</div>
        <div className="ho-auto-release-text">{order.autoReleaseStatus}</div>
      </div>

      {/* ── Invoices + Disputes columns ── */}
      <div className="ho-two-col">
        {/* Invoices */}
        <div className="ho-col-box">
          <div className="ho-col-header">
            <span className="ho-col-title">
              <span className="ho-col-icon">☰</span> Invoices impacting hold ({order.invoices.length})
            </span>
            <span className="ho-col-meta">Exposure: {order.invoiceExposure}</span>
          </div>
          <div className="ho-col-rows">
            {order.invoices.map(inv => (
              <div key={inv.id} className="ho-inv-row">
                <span className="ho-inv-id">{inv.id}</span>
                <InvoiceBadge status={inv.status} color={inv.statusColor} />
                <AgingBadge bucket={inv.agingBucket} />
                <span className="ho-inv-amount">{inv.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disputes */}
        <div className="ho-col-box">
          <div className="ho-col-header">
            <span className="ho-col-title">
              <span className="ho-col-icon">⚖</span> Disputes affecting hold ({order.disputes.length})
            </span>
            <span className="ho-col-meta">Disputed: {order.disputedAmount}</span>
          </div>
          <div className="ho-col-rows">
            {order.disputes.length === 0 ? (
              <div className="ho-no-disputes">No active disputes</div>
            ) : (
              order.disputes.map(d => (
                <div key={d.id} className="ho-inv-row">
                  <span className="ho-inv-id">{d.id}</span>
                  <DisputeBadge status={d.status} />
                  <span className="ho-disp-type">{d.type}</span>
                  <span className="ho-inv-amount">{d.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Status timeline ── */}
      {order.timeline.length > 0 && (
        <div className="ho-section">
          <div className="ho-section-header">
            <Clock size={14} className="ho-section-icon" />
            <span className="ho-section-title">Status timeline</span>
          </div>
          <div className="ho-timeline">
            {order.timeline.map((item, i) => (
              <div key={i} className="ho-timeline-item">
                <div className="ho-timeline-body">
                  <div className="ho-timeline-event">{item.event}</div>
                  <div className="ho-timeline-detail">{item.detail}</div>
                </div>
                <div className="ho-timeline-ago">{item.ago}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Notifications sent ── */}
      {order.notifications.length > 0 && (
        <div className="ho-section">
          <div className="ho-section-header">
            <Bell size={14} className="ho-section-icon" />
            <span className="ho-section-title">Notifications sent</span>
          </div>
          <div className="ho-notif-list">
            {order.notifications.map((n, i) => (
              <div key={i} className="ho-notif-row">
                <span className="ho-notif-role">{n.role}</span>
                <span className="ho-notif-msg">{n.message}</span>
                <span className="ho-notif-ago">{n.ago}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Trigger Resolution Event ── */}
      <div className="ho-section">
        <div className="ho-section-header">
          <ShieldCheck size={14} className="ho-section-icon" />
          <span className="ho-section-title">Trigger Resolution Event</span>
        </div>
        <div className="ho-resolution-btns">
          <button className="ho-res-btn">Payment $50K received</button>
          <button className="ho-res-btn">Return posted</button>
          <button className="ho-res-btn">Credit override</button>
          <button className="ho-res-btn">Credit increase</button>
        </div>
      </div>

      {/* ── Resolution Event History ── */}
      {order.resolutionHistory.length > 0 && (
        <div className="ho-section">
          <div className="ho-section-header">
            <History size={14} className="ho-section-icon" />
            <span className="ho-section-title">Resolution Event History</span>
          </div>
          <div className="ho-res-history">
            {order.resolutionHistory.map((item, i) => (
              <div key={i} className="ho-res-history-item">
                <div className="ho-res-history-left">
                  <Clock size={13} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div className="ho-res-history-event">{item.event} · {item.amount}</div>
                    <div className="ho-res-history-detail">{item.detail}</div>
                  </div>
                </div>
                <div className="ho-timeline-ago">{item.ago}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
