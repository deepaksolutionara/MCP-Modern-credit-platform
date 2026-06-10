/**
 * Cases.jsx
 *
 * Case directory with live search, status/priority filters, sort pills,
 * and responsive case cards. Mobile layout matches the reference design.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { Briefcase, Search, ChevronDown, ArrowUp } from 'lucide-react';
import Announcement from '../common/Announcement';
import CaseCard from '../components/cases/CaseCard';
import { casesBase as casesData } from '../data/casesData';

// ── Sort options ──────────────────────────────────────────────────────────────

const SORT_OPTIONS = ['SLA remaining', 'Priority', 'Status', 'Dealer', 'Owner', 'Created'];

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function sortCases(cases, sortBy, dir) {
  return [...cases].sort((a, b) => {
    let av, bv;
    switch (sortBy) {
      case 'SLA remaining': av = a.slaHoursLeft;              bv = b.slaHoursLeft;              break;
      case 'Priority':      av = PRIORITY_ORDER[a.priority];  bv = PRIORITY_ORDER[b.priority];  break;
      case 'Status':        av = a.status;                    bv = b.status;                    break;
      case 'Dealer':        av = a.dealer;                    bv = b.dealer;                    break;
      case 'Owner':         av = a.owner;                     bv = b.owner;                     break;
      case 'Created':       av = a.createdAgo;                bv = b.createdAgo;                break;
      default:              return 0;
    }
    if (typeof av === 'number') return dir === 'asc' ? av - bv : bv - av;
    return dir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CasesHeader() {
  return (
    <header className="cases-page-header">
      <h1 className="cases-title">Cases</h1>
      <div className="cases-subtitle-row">
        <div className="cases-header-icon" aria-hidden="true">
          <Briefcase size={18} color="#3b82f6" />
        </div>
        <p className="cases-subtitle">
          All cases with assignment, SLA, and escalation tracking
        </p>
      </div>
    </header>
  );
}

function CasesSearch({ value, onChange }) {
  return (
    <div role="search" className="cases-search cases-search-full">
      <Search size={14} color="#94a3b8" aria-hidden="true" style={{ flexShrink: 0 }} />
      <input
        type="search"
        placeholder="Search by ID, dealer, order, owner..."
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search cases"
      />
    </div>
  );
}

function SelectFilter({ value, options, onChange, ariaLabel }) {
  return (
    <div className="cases-select-wrap">
      <select
        className="cases-select no-arrow"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="cases-select-chevron" aria-hidden="true" />
    </div>
  );
}

function SortBar({ sortBy, sortDir, onToggle }) {
  return (
    <div className="cases-sort-bar" role="group" aria-label="Sort cases">
      <span className="cases-sort-label">SORT BY</span>
      {SORT_OPTIONS.map(opt => (
        <button
          key={opt}
          className={`cases-sort-pill${sortBy === opt ? ' cases-sort-pill-active' : ''}`}
          onClick={() => onToggle(opt)}
          aria-pressed={sortBy === opt}
          aria-label={`Sort by ${opt}${sortBy === opt ? `, ${sortDir === 'asc' ? 'ascending' : 'descending'}` : ''}`}
        >
          {opt}
          {sortBy === opt && (
            <ArrowUp
              size={11}
              aria-hidden="true"
              style={{
                transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Cases() {
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('All statuses');
  const [priority, setPriority] = useState('All priorities');
  const [sortBy,   setSortBy]   = useState('SLA remaining');
  const [sortDir,  setSortDir]  = useState('asc');

  function toggleSort(option) {
    if (sortBy === option) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(option); setSortDir('asc'); }
  }

  const statuses   = ['All statuses',   ...new Set(casesData.map(c => c.status))];
  const priorities = ['All priorities', 'Critical', 'High', 'Medium', 'Low'];

  const filtered = useMemo(() => {
    let rows = casesData;
    if (search)
      rows = rows.filter(c =>
        c.id.toLowerCase().includes(search.toLowerCase())     ||
        c.dealer.toLowerCase().includes(search.toLowerCase()) ||
        c.orderId.toLowerCase().includes(search.toLowerCase())||
        c.owner.toLowerCase().includes(search.toLowerCase())
      );
    if (status   !== 'All statuses')   rows = rows.filter(c => c.status   === status);
    if (priority !== 'All priorities') rows = rows.filter(c => c.priority === priority);
    return sortCases(rows, sortBy, sortDir);
  }, [search, status, priority, sortBy, sortDir]);

  return (
    <>
      <a href="#cases-main" className="skip-link">Skip to case list</a>

      <div className="dashboard" id="cases-main">
        <Announcement />

        <CasesHeader />

        {/* Search bar — full width */}
        <CasesSearch value={search} onChange={setSearch} />

        {/* Filters row — side by side on mobile */}
        <div className="cases-filters-row">
          <SelectFilter
            value={status}
            options={statuses}
            onChange={setStatus}
            ariaLabel="Filter by status"
          />
          <SelectFilter
            value={priority}
            options={priorities}
            onChange={setPriority}
            ariaLabel="Filter by priority"
          />
        </div>

        {/* Sort pills */}
        <SortBar sortBy={sortBy} sortDir={sortDir} onToggle={toggleSort} />

        {/* Case cards */}
        <div
          className="cases-list"
          aria-live="polite"
          aria-label={`${filtered.length} case${filtered.length !== 1 ? 's' : ''}`}
        >
          {filtered.length === 0 ? (
            <div className="card wq-empty">No cases match the current filters</div>
          ) : (
            filtered.map(c => (
              <Link key={c.id} to={`/cases/${c.id}`} className="cd-case-card-link">
                <CaseCard c={c} />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
