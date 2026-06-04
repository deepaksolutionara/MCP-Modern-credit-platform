/**
 * ListRow.jsx
 *
 * Reusable two-line list row used across CustomerDetail tabs.
 *
 * Visual structure:
 *   [id]  —  [label]   [badge?]
 *   [meta]
 *
 * Props:
 *   id      – left part of the title line (string or ReactNode, e.g. a <Link>)
 *   label   – right part of the title line (after the dash)
 *   meta    – second line (muted supporting text)
 *   badge   – optional ReactNode rendered after `label` (pill, status badge, etc.)
 *   href    – when provided the entire row is rendered as a react-router <Link>
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function ListRow({ id, label, meta, badge, href }) {
  const content = (
    <>
      <div className="cdtl-case-title">
        <span className="cdtl-case-id">{id}</span>
        <span className="cdtl-case-dash"> — </span>
        <span className="cdtl-case-status">{label}</span>
        {badge && <span className="cdtl-row-badge">{badge}</span>}
      </div>
      {meta && <div className="cdtl-case-meta">{meta}</div>}
    </>
  );

  return href
    ? <Link to={href} className="cdtl-case-row cdtl-case-row-link">{content}</Link>
    : <div className="cdtl-case-row">{content}</div>;
}
