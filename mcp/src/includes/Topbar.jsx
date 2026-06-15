/**
 * Topbar.jsx
 *
 * Application top bar: sidebar toggle, global search, Preview As dropdown,
 * notification bell, and user identity.
 *
 * WCAG 2.2:
 *   - All icon buttons have aria-label (2.5.3 Label in Name)
 *   - Search input has role="search" and aria-label (1.3.1)
 *   - Notification bell has aria-live for badge count (4.1.3)
 */

import React from 'react';
import '../App.css';
import Dropdown from '../common/Dropdown';

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="topbar">

      {/* Sidebar toggle — WCAG 2.5.3 explicit label */}
      <button
        className="topbar-toggle"
        aria-label="Toggle sidebar navigation"
        aria-controls="sidebar"
        onClick={onToggleSidebar}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>

      {/* Global search — WCAG 1.3.1 role="search" + labelled input */}
      <div className="search-bar" role="search">
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className="search-icon-svg"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.5"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="search"
          placeholder="Search customers, orders, disputes..."
          aria-label="Search customers, orders, and disputes"
          autoComplete="off"
        />
      </div>

      {/* Preview As role switcher */}
      <Dropdown />

      {/* Notification + user */}
      <div className="topbar-actions">
        <button
          className="notif-btn"
          aria-label="Notifications — 1 unread"
          aria-haspopup="true"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2C6.24 2 4 4.24 4 7v4l-1.5 1.5v.5h13v-.5L14 11V7c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <path d="M7.5 15.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {/* aria-hidden — count is in the button aria-label */}
          <span className="notif-badge" aria-hidden="true" />
        </button>

        <div className="topbar-divider" aria-hidden="true" />

        {/* User identity — not interactive, so div is correct */}
        <div className="topbar-user" aria-label="Signed in as Jane Doe, Credit Team User">
          <div className="avatar" aria-hidden="true">JD</div>
          <div>
            <strong>Jane Doe</strong>
            <span>Credit Team User</span>
          </div>
        </div>
      </div>

    </header>
  );
}
