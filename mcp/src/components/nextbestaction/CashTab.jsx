import React from 'react'
import {
  Sparkles, CreditCard, Lock, Scale, Clock, User, ChevronRight,
} from 'lucide-react';



const resumeItems = [
  { id: 'COL-4001', dealer: 'Alpine Equipment Co',  stage: 'Pending External Referral' },
  { id: 'COL-4002', dealer: 'ProGear Distribution', stage: 'Dispute Review'            },
  { id: 'COL-4003', dealer: 'SportMax Dealers',     stage: 'Promise to Pay'            },
];

function BadgePill({ label }) {
  if (label === 'Open dispute') return <span className="nba-badge-dispute">{label}</span>;
  if (label === 'Strategic')   return <span className="nba-badge-strategic">{label}</span>;
  return null;
}


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

const CashTab = ({cashRecovery=[]}) => {

    // console.log(cashRecovery);
  return (
    <div className="nba-tab-content">
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Highest Cash Recovery Opportunity</div>
          <div className="nba-section-sub">
            Past-due dealers ranked by configurable priority score (amount, aging, risk, held-order impact).
          </div>
        </div>
        <div className="nba-dealer-list">
          {cashRecovery.map((item, i) => (
            <div className="nba-dealer-row" key={i}>
              <div className="nba-dealer-left">
                <div className="nba-dealer-top">
                  <span className="nba-dealer-name">{item.dealer}</span>
                  <span className="nba-tier-badge">Tier {item.tier}</span>
                  {item.badges.map(b => <BadgePill key={b} label={b} />)}
                </div>
                <div className="nba-dealer-detail">
                  Worst bucket {item.bucket} · {item.invoices} inv · suggested play:{' '}
                  <strong>{item.suggestedPlay}</strong>
                </div>
              </div>
              <div className="nba-dealer-right">
                <div className="nba-dealer-amount">{item.amount}</div>
                <div className="nba-dealer-score">Score {item.score}</div>
              </div>
              <ChevronRight size={16} className="nba-dealer-arrow" />
            </div>
          ))}
        </div>
      </div>
      <ResumeSection />
    </div>
  )
}

export default CashTab

