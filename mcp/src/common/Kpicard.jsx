import React from 'react';
import { Link } from 'react-router-dom';

const Kpicard = ({ label, value, Icon, bg, color, to }) => {
  const inner = (
    <>
      <div className="kpi-icon" style={{ background: bg }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{label}</div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="kpi-card kpi-card-link">
        {inner}
      </Link>
    );
  }

  return <div className="kpi-card">{inner}</div>;
};

export default Kpicard;
