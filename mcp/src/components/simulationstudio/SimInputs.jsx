/**
 * SimInputs.jsx — reusable input controls for Simulation Studio.
 *
 * Exports:
 *   SelectInput  – labelled <select> with the chevron icon
 *   NumberInput  – labelled <input type="number">
 *   RangeInput   – labelled range slider with current-value display
 *   PillGroup    – labelled row of toggle pill buttons
 *
 * All components accept a `span` prop (1 | 2) that controls whether the
 * wrapping div also carries the `sim-span-2` class (full grid width).
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';

// ── SelectInput ───────────────────────────────────────────────────────────────
// Props:
//   label        – field label text
//   value        – currently selected value
//   options      – string[] of option values (label === value)
//   onChange     – (value: string) => void
//   span         – 1 (default) | 2

export function SelectInput({ label, value, options, onChange, span }) {
  return (
    <div className={`sim-input-group${span === 2 ? ' sim-span-2' : ''}`}>
      <div className="sim-input-label">{label}</div>
      <div className="cases-select-wrap">
        <select
          className="cases-select sim-full-select"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} className="cases-select-chevron" />
      </div>
    </div>
  );
}

// ── NumberInput ───────────────────────────────────────────────────────────────
// Props:
//   label        – field label text
//   value        – current number value
//   min          – minimum allowed value (default 0)
//   onChange     – (value: number) => void
//   placeholder  – input placeholder (default '0')
//   span         – 1 (default) | 2

export function NumberInput({ label, value, min = 0, onChange, placeholder = '0', span }) {
  return (
    <div className={`sim-input-group${span === 2 ? ' sim-span-2' : ''}`}>
      <div className="sim-input-label">{label}</div>
      <input
        type="number"
        className="sim-number-input"
        min={min}
        value={value}
        onChange={e => onChange(Math.max(min, Number(e.target.value)))}
        placeholder={placeholder}
      />
    </div>
  );
}

// ── RangeInput ────────────────────────────────────────────────────────────────
// Props:
//   label        – field label (value is appended automatically)
//   value        – current number value
//   min / max / step – range bounds
//   formatValue  – (value) => string shown next to the label (default: v => `${v}%`)
//   currentLabel – right-side contextual label, e.g. "Current policy: 85%"
//   onChange     – (value: number) => void
//   span         – 1 | 2 (default: 2, sliders are typically full-width)

export function RangeInput({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue = v => `${v}%`,
  currentLabel,
  onChange,
  span = 2,
}) {
  return (
    <div className={`sim-input-group${span === 2 ? ' sim-span-2' : ''}`}>
      <div className="sim-input-label-row">
        <span>{label} ({formatValue(value)})</span>
        {currentLabel && <span className="sim-current-label">{currentLabel}</span>}
      </div>
      <input
        type="range"
        className="sim-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}

// ── PillGroup ─────────────────────────────────────────────────────────────────
// Props:
//   label        – field label text
//   options      – array of raw option values
//   value        – currently selected value
//   formatOption – (option) => string displayed on the pill (default: String)
//   onChange     – (value) => void
//   span         – 1 (default) | 2

export function PillGroup({ label, options, value, formatOption = String, onChange, span }) {
  return (
    <div className={`sim-input-group${span === 2 ? ' sim-span-2' : ''}`}>
      <div className="sim-input-label">{label}</div>
      <div className="sim-pill-row">
        {options.map(o => (
          <button
            key={o}
            className={`sim-pill-btn${value === o ? ' sim-pill-active' : ''}`}
            onClick={() => onChange(o)}
          >
            {formatOption(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
