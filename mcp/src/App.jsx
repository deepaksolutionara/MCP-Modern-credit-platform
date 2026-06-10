import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './includes/Sidebar';
import Topbar from './includes/Topbar';
import Dashboard from './pages/Dashboard';
import WorkQueue from './pages/WorkQueue';
import Cases from './pages/Cases';
import HeldOrders from './pages/HeldOrders';
import NextBestAction from './pages/NextBestAction';
import ReleaseUnlock from './pages/ReleaseUnlock';
import ReleaseUnlockDetail from './pages/ReleaseUnlockDetail';
import SimulationStudio from './pages/SimulationStudio';
import Communications from './pages/Communications';
import CommunicationModule from './pages/CommunicationModule';
import ZendeskCoordination from './pages/ZendeskCoordination';
import Scorecards from './pages/Scorecards';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import SLARiskQueue from './pages/SLARiskQueue';
import AutoReleased from './pages/AutoReleased';
import CaseDetail from './pages/CaseDetail';
import ReDecisioningEvents from './pages/ReDecisioningEvents';
import CreditHoldReport from './pages/CreditHoldReport';
import ReDecisioningLifecycle from './pages/ReDecisioningLifecycle';
import ReDecisioningHistory from './pages/ReDecisioningHistory';

import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="app-root">
        <div className={`app-layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>

          {/* Mobile overlay — tap to close sidebar */}
          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <Sidebar />

          <div className="main-wrapper">
            <Topbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
            <main className="page-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/queues" element={<WorkQueue />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/cases/:caseId" element={<CaseDetail />} />
                <Route path="/held-orders" element={<HeldOrders />} />
                <Route path="/next-best-action" element={<NextBestAction />} />
                <Route path="/release-unlock" element={<ReleaseUnlock />} />
                <Route path="/release-unlock/:orderId" element={<ReleaseUnlockDetail />} />
                <Route path="/simulation-studio" element={<SimulationStudio />} />
                <Route path="/communications" element={<Communications />} />
                <Route path="/communication-module" element={<CommunicationModule />} />
                <Route path="/zendesk-coordination" element={<ZendeskCoordination />} />
                <Route path="/scorecards" element={<Scorecards />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:accountNo" element={<CustomerDetail />} />
                <Route path="/sla-risk" element={<SLARiskQueue />} />
                <Route path="/auto-released" element={<AutoReleased />} />
                <Route path="/re-decisioning" element={<ReDecisioningEvents />} />
                <Route path="/credit-hold-report" element={<CreditHoldReport />} />
                <Route path="/re-decisioning-lifecycle" element={<ReDecisioningLifecycle />} />
                <Route path="/re-decisioning-history" element={<ReDecisioningHistory />} />
              </Routes>
            </main>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
