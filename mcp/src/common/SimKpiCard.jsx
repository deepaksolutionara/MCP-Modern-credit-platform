/**
 * SimKpiCard.jsx
 *
 * "Before → After" KPI cell used in the Simulation Studio impact preview.
 * Renders a heading, old value → new value transition, and a coloured delta.
 *
 * Props:
 *   heading    – column label
 *   oldValue   – baseline value string
 *   newValue   – simulated value string
 *   delta      – formatted delta string (e.g. "↓ $45K")
 *   deltaClass – CSS modifier: 'sim-delta-good' | 'sim-delta-bad' | ''
 *   children   – optional override: replaces the values + delta area entirely
 *                (used for custom cells like Release Eligibility)
 */

import React from 'react';

export default function SimKpiCard({ heading, oldValue, newValue, delta, deltaClass = '', children }) {
  return (
    <div className="sim-kpi-cell">
      <div className="sim-kpi-heading">{heading}</div>
      {children ?? (
        <>
          <div className="sim-kpi-values">
            <span className="sim-kpi-old">{oldValue}</span>
            <span className="sim-kpi-arrow">→</span>
            <span className="sim-kpi-new">{newValue}</span>
          </div>
          <div className={`sim-kpi-delta ${deltaClass}`}>{delta}</div>
        </>
      )}
    </div>
  );
}
