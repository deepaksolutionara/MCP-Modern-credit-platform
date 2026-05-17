import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2, Package, BarChart2, CreditCard, BookOpen,
  FileText, ShieldCheck, Scale, Briefcase, ChevronRight,
  Phone, Mail, ArrowUpRight, ArrowDownLeft, History,
  MessageSquare, AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react';
import { getCustomerDetail } from '../data/customersData';
import { addRecentlyViewed } from '../utils/recentlyViewed';
import '../App.css';

// ── Quick-action cards ────────────────────────────────────────────────────────

const quickCards = [
  { label: 'Held Orders',   Icon: Package,     tab: 'held_orders',  navTo: (acct) => `/held-orders?dealer=${acct}` },
  { label: 'Aging',         Icon: BarChart2,   tab: 'aging'         },
  { label: 'Payments',      Icon: CreditCard,  tab: 'payments'      },
  { label: 'A/R Ledger',    Icon: BookOpen,    tab: 'ar_ledger'     },
  { label: 'Notes',         Icon: FileText,    tab: 'notes'         },
  { label: 'Credit Limit',  Icon: ShieldCheck, tab: 'credit_limit'  },
  { label: 'Disputes',      Icon: Scale,       tab: 'disputes'      },
  { label: 'Cases',         Icon: Briefcase,   tab: 'cases'         },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────

const tabs = [
  { key: 'address_book',  label: 'Address Book'      },
  { key: 'aging',         label: 'Aging'             },
  { key: 'held_orders',   label: 'Held Orders'       },
  { key: 'payments',      label: 'Payments'          },
  { key: 'ar_ledger',     label: 'A/R Ledger'        },
  { key: 'notes',         label: 'Notes'             },
  { key: 'credit_limit',  label: 'Credit Check / Limit' },
  { key: 'invoices',      label: 'Invoices'          },
  { key: 'disputes',      label: 'Disputes'          },
  { key: 'cases',         label: 'Cases'             },
  { key: 'communications',label: 'Communications'    },
  { key: 'audit_history', label: 'Audit History'     },
];

// ── Small helpers ─────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  return <span className="cdtl-role-badge">{role}</span>;
}

function StatusPill({ status }) {
  const cls = status === 'On Hold'   ? 'cdtl-pill-hold'
            : status === 'Watchlist' ? 'cdtl-pill-watch'
            : status === 'Active'    ? 'cdtl-pill-active'
            : '';
  return <span className={`cdtl-status-pill ${cls}`}>{status}</span>;
}

function SLAPill({ sla }) {
  const cls = sla === 'Breached'    ? 'ho-sla-breached'
            : sla === 'Near Breach' ? 'ho-sla-near'
            : 'ho-sla-ok';
  return <span className={`ho-sla-pill ${cls}`}>{sla}</span>;
}

function PriorityBadge({ priority }) {
  const cls = priority === 'Critical' ? 'cdtl-pri-critical'
            : priority === 'High'     ? 'cdtl-pri-high'
            : priority === 'Medium'   ? 'cdtl-pri-medium'
            : 'cdtl-pri-low';
  return <span className={`cdtl-pri-badge ${cls}`}>{priority}</span>;
}

function EmptyState({ message }) {
  return <div className="cdtl-empty">{message}</div>;
}

// ── Tab content components ────────────────────────────────────────────────────

