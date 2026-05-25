import React from 'react';
import { ChevronRight } from 'lucide-react';

const STATUS_CLASS = {
  'Escalated':          'nba-sla-status-escalated',
  'New':                'nba-sla-status-new',
  'Waiting on Payment': 'nba-sla-status-waiting',
};

const PRIORITY_CLASS = {
  'Critical': 'nba-sla-priority-critical',
  'Medium':   'nba-sla-priority-medium',
  'Low':      'nba-sla-priority-low',
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

const SLATab = ({ slaCases = [] }) => {
  return (
    <div className="nba-tab-content">
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Nearest SLA Breaches</div>
          <div className="nba-section-sub">Cases sorted by hours-remaining ascending.</div>
        </div>
        <div className="nba-dealer-list">
          {slaCases.map((item, i) => (
            <div className="nba-dealer-row" key={i}>
              <div className="nba-dealer-left">
                <div className="nba-dispute-top">
                  <span className="nba-release-order-id">{item.id}</span>
                  <span className={STATUS_CLASS[item.status] || 'nba-sla-status-escalated'}>{item.status}</span>
                  <span className={PRIORITY_CLASS[item.priority] || 'nba-sla-priority-medium'}>{item.priority}</span>
                </div>
                <div className="nba-dealer-name" style={{ marginTop: 4 }}>{item.dealer}</div>
              </div>
              <div className="nba-dealer-right">
                <div className="nba-breached-label">{item.breached}</div>
              </div>
              <ChevronRight size={14} className="nba-dealer-arrow" />
            </div>
          ))}
        </div>
      </div>
      <ResumeSection />
    </div>
  );
};

export default SLATab;
