import React, { useState, useMemo } from 'react';
import { Timer } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { Link } from 'react-router-dom';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const slaItems = [
  { type: 'Credit Review', id: 'CASE-2501', customer: 'Alpine Equipment Co', owner: 'Jane Doe', due: '48h target', time: '4h left', timeOver: false, severity: 'Near Breach', related: 'ORD-77321', action: 'Escalated', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2504', customer: 'ProGear Distribution', owner: 'Unassigned', due: '72h target', time: '2h left', timeOver: false, severity: 'Near Breach', related: 'ORD-77351', action: 'Waiting on Dealer', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2506', customer: 'Alpine Equipment Co', owner: 'Jane Doe', due: '48h target', time: '+36h over', timeOver: true, severity: 'Breached', related: 'ORD-77260', action: 'Escalated', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2604', customer: 'Scheels All Sports', owner: 'Jane Doe', due: '72h target', time: '+7h over', timeOver: true, severity: 'Near Breach', related: 'ORD-80005', action: 'Waiting on Payment', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2605', customer: 'Scheels All Sports', owner: 'Unassigned', due: '72h target', time: '3h left', timeOver: false, severity: 'Near Breach', related: 'ORD-80006', action: 'In Review', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2607', customer: 'Costco Wholesale Golf', owner: 'Unassigned', due: '72h target', time: '+3h over', timeOver: true, severity: 'Near Breach', related: 'ORD-80009', action: 'In Review', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2608', customer: 'Walmart Golf Division', owner: 'Unassigned', due: '72h target', time: '+3h over', timeOver: true, severity: 'Near Breach', related: 'ORD-80012', action: 'Needs Escalation', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2610', customer: 'Golfsmith Direct', owner: 'Jane Doe', due: '72h target', time: '1h left', timeOver: false, severity: 'Near Breach', related: 'ORD-80015', action: 'In Review', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2611', customer: 'TrailBlaze Inc', owner: 'Unassigned', due: '48h target', time: '+12h over', timeOver: true, severity: 'Breached', related: 'ORD-80018', action: 'Escalated', category: 'credit_review' },
  { type: 'Credit Review', id: 'CASE-2612', customer: 'Peak Outdoors', owner: 'Jane Doe', due: '72h target', time: '5h left', timeOver: false, severity: 'Near Breach', related: 'ORD-80020', action: 'Waiting on Dealer', category: 'credit_review' },
  { type: 'Hold', id: 'ORD-77342', customer: 'ProGear Distribution', owner: 'J. Lopez', due: '24h target', time: '+2h over', timeOver: true, severity: 'Near Breach', related: 'DLR-002', action: 'Needs Release', category: 'hold' },
  { type: 'Hold', id: 'ORD-94705', customer: 'Peak Outdoors', owner: 'J. Lopez', due: '24h target', time: '+8h over', timeOver: true, severity: 'Breached', related: 'DLR-005', action: 'Escalated', category: 'hold' },
  { type: 'Hold', id: 'ORD-77321', customer: 'Alpine Equipment Co', owner: 'T. Kim', due: '24h target', time: '1h left', timeOver: false, severity: 'Near Breach', related: 'DLR-001', action: 'Pending Review', category: 'hold' },
  { type: 'Hold', id: 'ORD-94496', customer: 'TrailBlaze Inc', owner: 'J. Lopez', due: '48h target', time: '6h left', timeOver: false, severity: 'Near Breach', related: 'DLR-004', action: 'Awaiting Payment', category: 'hold' },
  { type: 'Dispute', id: 'DISP-7001', customer: 'Alpine Equipment Co', owner: 'Jane Doe', due: '5d target', time: '+2d over', timeOver: true, severity: 'Breached', related: 'INV-30021', action: 'Escalated', category: 'dispute' },
  { type: 'Dispute', id: 'DISP-7002', customer: 'SportMax Dealers', owner: 'T. Kim', due: '5d target', time: '1d left', timeOver: false, severity: 'Near Breach', related: 'INV-30032', action: 'Waiting on Return', category: 'dispute' },
  { type: 'Dispute', id: 'DISP-7003', customer: 'Alpine Equipment Co', owner: 'Jane Doe', due: '5d target', time: '+1d over', timeOver: true, severity: 'Near Breach', related: 'INV-30019', action: 'In Review', category: 'dispute' },
  { type: 'Dispute', id: 'DISP-7004', customer: 'Golfsmith Direct', owner: 'Unassigned', due: '5d target', time: '3h left', timeOver: false, severity: 'Near Breach', related: 'INV-30040', action: 'Needs Response', category: 'dispute' },
  { type: 'Dispute', id: 'DISP-7005', customer: 'Costco Wholesale Golf', owner: 'Unassigned', due: '5d target', time: '+4h over', timeOver: true, severity: 'Near Breach', related: 'INV-30055', action: 'Waiting on Dealer', category: 'dispute' },
  { type: 'Collections', id: 'CASE-2502', customer: 'Alpine Equipment Co', owner: 'Mike Chen', due: '3d target', time: '+1d over', timeOver: true, severity: 'Breached', related: 'INV-30021', action: 'Escalated', category: 'collections' },
  { type: 'Collections', id: 'CASE-2503', customer: 'SportMax Dealers', owner: 'T. Kim', due: '3d target', time: '4h left', timeOver: false, severity: 'Near Breach', related: 'INV-30032', action: 'In Review', category: 'collections' },
];

