import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Lock } from 'lucide-react';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const reportRows = [
  {
    id: 1,
    accountNo: 'DLR-001', customer: 'Alpine Equipment Co',  order: 'ORD-77321',
    docType: 'C7',
    orderDate: '2025-04-22', shipDate: '2025-04-29', orderAmount: 240000,
    salesRep: 'T. Kim',
    paymentTerms: 'Net 60',
    holdReason: 'Awaiting return posting',
    holdDate: '2025-04-22', nextStatus: 'Pending Review',  lastStatus: 'New',
    customOrder: 'No',  prepaid: 'No',  releaseEligible: 'No',
    currentOwner: 'Mike Chen', slaStatus: 'Near Breach',
    notes: 'Awaiting $200K minimum payment',
  },
  {
    id: 2,
    accountNo: 'DLR-002', customer: 'ProGear Distribution', order: 'ORD-77342',
    docType: 'SO',
    orderDate: '2025-04-22', shipDate: '2025-05-06', orderAmount: 180000,
    salesRep: 'J. Lopez',
    paymentTerms: 'Net 45',
    holdReason: 'Manual hold by credit',
    holdDate: '2025-04-22', nextStatus: 'Pending Review',  lastStatus: 'New',
    customOrder: 'Yes', prepaid: 'No',  releaseEligible: 'No',
    currentOwner: 'Mike Chen', slaStatus: 'Near Breach',
    notes: 'Pending credit analyst review',
  },
  {
    id: 3,
    accountNo: 'DLR-003', customer: 'SportMax Dealers',     order: 'ORD-77390',
    docType: 'RM',
    orderDate: '2025-04-22', shipDate: '2025-05-05', orderAmount: 95000,
    salesRep: 'T. Kim',
    paymentTerms: 'Net 60',
    holdReason: 'Awaiting return posting',
    holdDate: '2025-04-22', nextStatus: 'Pending Release', lastStatus: 'New',
    customOrder: 'No',  prepaid: 'No',  releaseEligible: 'Yes',
    currentOwner: 'Jane Doe',  slaStatus: 'Near Breach',
    notes: 'Return posted — recalculation will release',
  },
  {
    id: 4,
    accountNo: 'DLR-004', customer: 'TrailBlaze Inc',       order: 'ORD-94496',
    docType: 'CA',
    orderDate: '2026-05-09', shipDate: '2026-05-18', orderAmount: 171000,
    salesRep: 'J. Lopez',
    paymentTerms: 'Prepaid',
    holdReason: 'Past due > $250K',
    holdDate: '2026-05-09', nextStatus: 'Awaiting Action', lastStatus: 'Reviewed',
    customOrder: 'Yes', prepaid: 'Yes', releaseEligible: 'No',
    currentOwner: 'Jane Doe',  slaStatus: 'On Track',
    notes: 'Demo synthetic record',
  },
  {
    id: 5,
    accountNo: 'DLR-005', customer: 'Peak Outdoors',        order: 'ORD-94705',
    docType: 'SO',
    orderDate: '2026-05-10', shipDate: '2026-05-20', orderAmount: 130000,
    salesRep: 'J. Lopez',
    paymentTerms: 'Net 45',
    holdReason: 'Utilization > 85%',
    holdDate: '2026-05-10', nextStatus: 'Pending Review',  lastStatus: 'New',
    customOrder: 'No',  prepaid: 'No',  releaseEligible: 'No',
    currentOwner: 'Mike Chen', slaStatus: 'Breached',
    notes: 'Demo synthetic record',
  },
];

