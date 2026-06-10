/**
 * PageHeader.jsx
 *
 * Shared page header used across all pages.
 *
 * Props:
 *   icon      – React element (lucide icon, decorative — aria-hidden applied)
 *   iconBg    – background colour for the icon box (default #eff6ff)
 *   title     – page title string — rendered as <h1> (WCAG 1.3.1)
 *   subtitle  – subtitle / description string (optional)
 *   actions   – React node rendered on the right (buttons, badges, etc.)
 */

import React from 'react';
import '../App.css';

export default function PageHeader({ icon, iconBg = '#eff6ff', title, subtitle, actions }) {
  return (
    <div className="page-header" role="banner">
      <div className="page-header-left">
        {icon && (
          <div
            className="page-header-icon-box"
            style={{ background: iconBg }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div>
          {/* h1 — every page using PageHeader gets a proper heading (WCAG 1.3.1, 2.4.6) */}
          <h1 className="page-header-title">{title}</h1>
          {subtitle && (
            <p className="page-header-sub">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="page-header-actions" aria-label="Page actions">
          {actions}
        </div>
      )}
    </div>
  );
}
