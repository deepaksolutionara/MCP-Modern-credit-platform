import React, { useState, useMemo } from 'react';
import '../App.css';
import { FlaskConical } from 'lucide-react';

// ── Dealer baseline data ──────────────────────────────────────────────────────

const dealerBaselines = {
  'Alpine Equipment Co':   { totalExposure: 2300000, creditLimit: 2500000, heldValue: 240000, returnConfBase: 58, utilBase: 85, minPayment: 200000, policyRef: 'Credit Policy §4.2' },
  'ProGear Distribution':  { totalExposure: 420000,  creditLimit: 500000,  heldValue: 180000, returnConfBase: 72, utilBase: 80, minPayment: 18500,  policyRef: 'Credit Policy §3.1' },
  'SportMax Dealers':      { totalExposure: 150000,  creditLimit: 200000,  heldValue: 95000,  returnConfBase: 65, utilBase: 63, minPayment: 0,       policyRef: 'Credit Policy §3.1' },
  'Riverside Sports Co':   { totalExposure: 60000,   creditLimit: 100000,  heldValue: 27800,  returnConfBase: 80, utilBase: 35, minPayment: 0,       policyRef: 'Credit Policy §2.4' },
  'Summit Athletics':      { totalExposure: 22000,   creditLimit: 40000,   heldValue: 15600,  returnConfBase: 88, utilBase: 62, minPayment: 0,       policyRef: 'Credit Policy §2.4' },
};

const dealerNames = Object.keys(dealerBaselines);

function fmtM(n) {
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000)    return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function deltaLabel(d) {
  if (d === 0)  return `= $0K`;
  if (d > 0)    return `↑ ${fmtM(d)}`;
  return `↓ ${fmtM(Math.abs(d))}`;
}

// ── Dealer-Level Tab ──────────────────────────────────────────────────────────

