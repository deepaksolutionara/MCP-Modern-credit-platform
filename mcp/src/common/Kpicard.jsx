import React from 'react';
import { Link } from 'react-router-dom';

const Kpicard = ({ label, value, Icon, bg, color, to }) => {
  const inner = (
    <>
      {/* aria-hidden — icon is decorative; the label carries the meaning */}
      <div className="kpi-icon" style={{ background: bg }} aria-hidden="true">
        <Icon size={17} style={{ color }} />
      </div>
      {/* aria-hidden — screen readers get the full value+label from aria-label on the card */}
      <div className="kpi-value" aria-hidden="true">{value}</div>
      <div className="kpi-sub"  aria-hidden="true">{label}</div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="kpi-card kpi-card-link"
        aria-label={`${value} — ${label}. Go to detail page.`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="kpi-card"
      role="img"
      aria-label={`${value} — ${label}`}
    >
      {inner}
    </div>
  );
};

export default Kpicard;
