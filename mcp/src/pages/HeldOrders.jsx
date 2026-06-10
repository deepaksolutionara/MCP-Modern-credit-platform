/**
 * HeldOrders.jsx
 *
 * Prioritised held-order queue with category filters, sort bar, and a
 * full-width scrollable table.
 *
 * Mobile layout matches the reference: responsive header, wrapping filter
 * pills, wrapping sort pills, horizontally-scrollable table.
 *
 * WCAG 2.2: h1 heading, aria-labels, aria-pressed on sort pills,
 *           skip link to table, focusable table cells.
 */

import React, { useState, useMemo } from 'react';
import { Package, Download } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Announcement from '../common/Announcement';
import '../App.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: 'all',           label: 'All'                    },
  { key: 'prepaid',       label: 'Release Prepaid ASAP'   },
  { key: 'custom_orders', label: 'Custom Orders'          },
  { key: 'repair',        label: 'Repair Urgency'         },
  { key: 'near_breach',   label: 'Near SLA Breach'        },
  { key: 'high_value',    label: 'High Value Holds'       },
  { key: 'reviewed_held', label: 'Reviewed but Still Held'},
];

const SORT_OPTIONS = [
  { key: 'priority', label: 'priority'  },
  { key: 'amount',   label: 'amount'    },
  { key: 'sla',      label: 'sla'       },
  { key: 'ship',     label: 'ship'      },
  { key: 'customer', label: 'customer'  },
  { key: 'salesRep', label: 'sales rep' },
  { key: 'docType',  label: 'docType'   },
];

const COLUMNS = [
  { key: 'customTag',    label: 'Custom',        render: o => <CustomTag tag={o.customTag} />                                      },
  { key: 'salesRep',     label: 'Sales Rep',     className: 'ho-td-salesrep'                                                       },
  { key: 'accountNo',    label: 'Account #',     render: o => <Link to={`/customers/${o.accountNo}`} className="ho-order-link">{o.accountNo}</Link> },
  { key: 'customer',     label: 'Customer',      className: 'ho-td-customer'                                                       },
  { key: 'id',           label: 'Order',         render: o => <Link to={`/held-orders?order=${o.id}`} className="ho-order-link">{o.id}</Link>       },
  { key: 'docType',      label: 'Doc Type',      className: 'ho-td-meta'                                                           },
  { key: 'paymentTerms', label: 'Payment Terms', className: 'ho-td-meta'                                                           },
  { key: 'orderValue',   label: 'Order Value',   className: 'ho-td-value'                                                          },
  { key: 'reqShip',      label: 'Req. Ship',     className: 'ho-td-meta'                                                           },
  { key: 'holdReason',   label: 'Hold Reason',   className: 'ho-td-reason'                                                         },
  { key: 'lifecycle',    label: 'Lifecycle',     className: 'ho-td-lifecycle'                                                      },
  { key: 'sla',          label: 'SLA',           render: o => <SlaPill sla={o.sla} />                                              },
  { key: 'priority',     label: 'Priority',      className: 'ho-td-priority'                                                       },
  { key: 'nextStatus',   label: 'Next Status',   className: 'ho-td-next'                                                           },
];

const SLA_ORDER      = { Breached: 0, 'Near Breach': 1, 'On Track': 2 };

const SORT_GETTERS = {
  priority: o => o.priority,
  amount:   o => o.orderValueRaw,
  sla:      o => SLA_ORDER[o.sla],
  ship:     o => o.reqShip,
  customer: o => o.customer,
  salesRep: o => o.salesRep,
  docType:  o => o.docType,
};

