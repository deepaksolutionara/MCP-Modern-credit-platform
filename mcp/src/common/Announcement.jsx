/**
 * Announcement.jsx
 *
 * Dismissible banner for release notes / platform announcements.
 *
 * LCP optimisation:
 *   The banner is intentionally deferred to useEffect so it is NOT part of the
 *   first synchronous render. Without this, `span.announcement-desc` becomes the
 *   browser's LCP element (the largest text painted first), inflating the LCP
 *   score. Deferring lets the actual page content — KPI cards, tables — be the
 *   LCP element instead.
 *
 * Persistence:
 *   Dismissed state is stored in localStorage under STORAGE_KEY. Once a user
 *   closes the banner it stays closed across all pages and full page reloads.
 *   Bump STORAGE_KEY whenever a new announcement should be shown again.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

// Change this key whenever a new announcement should re-appear for all users.
const STORAGE_KEY = 'announcement_v2_7_3_dismissed';

const Announcement = ({ onClose }) => {
  // null = "not yet checked" → renders nothing on first paint (keeps banner
  // out of LCP). After mount, set to true only if not previously dismissed.
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  // Render nothing: either pre-mount check or already dismissed
  if (!visible) return null;

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    onClose?.(); // notify parent (Dashboard uses this to hide its showBanner state)
  }

  return (
    <div className="announcement-banner">
      <Sparkles size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
      <div className="announcement-content">
        <span className="announcement-title">
          What's New — v2.7.3: Canonical 20-Event Integration Catalog
        </span>
        <span className="announcement-desc">
          Standardized 20-event onboarding integration catalog across all systems
        </span>
        <a href="#" className="announcement-link">View all changes →</a>
      </div>
      <button
        className="announcement-close"
        onClick={handleClose}
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Announcement;
