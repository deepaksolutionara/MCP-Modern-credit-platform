import React, { useState, useMemo } from 'react';
import '../App.css';
import { FlaskConical } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import SimKpiCard from '../common/SimKpiCard';
import { SelectInput, NumberInput, RangeInput, PillGroup } from '../components/simulationstudio/SimInputs';
import { formatCurrencyShort, deltaLabel } from '../utils/formatters';

// ── Dealer baseline data ──────────────────────────────────────────────────────

const dealerBaselines = {
  'Alpine Equipment Co':   { totalExposure: 2300000, creditLimit: 2500000, heldValue: 240000, returnConfBase: 58, utilBase: 85, minPayment: 200000, policyRef: 'Credit Policy §4.2' },
  'ProGear Distribution':  { totalExposure: 420000,  creditLimit: 500000,  heldValue: 180000, returnConfBase: 72, utilBase: 80, minPayment: 18500,  policyRef: 'Credit Policy §3.1' },
  'SportMax Dealers':      { totalExposure: 150000,  creditLimit: 200000,  heldValue: 95000,  returnConfBase: 65, utilBase: 63, minPayment: 0,       policyRef: 'Credit Policy §3.1' },
  'Riverside Sports Co':   { totalExposure: 60000,   creditLimit: 100000,  heldValue: 27800,  returnConfBase: 80, utilBase: 35, minPayment: 0,       policyRef: 'Credit Policy §2.4' },
  'Summit Athletics':      { totalExposure: 22000,   creditLimit: 40000,   heldValue: 15600,  returnConfBase: 88, utilBase: 62, minPayment: 0,       policyRef: 'Credit Policy §2.4' },
};

const SIM_TABS = [
  { key: 'dealer', label: 'Dealer-Level', Component: DealerTab },
  { key: 'policy', label: 'Policy-Level', Component: PolicyTab },
];

const dealerNames = Object.keys(dealerBaselines);

// fmtM is a local alias kept for brevity inside this file.
const fmtM = formatCurrencyShort;

// ── Dealer-Level Tab ──────────────────────────────────────────────────────────

const DEALER_DEFAULTS = {
  payment:       0,
  disputeAmt:    0,
  returnConf:    70,
  utilThreshold: 85,
};