const GENERATED = new Date().toLocaleString('en-GB', {
  day: 'numeric', month: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function SlaBadge({ status }) {
  return <span>{status}</span>;
}

function BoolCell({ val }) {
  return <span>{val}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreditHoldReport() {
  const [filter, setFilter] = useState('');

  const rows = useMemo(() => {
    if (!filter.trim()) return reportRows;
    const q = filter.toLowerCase();
    return reportRows.filter(r =>
      r.customer.toLowerCase().includes(q) ||
      r.accountNo.toLowerCase().includes(q) ||
      r.order.toLowerCase().includes(q) ||
      r.holdReason.toLowerCase().includes(q) ||
      r.salesRep.toLowerCase().includes(q) ||
      r.currentOwner.toLowerCase().includes(q) ||
      r.notes.toLowerCase().includes(q)
    );
  }, [filter]);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="chr-page-header">
        <div className="chr-header-left">
          <div className="chr-header-icon">
            <FileText size={20} color="#3b82f6" />
          </div>
          <div>
            <div className="chr-page-title">Credit Hold Report</div>
            <div className="chr-page-sub">
              Daily hold reporting — supports continuity with the legacy Excel report.
            </div>
          </div>
        </div>
        <div className="chr-export-btns">
          <button className="chr-btn-csv">
            <FileText size={13} /> CSV
          </button>
          <button className="chr-btn-xlsx">
            <Download size={13} /> XLSX
          </button>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="chr-meta-bar">
        <span className="chr-meta-item">Generated: {GENERATED}</span>
        <span className="chr-meta-sep">|</span>
        <span className="chr-meta-item">By: Jane Doe (Credit Team User)</span>
        <span className="chr-meta-sep">|</span>
        <span className="chr-meta-item">Rows: {rows.length}</span>
        <span className="chr-meta-sep">|</span>
        <span className="chr-top-secret">
          <Lock size={11} /> TOP SECRET
        </span>
      </div>

      {/* Filter */}
      <div className="chr-filter-wrap">
        <Filter size={14} color="#94a3b8" />
        <input
          className="chr-filter-input"
          placeholder="Filter by customer, order, sales rep, reason..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {/* Table card */}
      <div className="card chr-table-card">
        <div className="chr-preview-label">Report preview</div>
        <div className="chr-table-wrap">
          <table className="chr-table">
            <thead>
              <tr>
                <th className="chr-th">Account #</th>
                <th className="chr-th">Customer</th>
                <th className="chr-th">Order #</th>
                <th className="chr-th">Document Type</th>
                <th className="chr-th">Order Date</th>
                <th className="chr-th">Requested Ship Date</th>
                <th className="chr-th">Order Amount</th>
                <th className="chr-th">Sales Rep</th>
                <th className="chr-th">Payment Terms</th>
                <th className="chr-th">Hold Reason</th>
                <th className="chr-th">Hold Date</th>
                <th className="chr-th">Next Status</th>
                <th className="chr-th">Last Status</th>
                <th className="chr-th">Custom Order</th>
                <th className="chr-th">Prepaid</th>
                <th className="chr-th">Release Eligible</th>
                <th className="chr-th">Current Owner</th>
                <th className="chr-th">SLA Status</th>
                <th className="chr-th">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="chr-tr">
                  <td className="chr-td chr-td-meta">{r.accountNo}</td>
                  <td className="chr-td chr-td-customer">{r.customer}</td>
                  <td className="chr-td">{r.order}</td>
                  <td className="chr-td chr-td-doctype">{r.docType}</td>
                  <td className="chr-td chr-td-meta">{r.orderDate}</td>
                  <td className="chr-td chr-td-meta">{r.shipDate}</td>
                  <td className="chr-td chr-td-amount">{r.orderAmount.toLocaleString()}</td>
                  <td className="chr-td chr-td-meta">{r.salesRep}</td>
                  <td className="chr-td chr-td-meta">{r.paymentTerms}</td>
                  <td className="chr-td chr-td-reason">{r.holdReason}</td>
                  <td className="chr-td chr-td-meta">{r.holdDate}</td>
                  <td className="chr-td chr-td-status">{r.nextStatus}</td>
                  <td className="chr-td chr-td-meta">{r.lastStatus}</td>
                  <td className="chr-td chr-td-bool"><BoolCell val={r.customOrder} /></td>
                  <td className="chr-td chr-td-bool"><BoolCell val={r.prepaid} /></td>
                  <td className="chr-td chr-td-bool"><BoolCell val={r.releaseEligible} /></td>
                  <td className="chr-td chr-td-owner">{r.currentOwner}</td>
                  <td className="chr-td"><SlaBadge status={r.slaStatus} /></td>
                  <td className="chr-td chr-td-notes">{r.notes}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={19} className="chr-empty">No rows match the filter</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
