/**
 * CreditHoldReport.jsx
 *
 * Daily credit-hold reporting page. Mirrors the legacy Excel report used by the
 * credit team, with live filter + one-click CSV / XLSX export of whatever rows
 * are currently visible on screen.
 *
 * Export behaviour:
 *   - Both buttons export the FILTERED set (state variable `rows`), not the full
 *     dataset, so a filtered search result downloads exactly what the user sees.
 *   - Filenames include a timestamp so repeated exports don't overwrite each other.
 *   - Column headers in the export use human-readable labels (not JS field names).
 */

import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Lock } from 'lucide-react';
import * as XLSX from 'xlsx';
import PageHeader from '../common/PageHeader';
import '../App.css';
import { useExportReport } from '../hooks/useExportReport';

// ── Static report data ────────────────────────────────────────────────────────
// Each row represents one held order. `id` is a React list key only and is
// excluded from exports via the COLUMNS map below.

const reportRows = [
  {
    id: 1,
    accountNo: 'DLR-001', customer: 'Alpine Equipment Co', order: 'ORD-77321',
    docType: 'C7',
    orderDate: '2025-04-22', shipDate: '2025-04-29', orderAmount: 240000,
    salesRep: 'T. Kim',
    paymentTerms: 'Net 60',
    holdReason: 'Awaiting return posting',
    holdDate: '2025-04-22', nextStatus: 'Pending Review', lastStatus: 'New',
    customOrder: 'No', prepaid: 'No', releaseEligible: 'No',
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
    holdDate: '2025-04-22', nextStatus: 'Pending Review', lastStatus: 'New',
    customOrder: 'Yes', prepaid: 'No', releaseEligible: 'No',
    currentOwner: 'Mike Chen', slaStatus: 'Near Breach',
    notes: 'Pending credit analyst review',
  },
  {
    id: 3,
    accountNo: 'DLR-003', customer: 'SportMax Dealers', order: 'ORD-77390',
    docType: 'RM',
    orderDate: '2025-04-22', shipDate: '2025-05-05', orderAmount: 95000,
    salesRep: 'T. Kim',
    paymentTerms: 'Net 60',
    holdReason: 'Awaiting return posting',
    holdDate: '2025-04-22', nextStatus: 'Pending Release', lastStatus: 'New',
    customOrder: 'No', prepaid: 'No', releaseEligible: 'Yes',
    currentOwner: 'Jane Doe', slaStatus: 'Near Breach',
    notes: 'Return posted — recalculation will release',
  },
  {
    id: 4,
    accountNo: 'DLR-004', customer: 'TrailBlaze Inc', order: 'ORD-94496',
    docType: 'CA',
    orderDate: '2026-05-09', shipDate: '2026-05-18', orderAmount: 171000,
    salesRep: 'J. Lopez',
    paymentTerms: 'Prepaid',
    holdReason: 'Past due > $250K',
    holdDate: '2026-05-09', nextStatus: 'Awaiting Action', lastStatus: 'Reviewed',
    customOrder: 'Yes', prepaid: 'Yes', releaseEligible: 'No',
    currentOwner: 'Jane Doe', slaStatus: 'On Track',
    notes: 'Demo synthetic record',
  },
  {
    id: 5,
    accountNo: 'DLR-005', customer: 'Peak Outdoors', order: 'ORD-94705',
    docType: 'SO',
    orderDate: '2026-05-10', shipDate: '2026-05-20', orderAmount: 130000,
    salesRep: 'J. Lopez',
    paymentTerms: 'Net 45',
    holdReason: 'Utilization > 85%',
    holdDate: '2026-05-10', nextStatus: 'Pending Review', lastStatus: 'New',
    customOrder: 'No', prepaid: 'No', releaseEligible: 'No',
    currentOwner: 'Mike Chen', slaStatus: 'Breached',
    notes: 'Demo synthetic record',
  },
];


// ── Column map ─────────────────────────────────────────────────────────────────
// Maps JS field names → human-readable export headers.
// Fields listed here are the only ones included in CSV / XLSX exports (id is omitted).

const COLUMNS = [
  { key: 'accountNo', label: 'Account #' },
  { key: 'customer', label: 'Customer' },
  { key: 'order', label: 'Order #' },
  { key: 'docType', label: 'Document Type' },
  { key: 'orderDate', label: 'Order Date' },
  { key: 'shipDate', label: 'Requested Ship Date' },
  { key: 'orderAmount', label: 'Order Amount' },
  { key: 'salesRep', label: 'Sales Rep' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'holdReason', label: 'Hold Reason' },
  { key: 'holdDate', label: 'Hold Date' },
  { key: 'nextStatus', label: 'Next Status' },
  { key: 'lastStatus', label: 'Last Status' },
  { key: 'customOrder', label: 'Custom Order' },
  { key: 'prepaid', label: 'Prepaid' },
  { key: 'releaseEligible', label: 'Release Eligible' },
  { key: 'currentOwner', label: 'Current Owner' },
  { key: 'slaStatus', label: 'SLA Status' },
  { key: 'notes', label: 'Notes' },
];




