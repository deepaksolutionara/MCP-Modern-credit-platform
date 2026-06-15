import React from 'react';
import { ChevronRight } from 'lucide-react';

const disputes = [
  {
    id: 'DISP-7107', category: 'Product issue',
    status: 'Resolved',                   owner: 'Unassigned', amount: '$68K',
  },
  {
    id: 'DISP-7113', category: 'Pricing',
    status: 'Waiting on Internal Review',  owner: 'Unassigned', amount: '$58K',
  },
  {
    id: 'DISP-7003', category: 'Credit memo expectation',
    status: 'Open',                        owner: 'Unassigned', amount: '$15K',
  },
  {
    id: 'DISP-7106', category: 'Credit memo expectation',
    status: 'Approved',                    owner: 'Mike Chen',  amount: '$8K',
  },
  {
    id: 'DISP-7117', category: 'Credit memo expectation',
    status: 'Waiting on Dealer',           owner: 'Unassigned', amount: '$7K',
  },
];

const disputeStatusBadge = {
  'Open':                      { background: 'hsl(38 92% 50%)',          color: '#0f172a' },
  'Active':                    { background: 'hsl(220deg 70% 50% / 80%)', color: '#fff'    },
  'Resolved':                  { background: '#e2e8f0',                  color: '#475569' },
  'Approved':                  { background: '#22c55e',                  color: '#0f172a' },
  'Waiting on Internal Review':{ background: '#e2e8f0',                  color: '#475569' },
  'Waiting on Dealer':         { background: 'hsl(38 92% 50%)',          color: '#0f172a' },
};

const resumeItems = [
  { id: 'COL-4001', dealer: 'Alpine Equipment Co',  stage: 'Pending External Referral' },
  { id: 'COL-4002', dealer: 'ProGear Distribution', stage: 'Dispute Review'            },
  { id: 'COL-4003', dealer: 'SportMax Dealers',     stage: 'Promise to Pay'            },
];

function ResumeSection() {
  return (
    <div className="nba-section-card">
      <div className="nba-section-header">
        <div className="nba-section-title">Resume where you left off</div>
      </div>
      <div className="nba-resume-grid">
        {resumeItems.map(item => (
          <div className="nba-resume-card" key={item.id}>
            <div className="nba-resume-id">{item.id}</div>
            <div className="nba-resume-dealer">{item.dealer}</div>
            <div className="nba-resume-stage">Stage: {item.stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DisputesTab = () => {
  return (
    <div className="nba-tab-content">
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Highest-Risk Unresolved Disputes</div>
          <div className="nba-section-sub">Breached SLA first, then by amount.</div>
        </div>
        <div className="nba-dealer-list">
          {disputes.map((item, i) => (
            <div className="nba-dealer-row" key={i}>
              <div className="nba-dealer-left">
                <div className="nba-dispute-top">
                  <span className="nba-release-order-id">{item.id}</span>
                  <span className="nba-dispute-category">{item.category}</span>
                  <span className="nba-dispute-sla">SLA breached</span>
                </div>
                <div className="nba-dispute-sub">
                  <span className="nba-badge-status">{item.status}</span>
                  <span className="nba-dispute-owner"> · owner {item.owner}</span>
                </div>
              </div>
              <div className="nba-dealer-right">
                <div className="nba-dealer-amount">{item.amount}</div>
              </div>
              <ChevronRight size={16} className="nba-dealer-arrow" />
            </div>
          ))}
        </div>
      </div>
      <ResumeSection />
    </div>
  );
};

export default DisputesTab;