function AddressBookTab({ customer }) {
  return (
    <div className="cdtl-section">
      <div className="cdtl-section-title">
        <Phone size={15} color="#3b82f6" /> Contacts
      </div>
      <div className="cdtl-contacts-list">
        {customer.contacts.map((c, i) => (
          <div key={i} className="cdtl-contact-row">
            <div className="cdtl-contact-top">
              <span className="cdtl-contact-name">{c.name}</span>
              <RoleBadge role={c.role} />
            </div>
            <div className="cdtl-contact-meta">
              <span className="cdtl-contact-item"><Mail size={12} /> {c.email}</span>
              <span className="cdtl-contact-sep">·</span>
              <span className="cdtl-contact-item"><Phone size={12} /> {c.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgingTab({ customer }) {
  return (
    <div className="cdtl-aging-row">
      {customer.aging.map((cell, i) => (
        <div key={i} className="cdtl-aging-cell">
          <div className="cdtl-aging-label">{cell.label}</div>
          <div className={`cdtl-aging-value ${cell.red ? 'cdtl-aging-red' : ''}`}>{cell.amount}</div>
        </div>
      ))}
    </div>
  );
}


function HeldOrdersTab({ customer }) {
  if (!customer.heldOrders.length) return <EmptyState message="No held orders for this account." />;
  return (
    <div className="cdtl-cases-list">
      {customer.heldOrders.map((o, i) => (
        <Link key={i} to={`/held-orders?dealer=${customer.accountNo}&order=${o.id}`} className="cdtl-case-row cdtl-case-row-link">
          <div className="cdtl-case-title">
            <span className="cdtl-case-id">{o.id}</span>
            <span className="cdtl-case-dash"> — </span>
            <span className="cdtl-case-status">{o.value}</span>
          </div>
          <div className="cdtl-case-meta">{o.reason} · {o.lifecycle}</div>
        </Link>
      ))}
    </div>
  );
}

function PaymentsTab() {
  return (
    <div className="cdtl-notes-redirect">
      Payment activity for this customer is available on the{' '}
      <a href="/communications" className="cdtl-dealer-link">Payments page</a>.
    </div>
  );
}

function ARLedgerTab({ customer }) {
  if (!customer.arLedger.length) return <EmptyState message="No A/R ledger entries." />;
  return (
    <div className="cdtl-cases-list">
      {customer.arLedger.map((e, i) => (
        <div key={i} className="cdtl-case-row">
          <div className="cdtl-case-title">
            <span className="cdtl-case-id">{e.ref}</span>
            <span className="cdtl-case-dash"> — </span>
            <span className="cdtl-case-status">{e.amount} {e.label}</span>
          </div>
          <div className="cdtl-case-meta">{e.type} · {e.aging}</div>
        </div>
      ))}
    </div>
  );
}

function NotesTab() {
  return (
    <div className="cdtl-notes-redirect">
      Customer notes are surfaced under the Dealer Profile.{' '}
      <a href="#" className="cdtl-dealer-link">Open Dealer Profile →</a>
    </div>
  );
}

function CreditLimitTab({ customer }) {
  const c = customer.credit;
  const kpis = [
    { label: 'CREDIT LIMIT', value: c.limit },
    { label: 'TOTAL A/R',    value: c.totalAR },
    { label: 'AVAILABLE',    value: c.available },
    { label: 'UTILIZATION',  value: `${c.utilPct}%` },
  ];
  return (
    <div>
      <div className="cdtl-aging-row">
        {kpis.map((k, i) => (
          <div key={i} className="cdtl-aging-cell">
            <div className="cdtl-aging-label">{k.label}</div>
            <div className="cdtl-aging-value">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="cdtl-credit-footnote">
        Total open A/R from invoices: {c.openAR}
      </div>
    </div>
  );
}

function InvoicesTab({ customer }) {
  if (!customer.invoices.length) return <EmptyState message="No invoices found." />;
  return (
    <div className="cdtl-inv-list">
      {customer.invoices.map((inv, i) => (
        <div key={i} className="cdtl-inv-card">
          <div className="cdtl-case-title">
            <span className="cdtl-case-id">{inv.id}</span>
            <span className="cdtl-case-dash"> — </span>
            <span className="cdtl-case-status">{inv.amount}</span>
          </div>
          <div className="cdtl-case-meta">{inv.status} · Due {inv.due}</div>
        </div>
      ))}
    </div>
  );
}

function DisputesTab({ customer }) {
  if (!customer.disputes.length) return <EmptyState message="No open disputes." />;
  return (
    <div className="cdtl-cases-list">
      {customer.disputes.map((d, i) => (
        <div key={i} className="cdtl-case-row">
          <div className="cdtl-case-title">
            <span className="cdtl-case-id">{d.id}</span>
            <span className="cdtl-case-dash"> — </span>
            <span className="cdtl-case-status">{d.amount}</span>
          </div>
          <div className="cdtl-case-meta">{d.type} · {d.status}</div>
        </div>
      ))}
    </div>
  );
}

function CasesTab({ customer }) {
  if (!customer.cases.length) return <EmptyState message="No cases linked to this account." />;
  return (
    <div className="cdtl-cases-list">
      {customer.cases.map((c, i) => (
        <div key={i} className="cdtl-case-row">
          <div className="cdtl-case-title">
            <Link to="/cases" className="cdtl-case-id">{c.id}</Link>
            <span className="cdtl-case-dash"> — </span>
            <span className="cdtl-case-status">{c.status}</span>
          </div>
          <div className="cdtl-case-meta">{c.priority} · Owner: {c.owner}</div>
        </div>
      ))}
    </div>
  );
}

function CommunicationsTab({ customer }) {
  if (!customer.communications.length) return <EmptyState message="No communications on record." />;
  return (
    <div className="cdtl-section">
      <div className="cdtl-section-title"><MessageSquare size={13} color="#3b82f6" /> Communications</div>
      <div className="cdtl-comm-list">
        {customer.communications.map((c, i) => (
          <div key={i} className="cdtl-comm-row">
            <div className="cdtl-comm-top">
              <span className="cdtl-comm-channel">{c.channel}</span>
              <span className="cdtl-comm-subject">{c.subject}</span>
            </div>
            <div className="cdtl-comm-meta">{c.date} · {c.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditHistoryTab({ customer }) {
  if (!customer.auditHistory.length) return <EmptyState message="No audit history." />;
  return (
    <div className="cdtl-section">
      <div className="cdtl-section-title"><History size={13} color="#3b82f6" /> Audit history</div>
      <div className="cdtl-audit-track">
        {customer.auditHistory.map((e, i) => (
          <div key={i} className="cdtl-audit-entry">
            <div className="cdtl-audit-action">{e.action}</div>
            <div className="cdtl-audit-meta">
              {e.user} · {e.date}{e.detail ? ` · ${e.detail}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CustomerDetail() {
  const { accountNo } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('address_book');

  const customer = getCustomerDetail(accountNo);

  useEffect(() => {
    if (customer) addRecentlyViewed(customer.accountNo, customer.customer);
  }, [accountNo]);

  if (!customer) {
    return (
      <div className="dashboard">
        <div className="cdtl-not-found">
          Account <strong>{accountNo}</strong> not found.{' '}
          <Link to="/customers" className="cdtl-link">← Back to Customers</Link>
        </div>
      </div>
    );
  }

  function renderTab() {
    switch (activeTab) {
      case 'address_book':  return <AddressBookTab  customer={customer} />;
      case 'aging':         return <AgingTab         customer={customer} />;
      case 'held_orders':   return <HeldOrdersTab    customer={customer} />;
      case 'payments':      return <PaymentsTab />;
      case 'ar_ledger':     return <ARLedgerTab      customer={customer} />;
      case 'notes':         return <NotesTab />;
      case 'credit_limit':  return <CreditLimitTab   customer={customer} />;
      case 'invoices':      return <InvoicesTab      customer={customer} />;
      case 'disputes':      return <DisputesTab      customer={customer} />;
      case 'cases':         return <CasesTab         customer={customer} />;
      case 'communications':return <CommunicationsTab customer={customer} />;
      case 'audit_history': return <AuditHistoryTab  customer={customer} />;
      default: return null;
    }
  }

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="cdtl-header-row">
        <div className="cdtl-header-left">
          <div className="cdtl-header-icon">
            <Building2 size={20} color="#fff" />
          </div>
          <div>
            <div className="dash-title">{customer.customer}</div>
            <div className="dash-sub">
              {customer.accountNo} · {customer.region} · <StatusPill status={customer.status} /> · Sales Rep: {customer.salesRep}
            </div>
          </div>
        </div>
        <Link to="/customers" className="cdtl-back-link">← Customers</Link>
      </div>

      {/* Quick-action cards */}
      <div className="cdtl-quick-grid">
        {quickCards.map(({ label, Icon, tab, navTo }) => (
          <button
            key={tab}
            className="cdtl-quick-card"
            onClick={() => navTo ? navigate(navTo(accountNo)) : setActiveTab(tab)}
          >
            <div className="cdtl-quick-icon"><Icon size={15} color="#3b82f6" /></div>
            <span className="cdtl-quick-label">{label}</span>
            <ChevronRight size={14} color="#94a3b8" className="cdtl-quick-arrow" />
          </button>
        ))}
      </div>

      {/* Tabs row */}
      <div className="cdtl-tabs-bar">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`cdtl-tab ${activeTab === t.key ? 'cdtl-tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card cdtl-tab-content">
        {renderTab()}
      </div>

    </div>
  );
}
