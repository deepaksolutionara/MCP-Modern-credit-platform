import React from 'react';
import '../App.css';
import Dropdown from '../common/Dropdown';

function Topbar() {
  return (
    <header className="topbar">
      <button className="topbar-toggle" aria-label="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>

      <div className="search-bar">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="search-icon-svg">
          <circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.5"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input type="text" placeholder="Search customers, orders, disputes..." />
      </div>

      <Dropdown />

      <div className="topbar-actions">
        <div className="notif-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C6.24 2 4 4.24 4 7v4l-1.5 1.5v.5h13v-.5L14 11V7c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <path d="M7.5 15.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span className="notif-badge"></span>
        </div>
        <div className="topbar-user">
          <div className="avatar">JD</div>
          <div>
            <strong>Jane Doe</strong>
            <span>Credit Team User</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