// ── Timestamp shown in the metadata bar ──────────────────────────────────────
// Computed once at module load so it doesn't change on re-renders.

const GENERATED = new Date().toLocaleString('en-GB', {
  day: 'numeric', month: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
});

// ── Sub-components ────────────────────────────────────────────────────────────

// Renders an SLA status label. Kept as a component so it's easy to add colour
// coding here later without touching the table markup.
function SlaBadge({ status }) {
  return <span>{status}</span>;
}

// Renders a Yes/No boolean cell. Extracted so we can add icons or colours later.
function BoolCell({ val }) {
  return <span>{val}</span>;
}

// ── Page component ────────────────────────────────────────────────────────────

const PAGE_SIZE = 2;

export default function CreditHoldReport() {
  const [filter, setFilter] = useState('');
  const [page,   setPage]   = useState(1);

  const { exportReport } = useExportReport({
    reportRows,
    columns: COLUMNS,
    fileName: 'credit_hold_report',
    sheetName: 'Credit Hold Report',
  });

  function handleFilterChange(value) {
    setFilter(value);
    setPage(1);
  }

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

  const totalPages    = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function formatCellValue(row, key) {
    const value = row[key];

    if (key === 'orderAmount') {
      return value.toLocaleString();
    }

    if (key === 'slaStatus') {
      return <SlaBadge status={value} />;
    }

    if (['customOrder', 'prepaid', 'releaseEligible'].includes(key)) {
      return <BoolCell val={value} />;
    }

    return value;
  }

  return (
    <div className="dashboard">

      {/* ── Page header: [icon] [title + desc] [CSV XLSX] in one horizontal row ── */}
      <header className="chr-page-header">
        <div className="chr-header-icon" aria-hidden="true">
          <FileText size={18} color="#3b82f6" />
        </div>

        <div className="chr-header-content">
          <h1 className="chr-title">Credit Hold Report</h1>
          <p className="chr-subtitle">
            Daily hold reporting — supports continuity with the legacy Excel report.
          </p>
        </div>

        {/* Buttons as a separate flex item — horizontally aligned with icon and text */}
        <div className="chr-export-btns">
          <button
            onClick={() => exportReport('csv')}
            className="chr-btn-csv"
            disabled={rows.length === 0}
            aria-label="Export as CSV"
          >
            <FileText size={13} aria-hidden="true" /> CSV
          </button>
          <button
            onClick={() => exportReport('xlsx')}
            className="chr-btn-xlsx"
            disabled={rows.length === 0}
            aria-label="Export as XLSX"
          >
            <Download size={13} aria-hidden="true" /> XLSX
          </button>
        </div>
      </header>

      {/* ── Metadata bar ────────────────────────────────────────────────── */}
      {/* Shows generation time, author, and live row count (updates with filter) */}
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

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      {/* Searches across customer, account, order, hold reason, rep, owner, notes */}
      <div className="chr-filter-container">
  
      <div className="chr-filter-wrap">
        <Filter size={14} color="#94a3b8" />
        <input
          className="chr-filter-input"
          placeholder="Filter by customer, order, sales rep, reason..."
          value={filter}
          onChange={e => handleFilterChange(e.target.value)}
        />
      </div>
      </div>
      {/* ── Report table ─────────────────────────────────────────────────── */}
      <div className="card chr-table-card">
        <div className="chr-preview-label">Report preview</div>
        <div className="chr-table-wrap chr-table-scroll">
          <table className="chr-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => {
                  return <th key={col.key} className="chr-th">{col.label}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map(r => (
                <tr key={r.id} className="chr-tr">
                  {COLUMNS.map(col => (
                    <td key={col.key} className={`chr-td ${col.className || ''}`}>
                      {formatCellValue(r, col.key)}
                    </td>
                  ))}
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

        {/* ── Pagination bar ── */}
        <div className="chr-pagination">
          <span className="chr-page-info">
            {rows.length === 0 ? '0 rows' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, rows.length)} of ${rows.length} rows`}
          </span>
          <div className="chr-page-btns">
            <button
              className="chr-page-btn"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="First page"
            >«</button>
            <button
              className="chr-page-btn"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`chr-page-btn${page === n ? ' chr-page-btn-active' : ''}`}
                onClick={() => setPage(n)}
                aria-label={`Page ${n}`}
                aria-current={page === n ? 'page' : undefined}
              >{n}</button>
            ))}
            <button
              className="chr-page-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >›</button>
            <button
              className="chr-page-btn"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              aria-label="Last page"
            >»</button>
          </div>
        </div>
      </div>

    </div>
  );
}
