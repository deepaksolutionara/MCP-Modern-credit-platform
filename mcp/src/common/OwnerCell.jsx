/**
 * OwnerCell.jsx
 *
 * Avatar + name cell used in owner / assignee columns.
 * Derives initials from the name automatically.
 *
 * Props:
 *   name – full or abbreviated name string (e.g. "M. Patel", "Jane Doe")
 */

import React from 'react';

function initials(name) {
  return name
    .split(/[\s.]/)
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function OwnerCell({ name }) {
  return (
    <div className="zd-owner-wrap">
      <div className="zd-avatar">{initials(name)}</div>
      <span className="zd-owner-name">{name}</span>
    </div>
  );
}