const ordersData = [
  { id: 'ORD-77342', customTag: 'CUSTOM',        salesRep: 'J. Lopez', accountNo: 'DLR-002', customer: 'ProGear Distribution', docType: 'SO', paymentTerms: 'Net 45', orderValue: '$180K', orderValueRaw: 180000, reqShip: '2025-05-06', holdReason: 'Manual hold by credit',    lifecycle: 'Pending Credit Review', sla: 'Near Breach', priority: 62, nextStatus: 'Pending Review',   tags: ['custom_orders','near_breach','high_value','reviewed_held'] },
  { id: 'ORD-94705', customTag: '',              salesRep: 'J. Lopez', accountNo: 'DLR-005', customer: 'Peak Outdoors',        docType: 'SO', paymentTerms: 'Net 45', orderValue: '$130K', orderValueRaw: 130000, reqShip: '2026-05-15', holdReason: 'Utilization > 85%',        lifecycle: 'Pending Credit Review', sla: 'Breached',    priority: 55, nextStatus: 'Pending Review',   tags: ['high_value','reviewed_held'] },
  { id: 'ORD-77321', customTag: '',              salesRep: 'T. Kim',   accountNo: 'DLR-001', customer: 'Alpine Equipment Co',  docType: 'C7', paymentTerms: 'Net 60', orderValue: '$240K', orderValueRaw: 240000, reqShip: '2025-04-29', holdReason: 'Awaiting return posting', lifecycle: 'Pending Credit Review', sla: 'Near Breach', priority: 50, nextStatus: 'Pending Review',   tags: ['near_breach','high_value','reviewed_held'] },
  { id: 'ORD-94496', customTag: 'CUSTOM PREPAID',salesRep: 'J. Lopez', accountNo: 'DLR-004', customer: 'TrailBlaze Inc',       docType: 'CA', paymentTerms: 'Prepaid', orderValue: '$171K', orderValueRaw: 171000, reqShip: '2026-05-13', holdReason: 'Past due > $250K',        lifecycle: 'Awaiting Payment',      sla: 'On Track',    priority: 43, nextStatus: 'Awaiting Action', tags: ['prepaid','custom_orders','high_value'] },
  { id: 'ORD-77390', customTag: '',              salesRep: 'T. Kim',   accountNo: 'DLR-003', customer: 'SportMax Dealers',     docType: 'RM', paymentTerms: 'Net 60', orderValue: '$95K',  orderValueRaw: 95000,  reqShip: '2025-05-05', holdReason: 'Awaiting return posting', lifecycle: 'Pending Credit Review', sla: 'Near Breach', priority: 40, nextStatus: 'Pending Release', tags: ['repair','near_breach','reviewed_held'] },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SlaPill({ sla }) {
  const cls = sla === 'Breached' ? 'ho-sla-breached'
    : sla === 'Near Breach'      ? 'ho-sla-near'
    : 'ho-sla-ok';
  return <span className={`ho-sla-pill ${cls}`}>{sla}</span>;
}

function CustomTag({ tag }) {
  if (!tag) return null;
  const isPrepaid = tag === 'CUSTOM PREPAID';
  return (
    <span className={`ho-custom-tag${isPrepaid ? ' ho-custom-prepaid' : ''}`}>
      {isPrepaid ? <><span>CUSTOM</span><br /><span>PREPAID</span></> : tag}
    </span>
  );
}

function HeldOrdersHeader() {
  return (
    <header className="ho-page-header">
      <h1 className="ho-title">Held Orders</h1>
      <div className="ho-subtitle-row">
        <div className="ho-header-icon" aria-hidden="true">
          <Package size={18} color="#3b82f6" />
        </div>
        <div>
          <p className="ho-subtitle">
            Prioritized held-order queue with sales rep, document type, payment
            terms, and lifecycle status. Tooltip-equivalent context: tile
            drilldowns and the queue both show the same dataset.
          </p>
          <Link to="/credit-hold-report" className="ho-report-link">
            <Download size={13} aria-hidden="true" />
            Credit Hold Report
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HeldOrders() {
  const [searchParams] = useSearchParams();
  const dealer     = searchParams.get('dealer');
  const focusOrder = searchParams.get('order');

  const [activeFilter, setActiveFilter] = useState('all');
  const [sortKey,      setSortKey]      = useState('priority');

  const filterTabsWithCount = useMemo(() =>
    FILTER_TABS.map(tab => ({
      ...tab,
      count: tab.key === 'all'
        ? ordersData.length
        : ordersData.filter(o => o.tags.includes(tab.key)).length,
    })),
  []);

  const filtered = useMemo(() => {
    const base = activeFilter === 'all'
      ? ordersData
      : ordersData.filter(o => o.tags.includes(activeFilter));

    const getValue = SORT_GETTERS[sortKey];
    return [...base].sort((a, b) => {
      const av = getValue(a), bv = getValue(b);
      return typeof av === 'number' ? bv - av : String(av).localeCompare(String(bv));
    });
  }, [activeFilter, sortKey]);

  return (
    <>
      <a href="#ho-table" className="skip-link">Skip to held orders table</a>

      <div className="dashboard">
        <Announcement />

        <HeldOrdersHeader />

        {/* ── Category filter pills ── */}
        <div className="ho-filter-tabs" role="group" aria-label="Filter held orders by category">
          {filterTabsWithCount.map(tab => (
            <button
              key={tab.key}
              className={`ho-filter-tab${activeFilter === tab.key ? ' ho-filter-tab-active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
              aria-pressed={activeFilter === tab.key}
            >
              {tab.label}
              <span className="ho-tab-count" aria-label={`${tab.count} orders`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── Sort bar ── */}
        <div className="ho-sort-bar" role="group" aria-label="Sort held orders">
          <span className="ho-sort-label">Sort by:</span>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`ho-sort-pill${sortKey === opt.key ? ' ho-sort-pill-active' : ''}`}
              onClick={() => setSortKey(opt.key)}
              aria-pressed={sortKey === opt.key}
            >
              {opt.label}
            </button>
          ))}
          <span className="ho-order-count" aria-live="polite">
            {filtered.length} held order{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Table ── */}
        <div className="card ho-table-card" id="ho-table">
          <div className="ho-table-wrap">
            <table className="ho-table" aria-label="Held orders">
              <caption className="visually-hidden">
                Held orders filtered by {activeFilter}, sorted by {sortKey}
              </caption>
              <thead>
                <tr>
                  {COLUMNS.map(col => (
                    <th key={col.key} scope="col">{col.label}</th>
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
                        focusOrder === order.id   ? 'ho-row-focus'
                        : dealer && order.accountNo === dealer ? 'ho-row-highlight'
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
    </>
  );
}
