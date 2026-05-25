import React from 'react';

const workloadData = [
  { owner: 'Jane Doe',  role: 'Credit Ops',       open: 14, breached: 2, load: 56 },
  { owner: 'Mike Chen', role: 'AR / Collections',  open: 23, breached: 4, load: 92 },
  { owner: 'M. Patel',  role: 'Credit Manager',    open: 6,  breached: 1, load: 24 },
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

const WorkloadTab = () => {
  return (
    <div className="nba-tab-content">
      <div className="nba-section-card">
        <div className="nba-section-header">
          <div className="nba-section-title">Workload Balancing</div>
          <div className="nba-section-sub">
            Open work and SLA-breach load by analyst / collector / manager.
          </div>
        </div>

        <table className="nba-wl-table">
          <thead>
            <tr>
              <th className="nba-wl-th">OWNER</th>
              <th className="nba-wl-th">ROLE</th>
              <th className="nba-wl-th nba-wl-th-center">OPEN</th>
              <th className="nba-wl-th nba-wl-th-center">BREACHED</th>
              <th className="nba-wl-th nba-wl-th-right">LOAD</th>
            </tr>
          </thead>
          <tbody>
            {workloadData.map((row, i) => (
              <tr key={i} className="nba-wl-tr">
                <td className="nba-wl-td nba-wl-owner">{row.owner}</td>
                <td className="nba-wl-td nba-wl-role">{row.role}</td>
                <td className="nba-wl-td nba-wl-center">{row.open}</td>
                <td className="nba-wl-td nba-wl-center">
                  <span className="nba-wl-breached-badge">{row.breached}</span>
                </td>
                <td className="nba-wl-td nba-wl-load-cell">
                  <div className="nba-wl-bar-wrap">
                    <div className="nba-wl-bar-fill" style={{ width: `${row.load}%` }} />
                  </div>
                  <span className="nba-wl-pct">{row.load}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="nba-wl-footer">
          <button className="nba-wl-reassign-btn">Reassign workload</button>
        </div>
      </div>

      <ResumeSection />
    </div>
  );
};

export default WorkloadTab;
