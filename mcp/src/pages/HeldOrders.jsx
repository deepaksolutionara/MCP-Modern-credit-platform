import React, { useState, useMemo } from 'react';
import { Package, Download } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { Link, useSearchParams } from 'react-router-dom';
import Announcement from '../common/Announcement';
import '../App.css';

// ── Filter tabs ───────────────────────────────────────────────────────────────

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'prepaid', label: 'Release Prepaid ASAP' },
  { key: 'custom_orders', label: 'Custom Orders' },
  { key: 'repair', label: 'Repair Urgency' },
  { key: 'near_breach', label: 'Near SLA Breach' },
  { key: 'high_value', label: 'High Value Holds' },
  { key: 'reviewed_held', label: 'Reviewed but Still Held' },
];

// ── Sort options ──────────────────────────────────────────────────────────────

const sortOptions = [
  { key: 'priority', label: 'priority' },
  { key: 'amount', label: 'amount' },
  { key: 'sla', label: 'sla' },
  { key: 'ship', label: 'ship' },
  { key: 'customer', label: 'customer' },
  { key: 'salesRep', label: 'sales rep' },
  { key: 'docType', label: 'docType' },
];

// --Columns --------

const COLUMNS = [
  {
    key: 'customTag',
    label: 'Custom',
    render: order => <CustomTag tag={order.customTag} />,
  },
  { key: 'salesRep', label: 'Sales Rep', className: 'ho-td-salesrep' },
  {
    key: 'accountNo',
    label: 'Account #',
    render: order => (
      <Link to={`/customers/${order.accountNo}`} className="ho-order-link">
        {order.accountNo}
      </Link>
    ),
  },
  { key: 'customer', label: 'Customer', className: 'ho-td-customer' },
  {
    key: 'id',
    label: 'Order',
    render: order => (
      <Link to={`/held-orders?order=${order.id}`} className="ho-order-link">
        {order.id}
      </Link>
    ),
  },
  { key: 'docType', label: 'Doc Type', className: 'ho-td-meta' },
  { key: 'paymentTerms', label: 'Payment Terms', className: 'ho-td-meta' },
  { key: 'orderValue', label: 'Order Value', className: 'ho-td-value' },
  { key: 'reqShip', label: 'Req. Ship', className: 'ho-td-meta' },
  { key: 'holdReason', label: 'Hold Reason', className: 'ho-td-reason' },
  { key: 'lifecycle', label: 'Lifecycle', className: 'ho-td-lifecycle' },
  {
    key: 'sla',
    label: 'SLA',
    render: order => <SlaPill sla={order.sla} />,
  },
  { key: 'priority', label: 'Priority', className: 'ho-td-priority' },
  { key: 'nextStatus', label: 'Next Status', className: 'ho-td-next' },
];

// ── Order data ────────────────────────────────────────────────────────────────

const SLA_ORDER = { Breached: 0, 'Near Breach': 1, 'On Track': 2 };

const ordersData = [
  {
    id: 'ORD-77342',
    customTag: 'CUSTOM',
    salesRep: 'J. Lopez',
    accountNo: 'DLR-002',
    customer: 'ProGear Distribution',
    docType: 'SO',
    paymentTerms: 'Net 45',
    orderValue: '$180K',
    orderValueRaw: 180000,
    reqShip: '2025-05-06',
    holdReason: 'Manual hold by credit',
    lifecycle: 'Pending Credit Review',
    sla: 'Near Breach',
    priority: 62,
    nextStatus: 'Pending Review',
    tags: ['custom_orders', 'near_breach', 'high_value', 'reviewed_held'],
  },
  {
    id: 'ORD-94705',
    customTag: '',
    salesRep: 'J. Lopez',
    accountNo: 'DLR-005',
    customer: 'Peak Outdoors',
    docType: 'SO',
    paymentTerms: 'Net 45',
    orderValue: '$130K',
    orderValueRaw: 130000,
    reqShip: '2026-05-15',
    holdReason: 'Utilization > 85%',
    lifecycle: 'Pending Credit Review',
    sla: 'Breached',
    priority: 55,
    nextStatus: 'Pending Review',
    tags: ['high_value', 'reviewed_held'],
  },
  {
    id: 'ORD-77321',
    customTag: '',
    salesRep: 'T. Kim',
    accountNo: 'DLR-001',
    customer: 'Alpine Equipment Co',
    docType: 'C7',
    paymentTerms: 'Net 60',
    orderValue: '$240K',
    orderValueRaw: 240000,
    reqShip: '2025-04-29',
    holdReason: 'Awaiting return posting',
    lifecycle: 'Pending Credit Review',
    sla: 'Near Breach',
    priority: 50,
    nextStatus: 'Pending Review',
    tags: ['near_breach', 'high_value', 'reviewed_held'],
  },
  {
    id: 'ORD-94496',
    customTag: 'CUSTOM PREPAID',
    salesRep: 'J. Lopez',
    accountNo: 'DLR-004',
    customer: 'TrailBlaze Inc',
    docType: 'CA',
    paymentTerms: 'Prepaid',
    orderValue: '$171K',
    orderValueRaw: 171000,
    reqShip: '2026-05-13',
    holdReason: 'Past due > $250K',
    lifecycle: 'Awaiting Payment',
    sla: 'On Track',
    priority: 43,
    nextStatus: 'Awaiting Action',
    tags: ['prepaid', 'custom_orders', 'high_value'],
  },
  {
    id: 'ORD-77390',
    customTag: '',
    salesRep: 'T. Kim',
    accountNo: 'DLR-003',
    customer: 'SportMax Dealers',
    docType: 'RM',
    paymentTerms: 'Net 60',
    orderValue: '$95K',
    orderValueRaw: 95000,
    reqShip: '2025-05-05',
    holdReason: 'Awaiting return posting',
    lifecycle: 'Pending Credit Review',
    sla: 'Near Breach',
    priority: 40,
    nextStatus: 'Pending Release',
    tags: ['repair', 'near_breach', 'reviewed_held'],
  },
];

