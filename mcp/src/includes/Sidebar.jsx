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
  Shield, Ban, FileCheck, Radio, Terminal, Share2,
  ChevronDown, Zap, GitBranch,
} from 'lucide-react';
import '../App.css';

const navGroups = [
  {
    label: 'Operations',
    items: [
      { Icon: LayoutDashboard, label: 'Dashboard',   to: '/' },
      { Icon: ListTodo,        label: 'My Work Queue', to: '/queues' },
      { Icon: Users,           label: 'Customers',   to: '/customers' },
      { Icon: Briefcase,       label: 'Cases',       to: '/cases' },
      { Icon: Archive,         label: 'Held Orders', to: '/held-orders' },
      { Icon: AlertTriangle, label: 'SLA Risk Queue',  to: '/sla-risk'      },
      { Icon: Zap,        label: 'Auto-Released',         to: '/auto-released'  },
      { Icon: GitBranch,  label: 'Re-Decisioning Events', to: '/re-decisioning' },
      { Icon: FileText,      label: 'Credit Hold Report',    to: '/credit-hold-report' },
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
      { Icon: Activity,  label: 'Re-Decisioning',        to: '/re-decisioning-lifecycle' },
      { Icon: History,   label: 'Re-Decisioning History', to: '/re-decisioning-history' },
      { Icon: Shield,    label: 'JDE Hold Governance'    },
      { Icon: Archive,   label: 'Manual Credit Holds'    },
      { Icon: Ban,       label: 'Credit Bypass'          },
      { Icon: FileCheck, label: 'Exemption Policies'     },
      { Icon: Radio,     label: 'Sales Portal Feed'      },
      { Icon: Terminal,  label: 'CLI Requests'           },
      { Icon: Share2,    label: 'Shared Credit Limits'   },
      { Icon: Eye,       label: 'Prebook Visibility'     },
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

function Sidebar({ onNavClick }) {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">⬡</span>
        <span className="nav-label"> DUNLOP / SRIXON</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            {/* Group label acts as a section heading within the nav */}
            <div
              className="nav-group-label nav-label"
              role="presentation"
            >
              {group.label}
            </div>
            {group.items.map(({ Icon, label, to }) => {
              if (to) {
                const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
                return (
                  <Link
                    key={label}
                    to={to}
                    className={`nav-item${isActive ? ' active' : ''}`}
                    onClick={onNavClick}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={label}
                  >
                    <Icon size={14} className="nav-icon" aria-hidden="true" />
                    <span className="nav-label">{label}</span>
                  </Link>
                );
              }
              return (
                <a
                  key={label}
                  href="#"
                  className="nav-item"
                  onClick={onNavClick}
                  aria-label={label}
                >
                  <Icon size={14} className="nav-icon" aria-hidden="true" />
                  <span className="nav-label">{label}</span>
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Pinned bottom section — stays visible regardless of scroll position */}
      <div className="sidebar-user">
        <div className="sidebar-user-row">
          <div className="avatar">JD</div>
          <div className="user-info nav-label">
            <strong>Jane Doe</strong>
            <span>Credit Ops</span>
          </div>
        </div>
        <div className="sidebar-demo-label nav-label">Demo · Switch Role</div>
        <button className="sidebar-role-btn nav-label">
          Credit Team User
          <ChevronDown size={12} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
