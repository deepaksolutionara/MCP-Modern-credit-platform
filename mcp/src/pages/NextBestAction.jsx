import React, { useState } from 'react';
import '../App.css';
import { Sparkles } from 'lucide-react';
import PageHeader from '../common/PageHeader';

const CashTab = React.lazy(() => import('../components/nextbestaction/CashTab'));
import ReleaseTab  from '../components/nextbestaction/ReleaseTab';
import DisputesTab from '../components/nextbestaction/DisputesTab';
import SLATab      from '../components/nextbestaction/SLATab';
import WorkloadTab from '../components/nextbestaction/WorkloadTab';
import { tabs, cashRecovery, slaCases } from '../data/nextBestActionData';

// TAB_COMPONENTS stays here — it holds React element factories, not plain data.
const TAB_COMPONENTS = {
  cash:     () => <CashTab cashRecovery={cashRecovery} />,
  release:  () => <ReleaseTab />,
  disputes: () => <DisputesTab />,
  sla:      () => <SLATab slaCases={slaCases} />,
  workload: () => <WorkloadTab />,
};
const tabs = [
  {
    key: 'cash',
    label: 'Cash',
    Icon: CreditCard,
    Component: CashTab,
    props: { cashRecovery },
  },
  {
    key: 'release',
    label: 'Release',
    Icon: Lock,
    Component: ReleaseTab,
  },
  {
    key: 'disputes',
    label: 'Disputes',
    Icon: Scale,
    Component: DisputesTab,
  },
  {
    key: 'sla',
    label: 'SLA',
    Icon: Clock,
    Component: SLATab,
    props: { slaCases },
  },
  {
    key: 'workload',
    label: 'Workload',
    Icon: User,
    Component: WorkloadTab,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NextBestAction() {
  const [activeTab, setActiveTab] = useState('cash');
       
       const activeTabConfig = tabs.find(tab => tab.key === activeTab);
const ActiveComponent = activeTabConfig?.Component;

  return (
    <div className="dashboard">

      <PageHeader
        icon={<Sparkles size={18} color="#3b82f6" />}
        title="Next-Best-Action Hub"
        subtitle="Prioritized worklists that put cash recovery, release unlock, and SLA-critical actions first."
      />

      {/* Tab bar */}
      <div className="nba-tabbar">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nba-tab${activeTab === key ? ' nba-tab-active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

<Suspense fallback={<div>Loading...</div>}>
  {ActiveComponent && <ActiveComponent {...(activeTabConfig.props || {})} />}
</Suspense>
    </div>
  );
}
