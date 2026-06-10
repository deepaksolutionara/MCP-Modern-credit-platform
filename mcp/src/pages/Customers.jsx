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
// Always renders all 6 columns. The .cust-table-scroll wrapper provides
// horizontal scroll on narrow screens so no columns are ever hidden or removed.

function ResultsTable({ results }) {
  return (
    <div className="card cust-table-card">
      {/* aria-live announces result count to screen readers as the user types */}
      <div className="cust-results-label" aria-live="polite" aria-atomic="true">
        Results ({results.length})
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

export default function Customers() {
  const [query, setQuery] = useState('');

  // Computed once per mount — recent items don't change during a session
  const recentlyViewed = useMemo(() => getRecentlyViewed(), []);

  // Filter customers as the user types — runs only when query changes
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customersData;
    return customersData.filter(
      c =>
        c.accountNo.toLowerCase().includes(q) ||
        c.customer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      {/* WCAG 2.4.1 — skip link */}
      <a href="#customers-main" className="skip-link">
        Skip to customer list
      </a>

      <div className="dashboard" id="customers-main">
        <Announcement />

        <CustomersHeader />

        <CustomerSearch value={query} onChange={setQuery} />

        <RecentlyViewed items={recentlyViewed} />

        <ResultsTable results={results} />
      </div>
    </>
  );
}
