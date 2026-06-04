import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { Briefcase, Search, ChevronDown, ArrowUp } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import Announcement from '../common/Announcement';
import CaseCard from '../components/cases/CaseCard';
import { casesBase as casesData } from '../data/casesData';

// ── Sort config ───────────────────────────────────────────────────────────────

const SORT_OPTIONS = ['SLA remaining', 'Priority', 'Status', 'Dealer', 'Owner', 'Created'];

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function sortCases(cases, sortBy, dir) {
  return [...cases].sort((a, b) => {
    let av, bv;
    switch (sortBy) {
      case 'SLA remaining': av = a.slaHoursLeft;          bv = b.slaHoursLeft;          break;
      case 'Priority':      av = PRIORITY_ORDER[a.priority]; bv = PRIORITY_ORDER[b.priority]; break;
      case 'Status':        av = a.status;                 bv = b.status;                break;
      case 'Dealer':        av = a.dealer;                 bv = b.dealer;                break;
      case 'Owner':         av = a.owner;                  bv = b.owner;                 break;
      case 'Created':       av = a.createdAgo;             bv = b.createdAgo;            break;
      default:              return 0;
    }
    if (typeof av === 'number') return dir === 'asc' ? av - bv : bv - av;
    return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

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

  const filtered = useMemo(() => {
    let rows = casesData;
    const q = search.trim().toLowerCase();
    if (search)
      rows = rows.filter(c =>
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.dealer.toLowerCase().includes(search.toLowerCase()) ||
        c.orderId.toLowerCase().includes(search.toLowerCase()) ||
        c.owner.toLowerCase().includes(search.toLowerCase())
      );
    if (status   !== 'All statuses')   rows = rows.filter(c => c.status   === status);
    if (priority !== 'All priorities') rows = rows.filter(c => c.priority === priority);
    return sortCases(rows, sortBy, sortDir);
  }, [search, status, priority, sortBy, sortDir]);

  const statuses   = ['All statuses',   ...new Set(casesData.map(c => c.status))];
  const priorities = ['All priorities', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <div className="dashboard">

      <Announcement />

      <PageHeader
        icon={<Briefcase size={20} color="#3b82f6" />}
        title="Cases"
        subtitle="All cases with assignment, SLA, and escalation tracking"
      />

      {/* Search + filter row */}
      <div className="cases-top-bar">
        <div className="cases-search">
          <Search size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by ID, dealer, order, owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="cases-select-wrap">
          <select className="cases-select no-arrow" value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="cases-select-chevron" />
        </div>

        <div className="cases-select-wrap">
          <select className="cases-select no-arrow" value={priority} onChange={e => setPriority(e.target.value)}>
            {priorities.map(p => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown size={13} className="cases-select-chevron" />
        </div>
      </div>

      {/* Sort pills */}
      <div className="cases-sort-bar">
        <span className="cases-sort-label">SORT BY</span>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt}
            className={`cases-sort-pill ${sortBy === opt ? 'cases-sort-pill-active' : ''}`}
            onClick={() => toggleSort(opt)}
          >
            {opt}
            {sortBy === opt && (
              <ArrowUp
                size={11}
                style={{ transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Case cards */}
      <div className="cases-list">
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
  );
}
