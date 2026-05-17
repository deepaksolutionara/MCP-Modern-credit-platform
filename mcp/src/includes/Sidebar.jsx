import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, Briefcase, Archive,
  Sparkles, KeyRound, FlaskConical, MessageSquare, BarChart2,
  RefreshCw, Eye, Mail, Globe,
  Layers, ExternalLink, BookOpen, TrendingDown,
  Store, ShoppingCart, Receipt, Scale, CheckSquare,
  AlertTriangle, Megaphone, Bell, History, TrendingUp,
  BookMarked,
  UserPlus, Users, Activity, FileText,
} from 'lucide-react';
import '../App.css';

const navGroups = [
  {
    label: 'Operations',
    items: [
      { Icon: LayoutDashboard, label: 'Dashboard',   to: '/' },
      { Icon: ListTodo,        label: 'Work Queue',  to: '/queues' },
      { Icon: Users,           label: 'Customers',   to: '/customers' },
      { Icon: Briefcase,       label: 'Cases',       to: '/cases' },
      { Icon: Archive,         label: 'Held Orders', to: '/held-orders' },
      { Icon: AlertTriangle, label: 'SLA Risk Queue', to: '/sla-risk' },
    ],
    routed: true,
  },
  {
    label: 'Intelligence',
    items: [
      { Icon: Sparkles,      label: 'Next-Best-Action',    to: '/next-best-action' },
      { Icon: KeyRound,      label: 'Release Unlock',       to: '/release-unlock' },
      { Icon: FlaskConical,  label: 'Simulation Studio',    to: '/simulation-studio' },
      { Icon: MessageSquare, label: 'Communications',       to: '/communications' },
      { Icon: Mail,          label: 'Communication Module', to: '/communication-module' },
      { Icon: Globe,         label: 'Zendesk Coordination', to: '/zendesk-coordination' },
      { Icon: BarChart2,     label: 'Scorecards'         , to: '/scorecards' },
    ],
  },
  {
    label: 'Lifecycle',
    items: [
      { Icon: RefreshCw, label: 'Re-Decisioning'     },
      { Icon: Eye,       label: 'Prebook Visibility' },
    ],
  },
  {
    label: 'Collections',
    items: [
      { Icon: Layers,       label: 'Collections Queue'    },
      { Icon: ExternalLink, label: 'External Referrals'   },
      { Icon: BookOpen,     label: 'Strategy Playbooks'   },
      { Icon: TrendingDown, label: 'Recovery & Write-Off' },
    ],
  },
  {
    label: 'Records',
    items: [
      { Icon: Store,        label: 'Dealers'   },
      { Icon: ShoppingCart, label: 'Orders'    },
      { Icon: Receipt,      label: 'Invoices'  },
      { Icon: Scale,        label: 'Disputes'  },
      { Icon: CheckSquare,  label: 'Decisions' },
    ],
  },
  {
    label: 'Control',
    items: [
      { Icon: Megaphone,     label: 'Escalations'          },
      { Icon: Bell,          label: 'Notifications'        },
      { Icon: History,       label: 'Audit History'        },
      { Icon: TrendingUp,    label: 'Cash Flow Projection' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { Icon: BookMarked, label: 'Methodology' },
    ],
  },
  {
    label: 'Customer',
    items: [
      { Icon: UserPlus,  label: 'Dealer Onboarding' },
      { Icon: Users,     label: 'Customer Profiles' },
      { Icon: Activity,  label: 'Credit Monitoring' },
      { Icon: FileText,  label: 'Release Notes'     },
    ],
  },
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">⬡ DUNLOP / SRIXON</div>

      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map(({ Icon, label, to }) => {
              if (to) {
                const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
                return (
                  <Link
                    key={label}
                    to={to}
                    className={`nav-item${isActive ? ' active' : ''}`}
                  >
                    <Icon size={14} className="nav-icon" />
                    {label}
                  </Link>
                );
              }
              return (
                <a key={label} href="#" className="nav-item">
                  <Icon size={14} className="nav-icon" />
                  {label}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">JD</div>
        <div className="user-info">
          <strong>Jane Doe</strong>
          <span>Credit Team User</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
