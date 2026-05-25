import React from 'react';
import { ChevronRight } from 'lucide-react';

const releaseOrders = [
  {
    orderId: 'ORD-80018', dealer: 'PGA Tour Superstore',
    status: [
      { text: 'Past due > policy threshold', warn: false },
      { text: 'Awaiting payment',            warn: false },
    ],
    amount: '$274K',
  },
  {
    orderId: 'ORD-80103', dealer: 'Birdie Bay Pro Shop',
    status: [
      { text: 'Pending dispute review',        warn: false },
      { text: 'Pending credit analyst review', warn: true  },
    ],
    amount: '$265K',
  },
  {
    orderId: 'ORD-80223', dealer: 'Summit Sports E-Tail',
    status: [
      { text: 'Pending dispute review',        warn: false },
      { text: 'Pending credit analyst review', warn: true  },
    ],
    amount: '$246K',
  },
  {
    orderId: 'ORD-80188', dealer: 'Hilltop Golf Center (Collections)',
    status: [
      { text: 'Open order pushes exposure above limit', warn: false },
      { text: 'Awaiting payment',                       warn: false },
    ],
    amount: '$245K',
  },
  {
    orderId: 'ORD-80225', dealer: 'Heritage Golf Pro Shop',
    status: [
      { text: 'Past due > policy threshold', warn: false },
      { text: 'Awaiting payment',            warn: false },
    ],
    amount: '$245K',
  },
];

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

const ReleaseTab = () => {
  return (
    <div className="nba-tab-content">
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Highest Release-Unlock Opportunity</div>
          <div className="nba-section-sub">
            Held orders by revenue impact. Open the order to see exactly what would unlock release.
          </div>
        </div>
        <div className="nba-dealer-list">
          {releaseOrders.map((item, i) => (
            <div className="nba-dealer-row" key={i}>
              <div className="nba-dealer-left">
                <div className="nba-release-top">
                  <span className="nba-release-order-id">{item.orderId}</span>
                  <span className="nba-dealer-name">{item.dealer}</span>
                </div>
                <div className="nba-release-status">
                  {item.status.map((s, si) => (
                    <span key={si}>
                      {si > 0 && <span className="nba-status-dot"> · </span>}
                      <span className={s.warn ? 'nba-status-warn' : 'nba-status-normal'}>
                        {s.text}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="nba-dealer-right">
                <div className="nba-dealer-amount">{item.amount}</div>
                <div className="nba-unlock-label">unlock potential</div>
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

export default ReleaseTab;
