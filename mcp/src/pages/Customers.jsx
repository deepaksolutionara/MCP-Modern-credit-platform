import React, { useState, useMemo } from 'react';
import { Users, Search, Bookmark, Clock } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { Link } from 'react-router-dom';
import Announcement from '../common/Announcement';
import { customersBase as customersData } from '../data/customersData';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import '../App.css';

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cls = status === 'On Hold'   ? 'cust-status-hold'
            : status === 'Watchlist' ? 'cust-status-watch'
            : 'cust-status-active';
  return <span className={`cust-status-badge ${cls}`}>{status}</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Customers() {
  const [query, setQuery] = useState('');
  const recentlyViewed = useMemo(() => getRecentlyViewed(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customersData;
    return customersData.filter(
      c => c.accountNo.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="dashboard">
      <Announcement />

      <PageHeader
        icon={<Users size={20} color="#3b82f6" />}
        title="Customers"
        subtitle="Quick path: search by account number or name to reach the full customer credit profile."
      />

      {/* Search */}
      <div className="cust-search-wrap">
        <Search size={16} className="cust-search-icon" />
        <input
          className="cust-search-input"
          type="text"
          placeholder="Search account number (e.g. DLR-001) or customer name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="card cust-recent-card">
          <div className="cust-recent-header">
            <Clock size={14} color="#94a3b8" />
            <span>Recently viewed</span>
          </div>
          <div className="cust-recent-grid">
            {recentlyViewed.map(r => (
              <Link key={r.accountNo} to={`/customers/${r.accountNo}`} className="cust-recent-item">
                <div className="cust-recent-acct">{r.accountNo}</div>
                <div className="cust-recent-name">{r.customer}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results table */}
      <div className="card cust-table-card">
        <div className="cust-results-label">Results ({results.length})</div>
        <table className="cust-table">
          <thead>
            <tr>
              <th>Account #</th>
              <th>Customer</th>
              <th>Region</th>
              <th>Status</th>
              <th>Sales Rep</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={6} className="cust-empty">No customers match your search</td>
              </tr>
            ) : (
              results.map(c => (
                <tr key={c.accountNo}>
                  <td><Link to={`/customers/${c.accountNo}`} className="cust-acct-link">{c.accountNo}</Link></td>
                  <td className="cust-td-name">{c.customer}</td>
                  <td className="cust-td-region">{c.region}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="cust-td-rep">{c.salesRep}</td>
                  <td className="cust-td-actions">
                    <button className="cust-action-btn" title="Bookmark">
                      <Bookmark size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
