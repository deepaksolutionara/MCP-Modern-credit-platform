import React, { useState } from 'react';
import '../App.css';

function Banner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="banner">
      <span className="banner-icon">✦</span>
      <div>
        <h4>What's New — v2.6.0: Role-Based Navigation &amp; Detail-Level Drilldown</h4>
        <p>
          Distinct dashboards and menus per internal role •{' '}
          <a href="#">View all changes</a>
        </p>
      </div>
      <button className="banner-close" onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}

export default Banner;