function DealerTab() {
  const [dealer,           setDealer]           = useState(dealerNames[0]);
  const [payment,          setPayment]           = useState(0);
  const [disputeAmt,       setDisputeAmt]        = useState(0);
  const [returnConf,       setReturnConf]        = useState(70);
  const [utilThreshold,    setUtilThreshold]     = useState(85);

  const base = dealerBaselines[dealer];

  function reset() {
    setPayment(0);
    setDisputeAmt(0);
    setReturnConf(70);
    setUtilThreshold(85);
  }

  const sim = useMemo(() => {
    const newExposure      = Math.max(0, base.totalExposure - payment - disputeAmt);
    const newAvailCredit   = Math.max(0, base.creditLimit - newExposure);
    const baseAvailCredit  = Math.max(0, base.creditLimit - base.totalExposure);
    const confBoost        = Math.max(0, returnConf - base.returnConfBase) / 100;
    const heldReduction    = Math.round(base.heldValue * confBoost * 0.6);
    const newHeldValue     = Math.max(0, base.heldValue - heldReduction);
    const newUtil          = Math.round((newExposure / base.creditLimit) * 100);
    const canRelease       = payment >= base.minPayment && newUtil <= utilThreshold && returnConf >= base.returnConfBase;

    return {
      newExposure, newAvailCredit, baseAvailCredit,
      newHeldValue, heldReduction, newUtil, canRelease,
      exposureDelta:     newExposure - base.totalExposure,
      availCreditDelta:  newAvailCredit - baseAvailCredit,
      heldDelta:         newHeldValue - base.heldValue,
    };
  }, [dealer, payment, disputeAmt, returnConf, utilThreshold, base]);

  return (
    <>
      {/* ── Inputs card ── */}
      <div className="sim-card">
        <div className="sim-section-title">Inputs</div>

        <div className="sim-inputs-grid">
          {/* Dealer */}
          <div className="sim-input-group">
            <div className="sim-input-label">Dealer</div>
            <div className="cases-select-wrap">
              <select
                className="cases-select sim-full-select"
                value={dealer}
                onChange={e => { setDealer(e.target.value); reset(); }}
              >
                {dealerNames.map(n => <option key={n}>{n}</option>)}
              </select>
              <svg className="cases-select-chevron" width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Payment receipt */}
          <div className="sim-input-group">
            <div className="sim-input-label">Payment receipt ($)</div>
            <input
              type="number"
              className="sim-number-input"
              min={0}
              value={payment}
              onChange={e => setPayment(Math.max(0, Number(e.target.value)))}
              placeholder="0"
            />
          </div>

          {/* Dispute resolution */}
          <div className="sim-input-group">
            <div className="sim-input-label">Dispute resolution amount ($)</div>
            <input
              type="number"
              className="sim-number-input"
              min={0}
              value={disputeAmt}
              onChange={e => setDisputeAmt(Math.max(0, Number(e.target.value)))}
              placeholder="0"
            />
          </div>

          {/* Return confidence */}
          <div className="sim-input-group">
            <div className="sim-input-label-row">
              <span>Return confidence ({returnConf}%)</span>
              <span className="sim-current-label">Current: {base.returnConfBase}%</span>
            </div>
            <input
              type="range" min={0} max={100} step={1}
              value={returnConf}
              onChange={e => setReturnConf(Number(e.target.value))}
              className="sim-slider"
            />
          </div>

          {/* Utilization threshold — full width */}
          <div className="sim-input-group sim-span-2">
            <div className="sim-input-label-row">
              <span>Utilization threshold ({utilThreshold}%)</span>
              <span className="sim-current-label">Current policy: {base.utilBase}%</span>
            </div>
            <input
              type="range" min={50} max={100} step={1}
              value={utilThreshold}
              onChange={e => setUtilThreshold(Number(e.target.value))}
              className="sim-slider"
            />
          </div>

          {/* Reset — right aligned full width */}
          <div className="sim-span-2 sim-reset-row">
            <button className="btn-outline sim-reset-btn" onClick={reset}>Reset</button>
          </div>
        </div>
      </div>

      {/* ── Impact preview card ── */}
      <div className="sim-card">
        <div className="sim-section-title">Impact preview</div>

        <div className="sim-kpi-row">
          {/* Total Exposure */}
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Total Exposure</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{fmtM(base.totalExposure)}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{fmtM(sim.newExposure)}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.exposureDelta < 0 ? 'sim-delta-good' : sim.exposureDelta > 0 ? 'sim-delta-bad' : ''}`}>
              {deltaLabel(sim.exposureDelta)}
            </div>
          </div>

          {/* Available Credit */}
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Available Credit</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{fmtM(sim.baseAvailCredit)}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{fmtM(sim.newAvailCredit)}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.availCreditDelta > 0 ? 'sim-delta-good' : sim.availCreditDelta < 0 ? 'sim-delta-bad' : ''}`}>
              {deltaLabel(sim.availCreditDelta)}
            </div>
          </div>

          {/* Held-Order Impact */}
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Held-Order Impact</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{fmtM(base.heldValue)}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{fmtM(sim.newHeldValue)}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.heldDelta < 0 ? 'sim-delta-good' : ''}`}>
              {deltaLabel(sim.heldDelta)}
            </div>
          </div>

          {/* Release Eligibility */}
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Release Eligibility</div>
            <div className="sim-kpi-eligibility">
              {sim.canRelease
                ? <span className="sim-badge-release">Release eligible</span>
                : <span className="sim-badge-hold">Hold required</span>
              }
            </div>
            <div className="sim-kpi-policy">Policy ref: {base.policyRef}</div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="sim-disclaimer-text">
        Simulation uses configurable thresholds and the active dealer factor set. No data is changed — this is a what-if preview only.
      </div>
    </>
  );
}

// ── Policy-Level Tab ──────────────────────────────────────────────────────────

const SEGMENTS    = ['All Dealers', 'Tier A', 'Tier B', 'Tier C', 'Tier D'];
const SLA_OPTIONS = [48, 72, 96, 120];

const portfolioBaseline = { totalExposure: 3154000, creditLimit: 3845000, heldValue: 558400, orders: 8 };

function PolicyTab() {
  const [segment,        setSegment]        = useState('All Dealers');
  const [utilizationCap, setUtilizationCap] = useState(85);
  const [slaHours,       setSlaHours]       = useState(96);
  const [agingTrigger,   setAgingTrigger]   = useState(60);
  const [payThreshold,   setPayThreshold]   = useState(10000);

  function reset() {
    setSegment('All Dealers'); setUtilizationCap(85);
    setSlaHours(96); setAgingTrigger(60); setPayThreshold(10000);
  }

  const sim = useMemo(() => {
    const factor        = segment === 'All Dealers' ? 1 : 0.4;
    const released      = utilizationCap > 85 ? Math.round(portfolioBaseline.heldValue * 0.3 * factor) : 0;
    const newHeld       = portfolioBaseline.heldValue - released;
    const newExposure   = portfolioBaseline.totalExposure - released;
    const newAvail      = portfolioBaseline.creditLimit - newExposure;
    const baseAvail     = portfolioBaseline.creditLimit - portfolioBaseline.totalExposure;
    const newHolds      = slaHours < 96 ? 2 : 0;
    const releaseOrders = utilizationCap > 85 ? Math.round(portfolioBaseline.orders * 0.3 * factor) : 0;
    return { released, newHeld, newExposure, newAvail, baseAvail, newHolds, releaseOrders,
      exposureDelta: newExposure - portfolioBaseline.totalExposure,
      availDelta:    newAvail    - baseAvail,
      heldDelta:     newHeld     - portfolioBaseline.heldValue,
    };
  }, [segment, utilizationCap, slaHours, agingTrigger, payThreshold]);

  return (
    <>
      <div className="sim-card">
        <div className="sim-section-title">Inputs</div>
        <div className="sim-inputs-grid">

          {/* Segment */}
          <div className="sim-input-group sim-span-2">
            <div className="sim-input-label">Portfolio Segment</div>
            <div className="sim-pill-row">
              {SEGMENTS.map(s => (
                <button key={s} className={`sim-pill-btn ${segment === s ? 'sim-pill-active' : ''}`}
                  onClick={() => setSegment(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Utilization cap */}
          <div className="sim-input-group sim-span-2">
            <div className="sim-input-label-row">
              <span>Credit utilisation cap ({utilizationCap}%)</span>
              <span className="sim-current-label">Current policy: 85%</span>
            </div>
            <input type="range" min={50} max={100} step={1} value={utilizationCap}
              onChange={e => setUtilizationCap(Number(e.target.value))} className="sim-slider" />
          </div>

          {/* SLA hours */}
          <div className="sim-input-group">
            <div className="sim-input-label">SLA Target Hours</div>
            <div className="sim-pill-row">
              {SLA_OPTIONS.map(h => (
                <button key={h} className={`sim-pill-btn ${slaHours === h ? 'sim-pill-active' : ''}`}
                  onClick={() => setSlaHours(h)}>{h}h</button>
              ))}
            </div>
          </div>

          {/* Aging trigger */}
          <div className="sim-input-group">
            <div className="sim-input-label">AR Aging Hold Trigger</div>
            <div className="sim-pill-row">
              {[30, 60, 90].map(d => (
                <button key={d} className={`sim-pill-btn ${agingTrigger === d ? 'sim-pill-active' : ''}`}
                  onClick={() => setAgingTrigger(d)}>{d}+ days</button>
              ))}
            </div>
          </div>

          {/* Payment threshold */}
          <div className="sim-input-group sim-span-2">
            <div className="sim-input-label-row">
              <span>Auto-release payment threshold ({fmtM(payThreshold)})</span>
              <span className="sim-current-label">Current: {fmtM(10000)}</span>
            </div>
            <input type="range" min={0} max={50000} step={1000} value={payThreshold}
              onChange={e => setPayThreshold(Number(e.target.value))} className="sim-slider" />
          </div>

          <div className="sim-span-2 sim-reset-row">
            <button className="btn-outline sim-reset-btn" onClick={reset}>Reset</button>
          </div>
        </div>
      </div>

      <div className="sim-card">
        <div className="sim-section-title">Impact preview</div>
        <div className="sim-kpi-row">
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Total Exposure</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{fmtM(portfolioBaseline.totalExposure)}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{fmtM(sim.newExposure)}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.exposureDelta < 0 ? 'sim-delta-good' : ''}`}>
              {deltaLabel(sim.exposureDelta)}
            </div>
          </div>
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Available Credit</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{fmtM(sim.baseAvail)}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{fmtM(sim.newAvail)}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.availDelta > 0 ? 'sim-delta-good' : ''}`}>
              {deltaLabel(sim.availDelta)}
            </div>
          </div>
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Held-Order Impact</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{fmtM(portfolioBaseline.heldValue)}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{fmtM(sim.newHeld)}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.heldDelta < 0 ? 'sim-delta-good' : ''}`}>
              {deltaLabel(sim.heldDelta)}
            </div>
          </div>
          <div className="sim-kpi-cell">
            <div className="sim-kpi-heading">Orders Released</div>
            <div className="sim-kpi-values">
              <span className="sim-kpi-old">{portfolioBaseline.orders}</span>
              <span className="sim-kpi-arrow">→</span>
              <span className="sim-kpi-new">{portfolioBaseline.orders - sim.releaseOrders + sim.newHolds}</span>
            </div>
            <div className={`sim-kpi-delta ${sim.releaseOrders > 0 ? 'sim-delta-good' : ''}`}>
              {sim.releaseOrders > 0 ? `↓ ${sim.releaseOrders} held` : '= no change'}
            </div>
          </div>
        </div>
      </div>

      <div className="sim-disclaimer-text">
        Simulation uses configurable thresholds and the active dealer factor set. No data is changed — this is a what-if preview only.
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SimulationStudio() {
  const [activeTab, setActiveTab] = useState('dealer');

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="sim-page-header">
        <FlaskConical size={28} className="sim-page-icon" />
        <div>
          <div className="sim-page-title">Simulation &amp; What-If Studio</div>
          <div className="sim-page-sub">
            Model the impact of payments, dispute resolution, return-confidence changes, and policy changes before acting.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sim-tabbar">
        <button className={`sim-tab-btn ${activeTab === 'dealer' ? 'sim-tab-active' : ''}`}
          onClick={() => setActiveTab('dealer')}>Dealer-Level</button>
        <button className={`sim-tab-btn ${activeTab === 'policy' ? 'sim-tab-active' : ''}`}
          onClick={() => setActiveTab('policy')}>Policy-Level</button>
      </div>

      {activeTab === 'dealer' && <DealerTab />}
      {activeTab === 'policy' && <PolicyTab />}
    </div>
  );
}
