import React from 'react';

const statusStyle = {
  'Escalated':               { background: '#ef4444', color: '#fff' },
  'Waiting on Dealer':       { background: '#f97316', color: '#fff' },
  'In Review':               { background: '#e2e8f0', color: '#475569' },
  'Waiting on Return Update':{ background: '#f97316', color: '#fff' },
  'Open':                    { background: '#dbeafe', color: '#1d4ed8' },
};

const priorityStyle = {
  Critical: { background: '#ef4444', color: '#fff' },
  High:     { background: '#f97316', color: '#fff' },
  Medium:   { background: '#e2e8f0', color: '#475569' },
  Low:      { background: '#dcfce7', color: '#16a34a' },
};

function timeColor(hoursLeft) {
  if (hoursLeft <= 0) return '#dc2626';
  if (hoursLeft <= 4) return '#ea580c';
  if (hoursLeft <= 8) return '#d97706';
  return '#94a3b8';
}

function timeLabel(hoursLeft) {
  if (hoursLeft <= 0) return `Breached +${Math.abs(hoursLeft)}h`;
  return `${hoursLeft}h left`;
}

export default function SLAHotlist({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <div className="sla-items-list">
      {items.map(item => {
        const hoursLeft = item.slaTargetHours - item.slaElapsedHours;
        const progress = Math.max(0, Math.min(100, (hoursLeft / item.slaTargetHours) * 100));

        return (
          <div className="sla-item" key={item.case_ID}>
            <div className="sla-item-top">
              <span className="sla-case-id">CASE-{item.case_ID}</span>
              <span className="sla-badge" style={statusStyle[item.status] || statusStyle['In Review']}>
                {item.status}
              </span>
              <span className="sla-badge" style={priorityStyle[item.priority] || priorityStyle['Medium']}>
                {item.priority}
              </span>
            </div>
            <div className="sla-dealer">{item.dealerName}</div>
            <div className="sla-progress-row">
              <div className="sla-progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="sla-time" style={{ color: timeColor(hoursLeft) }}>
                {timeLabel(hoursLeft)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
