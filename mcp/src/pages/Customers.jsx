/**
 * Customers.jsx
 *
 * Customer directory with live search, recently-viewed list, and a results
 * table. On mobile the table is scrollable and shows a reduced column set to
 * match the reference responsive layout.
 *
 * Standards: functional components, PascalCase names, camelCase variables,
 * single-responsibility sub-components, WCAG 2.2 landmarks/labels/contrast.
 */

import React, { useState, useMemo } from 'react';
import { Users, Search, Clock, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { customersBase as customersData } from '../data/customersData';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import Announcement from '../common/Announcement';
import '../App.css';

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CLS = {
  'On Hold':   'cust-status-hold',
  'Watchlist': 'cust-status-watch',
};

function StatusBadge({ status }) {
  return (
    <span className={`cust-status-badge ${STATUS_CLS[status] ?? 'cust-status-active'}`}>
      {status}
    </span>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────────

function CustomerSearch({ value, onChange }) {
  return (
    <div className="cust-search-container">
      <div role="search" className="cust-search-wrap">
        <Search size={16} className="cust-search-icon" aria-hidden="true" />
        <input
          id="customer-search"
          className="cust-search-input"
          type="search"
          placeholder="Search account number (e.g. DLR-001) or customer name…"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="Search customers by account number or name"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

// ── Recently viewed list ──────────────────────────────────────────────────────

function RecentlyViewed({ items }) {
  if (!items.length) return null;

  return (
    <section className="card cust-recent-card" aria-label="Recently viewed customers">
      <div className="cust-recent-header">
        <Clock size={14} color="#94a3b8" aria-hidden="true" />
        <span>Recently viewed</span>
      </div>

      <ul className="cust-recent-list" role="list">
        {items.map(r => (
          <li key={r.accountNo} role="listitem">
            <Link
              to={`/customers/${r.accountNo}`}
              className="cust-recent-item"
              aria-label={`${r.accountNo} — ${r.customer}`}
            >
              <div className="cust-recent-acct">{r.accountNo}</div>
              <div className="cust-recent-name">{r.customer}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Results table ─────────────────────────────────────────────────────────────

function ResultsTable({ results, totalCount, page, totalPages, onPageChange }) {
  return (
    <div className="card cust-table-card">
      <div className="cust-results-label" aria-live="polite" aria-atomic="true">
        Results ({totalCount})
      </div>

      <div className="cust-table-scroll">
        <table className="cust-table" aria-label="Customer directory">
          <caption className="visually-hidden">
            List of customers matching your search
          </caption>
          <thead>
            <tr>
              <th scope="col">Account #</th>
              <th scope="col">Customer</th>
              <th scope="col">Region</th>
              <th scope="col">Status</th>
              <th scope="col">Sales Rep</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={6} className="cust-empty">
                  No customers match your search
                </td>
              </tr>
            ) : (
              results.map(c => (
                <tr key={c.accountNo}>
                  <td>
                    <Link
                      to={`/customers/${c.accountNo}`}
                      className="cust-acct-link"
                      aria-label={`View profile for ${c.accountNo}`}
                    >
                      {c.accountNo}
                    </Link>
                  </td>
                  <td className="cust-td-name">{c.customer}</td>
                  <td className="cust-td-region">{c.region}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="cust-td-rep">{c.salesRep}</td>
                  <td className="cust-td-actions">
                    <button
                      className="cust-action-btn"
                      aria-label={`Bookmark ${c.customer}`}
                    >
                      <Bookmark size={14} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      <div className="chr-pagination">
        <span className="chr-page-info">
          {totalCount === 0
            ? '0 rows'
            : `${(page - 1) * 5 + 1}–${Math.min(page * 5, totalCount)} of ${totalCount} rows`}
        </span>
        <div className="chr-page-btns">
          <button className="chr-page-btn" onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">«</button>
          <button className="chr-page-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`chr-page-btn${page === n ? ' chr-page-btn-active' : ''}`}
              onClick={() => onPageChange(n)}
              aria-label={`Page ${n}`}
              aria-current={page === n ? 'page' : undefined}
            >{n}</button>
          ))}
          <button className="chr-page-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
          <button className="chr-page-btn" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
        </div>
      </div>
    </div>
  );
}

// ── Page header ───────────────────────────────────────────────────────────────

function CustomersHeader() {
  return (
    <header className="cust-page-header">
      <div className="cust-header-text">
        <h1 className="cust-title">Customers</h1>
        <div className="cust-subtitle-row">
          <div className="cust-header-icon" aria-hidden="true">
            <Users size={18} color="#3b82f6" />
          </div>
          <p className="cust-subtitle">
            Quick path: search by account number or name to reach the full
            customer credit profile.
          </p>
        </div>
      </div>
    </header>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

export default function Customers() {
  const [query, setQuery] = useState('');
  const [page,  setPage]  = useState(1);

  const recentlyViewed = useMemo(() => getRecentlyViewed(), []);

  function handleQueryChange(value) {
    setQuery(value);
    setPage(1);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customersData;
    return customersData.filter(
      c =>
        c.accountNo.toLowerCase().includes(q) ||
        c.customer.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages      = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <a href="#customers-main" className="skip-link">
        Skip to customer list
      </a>

      <div className="dashboard" id="customers-main">
        <Announcement />

        <CustomersHeader />

        <CustomerSearch value={query} onChange={handleQueryChange} />

        <RecentlyViewed items={recentlyViewed} />

        <ResultsTable
          results={paginatedResults}
          totalCount={results.length}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