const SORT_GETTERS = {
  priority: order => order.priority,
  amount: order => order.orderValueRaw,
  sla: order => SLA_ORDER[order.sla],
  ship: order => order.reqShip,
  customer: order => order.customer,
  salesRep: order => order.salesRep,
  docType: order => order.docType,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function SlaPill({ sla }) {
  const cls = sla === 'Breached' ? 'ho-sla-breached'
    : sla === 'Near Breach' ? 'ho-sla-near'
      : 'ho-sla-ok';
  return <span className={`ho-sla-pill ${cls}`}>{sla}</span>;
}

function CustomTag({ tag }) {
  if (!tag) return null;
  const isPrepaid = tag === 'CUSTOM PREPAID';
  return (
    <span className={`ho-custom-tag ${isPrepaid ? 'ho-custom-prepaid' : ''}`}>
      {isPrepaid ? <><span>CUSTOM</span><br /><span>PREPAID</span></> : tag}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HeldOrders() {
  const [searchParams] = useSearchParams();
  const dealer = searchParams.get('dealer');
  const focusOrder = searchParams.get('order');

  const [activeFilter, setActiveFilter] = useState('all');
  const [sortKey, setSortKey] = useState('priority');

 const filtered = useMemo(() => {
  const base =
    activeFilter === 'all'
      ? ordersData
      : ordersData.filter(order => order.tags.includes(activeFilter));

  const getValue = SORT_GETTERS[sortKey];

  return [...base].sort((a, b) => {
    const av = getValue(a);
    const bv = getValue(b);

    if (typeof av === 'number') return bv - av;

    return String(av).localeCompare(String(bv));
  });
}, [activeFilter, sortKey]);

  const filterTabsWithCount = useMemo(() => {
    return filterTabs.map(tab => ({
      ...tab,
      count:
        tab.key === 'all'
          ? ordersData.length
          : ordersData.filter(order => order.tags.includes(tab.key)).length,
    }));
  }, []);

  return (
    <div className="dashboard">

      <PageHeader
        icon={<Package size={20} color="#3b82f6" />}
        title="Held Orders"
        subtitle="Prioritized held-order queue with sales rep, document type, payment terms, and lifecycle status."
        actions={<button className="ho-report-btn"><Download size={14} /> Credit Hold Report</button>}
      />

      {/* Filter tabs */}
      <div className="ho-filter-tabs">
        {filterTabsWithCount.map(tab => (
          <button
            key={tab.key}
            className={`ho-filter-tab ${activeFilter === tab.key ? 'ho-filter-tab-active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
            <span className="ho-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Sort bar */}
      <div className="ho-sort-bar">
        <span className="ho-sort-label">Sort by:</span>
        {sortOptions.map(opt => (
          <button
            key={opt.key}
            className={`ho-sort-pill ${sortKey === opt.key ? 'ho-sort-pill-active' : ''}`}
            onClick={() => setSortKey(opt.key)}
          >
            {opt.label}
          </button>
        ))}
        <span className="ho-order-count">{filtered.length} held orders</span>
      </div>

      {/* Table */}
      <div className="card ho-table-card">
        <div className="ho-table-wrap">
          <table className="ho-table">
           <thead>
  <tr>
    {COLUMNS.map(col => (
      <th key={col.key}>{col.label}</th>
    ))}
  </tr>
</thead>

<tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan={COLUMNS.length} className="ho-empty-row">
        No held orders in this category
      </td>
    </tr>
  ) : (
    filtered.map(order => (
      <tr
        key={order.id}
        className={
          focusOrder === order.id
            ? 'ho-row-focus'
            : dealer && order.accountNo === dealer
              ? 'ho-row-highlight'
              : ''
        }
      >
        {COLUMNS.map(col => (
          <td key={col.key} className={col.className || ''}>
            {col.render ? col.render(order) : order[col.key]}
          </td>
        ))}
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
