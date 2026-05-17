import React, { useState, useMemo } from 'react';
import '../App.css';
import { Briefcase, Search, ChevronDown, ArrowUp } from 'lucide-react';
import Announcement from '../common/Announcement';
import CaseCard from '../components/cases/CaseCard';

// ── Data ──────────────────────────────────────────────────────────────────────

const casesData = [
  { id: 'CASE-2506', orderId: 'ORD-77260', decId: 'DEC-9001', dealer: 'Alpine Equipment Co',    priority: 'Critical', status: 'Escalated',                owner: 'Jane Doe',    team: 'Escalation', slaHoursLeft: -36, slaTotalHours: 96, createdAgo: '374d ago' },
  { id: 'CASE-2504', orderId: 'ORD-77351', decId: 'DEC-9002', dealer: 'ProGear Distribution',   priority: 'Medium',   status: 'Waiting on Dealer',         owner: 'Unassigned',  team: 'Credit Ops', slaHoursLeft: 2,   slaTotalHours: 72, createdAgo: '372d ago' },
  { id: 'CASE-2501', orderId: 'ORD-77321', decId: 'DEC-9001', dealer: 'Alpine Equipment Co',    priority: 'Critical', status: 'Escalated',                owner: 'Jane Doe',    team: 'Escalation', slaHoursLeft: 4,   slaTotalHours: 48, createdAgo: '371d ago' },
  { id: 'CASE-2505', orderId: 'ORD-77298', decId: 'DEC-9005', dealer: 'Peak Outdoors',          priority: 'Low',      status: 'Auto-Released',             owner: 'System',      team: 'Credit Ops', slaHoursLeft: 20,  slaTotalHours: 24, createdAgo: '372d ago' },
  { id: 'CASE-2502', orderId: 'ORD-77342', decId: 'DEC-9002', dealer: 'ProGear Distribution',   priority: 'High',     status: 'In Review',                 owner: 'Mike Chen',   team: 'Credit Ops', slaHoursLeft: 44,  slaTotalHours: 72, createdAgo: '371d ago' },
  { id: 'CASE-2503', orderId: 'ORD-77390', decId: 'DEC-9003', dealer: 'SportMax Dealers',       priority: 'Medium',   status: 'Waiting on Return Update',  owner: 'Jane Doe',    team: 'Credit Ops', slaHoursLeft: 52,  slaTotalHours: 72, createdAgo: '371d ago' },
  { id: 'CASE-2499', orderId: 'ORD-77280', decId: 'DEC-9006', dealer: 'Summit Athletics',       priority: 'Low',      status: 'Open',                      owner: 'R. Torres',   team: 'Credit Ops', slaHoursLeft: 72,  slaTotalHours: 96, createdAgo: '370d ago' },
  { id: 'CASE-2498', orderId: 'ORD-77265', decId: 'DEC-9007', dealer: 'Riverside Sports Co',    priority: 'High',     status: 'Near Breach',               owner: 'M. Patel',    team: 'Credit Ops', slaHoursLeft: 3,   slaTotalHours: 96, createdAgo: '369d ago' },
  { id: 'CASE-2495', orderId: 'ORD-77241', decId: 'DEC-9008', dealer: 'Summit Athletics',       priority: 'Medium',   status: 'Near Breach',               owner: 'S. Chen',     team: 'Credit Ops', slaHoursLeft: 6,   slaTotalHours: 72, createdAgo: '368d ago' },
  { id: 'CASE-2492', orderId: 'ORD-77210', decId: 'DEC-9009', dealer: 'Coastal Athletics',      priority: 'High',     status: 'In Review',                 owner: 'R. Torres',   team: 'Credit Ops', slaHoursLeft: 18,  slaTotalHours: 96, createdAgo: '367d ago' },
  { id: 'CASE-2489', orderId: 'ORD-77190', decId: 'DEC-9010', dealer: 'Nordic Sports Ltd',      priority: 'Critical', status: 'Breached SLA',              owner: 'R. Torres',   team: 'Escalation', slaHoursLeft: -12, slaTotalHours: 96, createdAgo: '365d ago' },
  { id: 'CASE-2477', orderId: 'ORD-77098', decId: 'DEC-9011', dealer: 'Peak Outdoors',          priority: 'Low',      status: 'Closed',                    owner: 'M. Patel',    team: 'Credit Ops', slaHoursLeft: 88,  slaTotalHours: 96, createdAgo: '362d ago' },
];

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

      {/* Header */}
      <div className="wq-page-header">
        <div className="wq-header-icon">
          <Briefcase size={20} color="#3b82f6" />
        </div>
        <div>
          <div className="dash-title">Cases</div>
          <div className="dash-sub">All cases with assignment, SLA, and escalation tracking</div>
        </div>
      </div>

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
          filtered.map(c => <CaseCard key={c.id} c={c} />)
        )}
      </div>

    </div>
  );
}