function DealerTab() {
  const [dealer, setDealer] = useState(dealerNames[0]);
  const [inputs, setInputs] = useState(DEALER_DEFAULTS);

  const base = dealerBaselines[dealer];

  function updateInput(key, value) {
    setInputs(prev => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(DEALER_DEFAULTS);
  }

  const { payment, disputeAmt, returnConf, utilThreshold } = inputs;

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
      exposureDelta:    newExposure - base.totalExposure,
      availCreditDelta: newAvailCredit - baseAvailCredit,
      heldDelta:        newHeldValue - base.heldValue,
    };
  // `base` is derived from `dealer` so listing both would be redundant.
  }, [dealer, payment, disputeAmt, returnConf, utilThreshold]);

  return (
    <>
      {/* ── Inputs card ── */}
      <div className="sim-card">
        <div className="sim-section-title">Inputs</div>

        <div className="sim-inputs-grid">
          <SelectInput
            label="Dealer"
            options={dealerNames}
            value={dealer}
            onChange={v => { setDealer(v); reset(); }}
          />

          <NumberInput
            label="Payment receipt ($)"
            value={payment}
            onChange={v => updateInput('payment', v)}
          />

          <NumberInput
            label="Dispute resolution amount ($)"
            value={disputeAmt}
            onChange={v => updateInput('disputeAmt', v)}
          />

          <RangeInput
            label="Return confidence"
            value={returnConf}
            min={0} max={100}
            currentLabel={`Current: ${base.returnConfBase}%`}
            onChange={v => updateInput('returnConf', v)}
            span={1}
          />

          <RangeInput
            label="Utilization threshold"
            value={utilThreshold}
            min={50} max={100}
            currentLabel={`Current policy: ${base.utilBase}%`}
            onChange={v => updateInput('utilThreshold', v)}
          />

          <div className="sim-span-2 sim-reset-row">
            <button className="btn-outline sim-reset-btn" onClick={reset}>Reset</button>
          </div>
        </div>
      </div>

      {/* ── Impact preview card ── */}
      <div className="sim-card">
        <div className="sim-section-title">Impact preview</div>

        {(() => {
          const dealerKpis = [
            {
              heading:    'Total Exposure',
              oldValue:   fmtM(base.totalExposure),
              newValue:   fmtM(sim.newExposure),
              delta:      deltaLabel(sim.exposureDelta),
              deltaClass: sim.exposureDelta < 0 ? 'sim-delta-good' : sim.exposureDelta > 0 ? 'sim-delta-bad' : '',
            },
            {
              heading:    'Available Credit',
              oldValue:   fmtM(sim.baseAvailCredit),
              newValue:   fmtM(sim.newAvailCredit),
              delta:      deltaLabel(sim.availCreditDelta),
              deltaClass: sim.availCreditDelta > 0 ? 'sim-delta-good' : sim.availCreditDelta < 0 ? 'sim-delta-bad' : '',
            },
            {
              heading:    'Held-Order Impact',
              oldValue:   fmtM(base.heldValue),
              newValue:   fmtM(sim.newHeldValue),
              delta:      deltaLabel(sim.heldDelta),
              deltaClass: sim.heldDelta < 0 ? 'sim-delta-good' : '',
            },
          ];

          return (
            <div className="sim-kpi-row">
              {dealerKpis.map(k => (
                <SimKpiCard key={k.heading} {...k} />
              ))}

              {/* Release Eligibility uses custom content via children */}
              <SimKpiCard heading="Release Eligibility">
                <div className="sim-kpi-eligibility">
                  {sim.canRelease
                    ? <span className="sim-badge-release">Release eligible</span>
                    : <span className="sim-badge-hold">Hold required</span>
                  }
                </div>
                <div className="sim-kpi-policy">Policy ref: {base.policyRef}</div>
              </SimKpiCard>
            </div>
          );
        })()}
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
  // agingTrigger and payThreshold are not used in the formula — omitted.
  }, [segment, utilizationCap, slaHours]);

  return (
    <>
      <div className="sim-card">
        <div className="sim-section-title">Inputs</div>
        <div className="sim-inputs-grid">

          <PillGroup
            label="Portfolio Segment"
            options={SEGMENTS}
            value={segment}
            onChange={setSegment}
            span={2}
          />

          <RangeInput
            label="Credit utilisation cap"
            value={utilizationCap}
            min={50} max={100}
            currentLabel="Current policy: 85%"
            onChange={setUtilizationCap}
          />

          <PillGroup
            label="SLA Target Hours"
            options={SLA_OPTIONS}
            value={slaHours}
            formatOption={h => `${h}h`}
            onChange={setSlaHours}
          />

          <PillGroup
            label="AR Aging Hold Trigger"
            options={[30, 60, 90]}
            value={agingTrigger}
            formatOption={d => `${d}+ days`}
            onChange={setAgingTrigger}
          />

          <RangeInput
            label="Auto-release payment threshold"
            value={payThreshold}
            min={0} max={50000} step={1000}
            formatValue={fmtM}
            currentLabel={`Current: ${fmtM(10000)}`}
            onChange={setPayThreshold}
          />

          <div className="sim-span-2 sim-reset-row">
            <button className="btn-outline sim-reset-btn" onClick={reset}>Reset</button>
          </div>
        </div>
      </div>

      <div className="sim-card">
        <div className="sim-section-title">Impact preview</div>

        {(() => {
          const policyKpis = [
            {
              heading:    'Total Exposure',
              oldValue:   fmtM(portfolioBaseline.totalExposure),
              newValue:   fmtM(sim.newExposure),
              delta:      deltaLabel(sim.exposureDelta),
              deltaClass: sim.exposureDelta < 0 ? 'sim-delta-good' : '',
            },
            {
              heading:    'Available Credit',
              oldValue:   fmtM(sim.baseAvail),
              newValue:   fmtM(sim.newAvail),
              delta:      deltaLabel(sim.availDelta),
              deltaClass: sim.availDelta > 0 ? 'sim-delta-good' : '',
            },
            {
              heading:    'Held-Order Impact',
              oldValue:   fmtM(portfolioBaseline.heldValue),
              newValue:   fmtM(sim.newHeld),
              delta:      deltaLabel(sim.heldDelta),
              deltaClass: sim.heldDelta < 0 ? 'sim-delta-good' : '',
            },
            {
              heading:    'Orders Released',
              oldValue:   String(portfolioBaseline.orders),
              newValue:   String(portfolioBaseline.orders - sim.releaseOrders + sim.newHolds),
              delta:      sim.releaseOrders > 0 ? `↓ ${sim.releaseOrders} held` : '= no change',
              deltaClass: sim.releaseOrders > 0 ? 'sim-delta-good' : '',
            },
          ];

          return (
            <div className="sim-kpi-row">
              {policyKpis.map(k => <SimKpiCard key={k.heading} {...k} />)}
            </div>
          );
        })()}
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
  const ActiveTab = SIM_TABS.find(tab => tab.key === activeTab)?.Component;
  return (
    <div className="dashboard">

      <PageHeader
        icon={<FlaskConical size={20} color="#3b82f6" />}
        title="Simulation & What-If Studio"
        subtitle="Model the impact of payments, dispute resolution, return-confidence changes, and policy changes before acting."
      />

      {/* Tabs */}

<div className="sim-tabbar">
  {SIM_TABS.map(tab => (
    <button
      key={tab.key}
      className={`sim-tab-btn ${activeTab === tab.key ? 'sim-tab-active' : ''}`}
      onClick={() => setActiveTab(tab.key)}
    >
      {tab.label}
    </button>
  ))}
</div>

{ActiveTab && <ActiveTab />}
    </div>
  );
}
