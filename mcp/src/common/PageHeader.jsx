import React from 'react';
import '../App.css';

/**
 * Shared page header used across all pages.
 *
 * Props:
 *   icon      – React element (lucide icon)
 *   iconBg    – background colour for the icon box (default #eff6ff)
 *   title     – page title string
 *   subtitle  – subtitle / description string (optional)
 *   actions   – React node rendered on the right (buttons, badges, etc.)
 */
export default function PageHeader({ icon, iconBg = '#eff6ff', title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        {icon && (
          <div className="page-header-icon-box" style={{ background: iconBg }}>
            {icon}
          </div>
        )}
        <div>
          <div className="page-header-title">{title}</div>
          {subtitle && <div className="page-header-sub">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
