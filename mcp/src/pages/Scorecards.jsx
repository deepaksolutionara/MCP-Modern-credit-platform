import React from 'react';
import { ChartColumn, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import '../App.css';
import { sections } from '../data/scorecardsData';

const TREND_CONFIG = {
  up: {
    Icon: TrendingUp,
    className: 'sco-trend-up',
  },
  down: {
    Icon: TrendingDown,
    className: 'sco-trend-dn',
  },
  flat: {
    Icon: Minus,
    className: 'sco-trend-fl',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function TrendLine({ trend, text }) {
  const { Icon, className } = TREND_CONFIG[trend] || TREND_CONFIG.flat;

  return (
    <div className={`sco-trend ${className}`}>
      <Icon size={13} />
      {text}
    </div>
  );
}

const MetricCard = React.memo(function MetricCard({ metric, value, target, trend, trendText }) {
  return (
    <div className="sco-card">
      <div className="sco-card-top">
        <span className="sco-metric-label">{metric}</span>
        <span className="sco-target-pill">{target}</span>
      </div>
      <div className="sco-value">{value}</div>
      <TrendLine trend={trend} text={trendText} />
    </div>
  );
});

// ── SectionBlock ──────────────────────────────────────────────────────────────

function SectionBlock({ section }) {
  return (
    <div className="sco-section">
      <div className="sco-section-label">{section.label}</div>
      <div className={`sco-grid sco-grid-${section.cols}`}>
        {section.cards.map(card => (
          <MetricCard key={card.metric} {...card} />
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Scorecards() {
  return (
    <div className="dashboard">

      <PageHeader
        icon={<ChartColumn size={20} color="#3b82f6" />}
        title="Operations Scorecards"
        subtitle="Embedded management visibility across collector productivity, dispute cycle time, PTP outcomes, auto-release, recovery, held-order revenue, and rule changes."
      />

      {sections.map(section => (
        <SectionBlock key={section.label} section={section} />
      ))}

    </div>
  );
}
