import React, { useState, useMemo } from 'react';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const slaItems = [
  { type: 'Credit Review', id: 'CASE-2501', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',   due: '48h target', time: '4h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-77321', action: 'Escalated',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2504', customer: 'ProGear Distribution',   owner: 'Unassigned', due: '72h target', time: '2h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-77351', action: 'Waiting on Dealer',   category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2506', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',   due: '48h target', time: '+36h over', timeOver: true,  severity: 'Breached',    related: 'ORD-77260', action: 'Escalated',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2604', customer: 'Scheels All Sports',     owner: 'Jane Doe',   due: '72h target', time: '+7h over',  timeOver: true,  severity: 'Near Breach', related: 'ORD-80005', action: 'Waiting on Payment', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2605', customer: 'Scheels All Sports',     owner: 'Unassigned', due: '72h target', time: '3h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-80006', action: 'In Review',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2607', customer: 'Costco Wholesale Golf',  owner: 'Unassigned', due: '72h target', time: '+3h over',  timeOver: true,  severity: 'Near Breach', related: 'ORD-80009', action: 'In Review',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2608', customer: 'Walmart Golf Division',  owner: 'Unassigned', due: '72h target', time: '+3h over',  timeOver: true,  severity: 'Near Breach', related: 'ORD-80012', action: 'Needs Escalation',   category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2610', customer: 'Golfsmith Direct',       owner: 'Jane Doe',   due: '72h target', time: '1h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-80015', action: 'In Review',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2611', customer: 'TrailBlaze Inc',         owner: 'Unassigned', due: '48h target', time: '+12h over', timeOver: true,  severity: 'Breached',    related: 'ORD-80018', action: 'Escalated',          category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2612', customer: 'Peak Outdoors',          owner: 'Jane Doe',   due: '72h target', time: '5h left',   timeOver: false, severity: 'Near Breach', related: 'ORD-80020', action: 'Waiting on Dealer',  category: 'credit_review' },
  { type: 'Hold',          id: 'ORD-77342', customer: 'ProGear Distribution',   owner: 'J. Lopez',   due: '24h target', time: '+2h over',  timeOver: true,  severity: 'Near Breach', related: 'DLR-002',   action: 'Needs Release',     category: 'hold'          },
  { type: 'Hold',          id: 'ORD-94705', customer: 'Peak Outdoors',          owner: 'J. Lopez',   due: '24h target', time: '+8h over',  timeOver: true,  severity: 'Breached',    related: 'DLR-005',   action: 'Escalated',         category: 'hold'          },
  { type: 'Hold',          id: 'ORD-77321', customer: 'Alpine Equipment Co',    owner: 'T. Kim',     due: '24h target', time: '1h left',   timeOver: false, severity: 'Near Breach', related: 'DLR-001',   action: 'Pending Review',    category: 'hold'          },
  { type: 'Hold',          id: 'ORD-94496', customer: 'TrailBlaze Inc',         owner: 'J. Lopez',   due: '48h target', time: '6h left',   timeOver: false, severity: 'Near Breach', related: 'DLR-004',   action: 'Awaiting Payment',  category: 'hold'          },
  { type: 'Dispute',       id: 'DISP-7001', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',   due: '5d target',  time: '+2d over',  timeOver: true,  severity: 'Breached',    related: 'INV-30021', action: 'Escalated',         category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7002', customer: 'SportMax Dealers',       owner: 'T. Kim',     due: '5d target',  time: '1d left',   timeOver: false, severity: 'Near Breach', related: 'INV-30032', action: 'Waiting on Return', category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7003', customer: 'Alpine Equipment Co',    owner: 'Jane Doe',   due: '5d target',  time: '+1d over',  timeOver: true,  severity: 'Near Breach', related: 'INV-30019', action: 'In Review',         category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7004', customer: 'Golfsmith Direct',       owner: 'Unassigned', due: '5d target',  time: '3h left',   timeOver: false, severity: 'Near Breach', related: 'INV-30040', action: 'Needs Response',    category: 'dispute'       },
  { type: 'Dispute',       id: 'DISP-7005', customer: 'Costco Wholesale Golf',  owner: 'Unassigned', due: '5d target',  time: '+4h over',  timeOver: true,  severity: 'Near Breach', related: 'INV-30055', action: 'Waiting on Dealer', category: 'dispute'       },
  { type: 'Collections',   id: 'CASE-2502', customer: 'Alpine Equipment Co',    owner: 'Mike Chen',  due: '3d target',  time: '+1d over',  timeOver: true,  severity: 'Breached',    related: 'INV-30021', action: 'Escalated',         category: 'collections'   },
  { type: 'Collections',   id: 'CASE-2503', customer: 'SportMax Dealers',       owner: 'T. Kim',     due: '3d target',  time: '4h left',   timeOver: false, severity: 'Near Breach', related: 'INV-30032', action: 'In Review',         category: 'collections'   },
];

const filterTabs = [
  { key: 'all',           label: 'All',           count: slaItems.length },
  { key: 'hold',          label: 'Hold',          count: slaItems.filter(i => i.category === 'hold').length },
  { key: 'dispute',       label: 'Dispute',       count: slaItems.filter(i => i.category === 'dispute').length },
  { key: 'collections',   label: 'Collections',   count: slaItems.filter(i => i.category === 'collections').length },
  { key: 'credit_review', label: 'Credit Review', count: slaItems.filter(i => i.category === 'credit_review').length },
  { key: 'jde_exception', label: 'JDE Exception', count: 0 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SeverityBadge({ severity }) {
  const cls = severity === 'Breached' ? 'sla-badge-breached' : 'sla-badge-near';
  return <span className={`sla-severity-badge ${cls}`}>{severity}</span>;
}

function TimeCell({ time, over }) {
  return <span className={over ? 'sla-time-over' : 'sla-time-left'}>{time}</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SLARiskQueue() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? slaItems
      : slaItems.filter(i => i.category === activeFilter),
    [activeFilter]
  );

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="sla-page-header">
        <div className="sla-header-icon">
          <Timer size={20} color="#f59e0b" />
        </div>
        <div>
          <div className="dash-title">SLA Risk Queue</div>
          <div className="dash-sub">
            All operational objects (holds, disputes, collections, credit reviews, JDE exceptions) at or near SLA breach
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sla-filter-tabs">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            className={`sla-filter-tab ${activeFilter === tab.key ? 'sla-filter-tab-active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
            <span className="sla-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="card sla-table-card">
        <div className="sla-results-label">{filtered.length} object(s) at SLA risk</div>
        <table className="sla-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>ID</th>
              <th>Customer</th>
              <th>Owner</th>
              <th>Due</th>
              <th>Time</th>
              <th>Severity</th>
              <th>Related</th>
              <th>Required Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i}>
                <td className="sla-td-type"><span className="sla-type-badge">{item.type}</span></td>
                <td><Link to="#" className="sla-id-link">{item.id}</Link></td>
                <td className="sla-td-customer">{item.customer}</td>
                <td className={`sla-td-owner ${item.owner === 'Unassigned' ? 'sla-unassigned' : ''}`}>{item.owner}</td>
                <td className="sla-td-due">{item.due}</td>
                <td><TimeCell time={item.time} over={item.timeOver} /></td>
                <td><SeverityBadge severity={item.severity} /></td>
                <td className="sla-td-related">{item.related}</td>
                <td className="sla-td-action">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
