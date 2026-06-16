import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { KeyRound, ArrowRight } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { heldOrders } from '../data/releaseUnlockData';
import { formatCurrencyShort } from '../utils/formatters'

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

// Columns--------
const COLUMNS = [
  { key: 'orderId', label: 'Order', className: 'reu-order-id' },
  { key: 'dealer', label: 'Dealer', className: 'reu-dealer' },
  { key: 'holdReason', label: 'Hold Reason', className: 'reu-reason' },
  {
    key: 'amount',
    label: 'Unlock',
    thClass: 'reu-th-right',
    className: 'reu-unlock-cell',
    render: row => (
      <>
        <span className="reu-amount">{fmt(row.amount)}</span>
        <Link to={`/release-unlock/${row.orderId}`} className="reu-explore-btn">
          Explore <ArrowRight size={13} />
        </Link>
      </>
    ),
  },
];


const PAGE_SIZE = 5;

export default function ReleaseUnlock() {
  const [page, setPage] = useState(1);

  const totalBlocked = useMemo(() => {
    return heldOrders.reduce((sum, order) => sum + order.amount, 0);
  }, []);

  const totalPages     = Math.max(1, Math.ceil(heldOrders.length / PAGE_SIZE));
  const paginatedOrders = heldOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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
              {COLUMNS.map(col => (
                <th key={col.key} className={`reu-th ${col.thClass || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map(row => (
              <tr key={row.orderId} className="reu-tr">
                {COLUMNS.map(col => (
                  <td key={col.key} className={`reu-td ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination bar */}
        <div className="chr-pagination">
          <span className="chr-page-info">
            {`${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, heldOrders.length)} of ${heldOrders.length} rows`}
          </span>
          <div className="chr-page-btns">
            <button className="chr-page-btn" onClick={() => setPage(1)} disabled={page === 1} aria-label="First page">«</button>
            <button className="chr-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`chr-page-btn${page === n ? ' chr-page-btn-active' : ''}`} onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={page === n ? 'page' : undefined}>{n}</button>
            ))}
            <button className="chr-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
            <button className="chr-page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
          </div>
        </div>
      </div>

    </div>
  );
}