const COLUMNS = [
  {
    key: 'type',
    label: 'Type',
    className: 'sla-td-type',
    render: item => <span className="sla-type-badge">{item.type}</span>,
  },
  {
    key: 'id',
    label: 'ID',
    render: item => <Link to="/cases" className="sla-id-link">{item.id}</Link>,
  },
  { key: 'customer', label: 'Customer', className: 'sla-td-customer' },
  {
    key: 'owner',
    label: 'Owner',
    className: item => `sla-td-owner ${item.owner === 'Unassigned' ? 'sla-unassigned' : ''}`,
  },
  { key: 'due', label: 'Due', className: 'sla-td-due' },
  {
    key: 'time',
    label: 'Time',
    render: item => <TimeCell time={item.time} over={item.timeOver} />,
  },
  {
    key: 'severity',
    label: 'Severity',
    render: item => <SeverityBadge severity={item.severity} />,
  },
  { key: 'related', label: 'Related', className: 'sla-td-related' },
  { key: 'action', label: 'Required Action', className: 'sla-td-action' },
];

const FILTER_CONFIG = [
  { key: 'all', label: 'All' },
  { key: 'hold', label: 'Hold' },
  { key: 'dispute', label: 'Dispute' },
  { key: 'collections', label: 'Collections' },
  { key: 'credit_review', label: 'Credit Review' },
  { key: 'jde_exception', label: 'JDE Exception' },
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

  const filterTabs = useMemo(() => {
    return FILTER_CONFIG.map(tab => ({
      ...tab,
      count:
        tab.key === 'all'
          ? slaItems.length
          : slaItems.filter(item => item.category === tab.key).length,
    }));
  }, []);
  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? slaItems
      : slaItems.filter(i => i.category === activeFilter),
    [activeFilter]
  );

  return (
    <div className="dashboard">

      <PageHeader
        icon={<Timer size={20} color="#f59e0b" />}
        iconBg="#fffbeb"
        title="SLA Risk Queue"
        subtitle="All operational objects (holds, disputes, collections, credit reviews, JDE exceptions) at or near SLA breach"
      />
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
              {COLUMNS.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
  {filtered.map(item => (
    <tr key={item.id}>
      {COLUMNS.map(col => {
        const className =
          typeof col.className === 'function'
            ? col.className(item)
            : col.className || '';

        return (
          <td key={col.key} className={className}>
            {col.render ? col.render(item) : item[col.key]}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}
