/**
 * scorecardsData.js
 *
 * Static data for the Operations Scorecards page.
 * Each section has a label, a column count for the grid, and an array of
 * metric cards.
 *
 * Card shape:
 *   metric    – display name of the KPI
 *   value     – current value string
 *   target    – target label shown as a pill
 *   trend     – 'up' | 'down' | 'flat'  (up = green, down = red, flat = gray)
 *   trendText – short description of the trend (e.g. "+1.2 vs prior week")
 */

export const sections = [
  {
    label: 'COLLECTOR PRODUCTIVITY',
    cols: 3,
    cards: [
      { metric: 'Touches per collector / day',     value: '12.4',   target: 'Target 12+',     trend: 'up',   trendText: '+1.2 vs prior week'   },
      { metric: 'Cases worked / collector / day',  value: '6.1',    target: 'Target 6+',      trend: 'up',   trendText: '+0.4 vs prior week'   },
      { metric: 'Avg days to resolve held orders', value: '2.3 d',  target: 'Target ≤ 2 d',   trend: 'down', trendText: '-0.4 d vs last month' },
    ],
  },
  {
    label: 'DISPUTE',
    cols: 2,
    cards: [
      { metric: 'Avg dispute cycle time',          value: '3 d',    target: 'Target ≤ 5 d',   trend: 'flat', trendText: 'Stable'               },
      { metric: 'Disputes overdue (SLA breach)',   value: '5',      target: 'Target 0',        trend: 'down', trendText: '-1 vs last week'      },
    ],
  },
  {
    label: 'PROMISE TO PAY',
    cols: 3,
    cards: [
      { metric: 'PTPs kept',                       value: '0',      target: 'Target —',        trend: 'up',   trendText: '+2 vs last month'     },
      { metric: 'PTPs broken',                     value: '1',      target: 'Target —',        trend: 'flat', trendText: 'Stable'               },
      { metric: 'PTP-kept rate',                   value: '0%',     target: 'Target ≥ 65%',    trend: 'up',   trendText: '+4pp vs last month'   },
    ],
  },
  {
    label: 'AUTO-RELEASE',
    cols: 2,
    cards: [
      { metric: 'Auto-release rate',               value: '100%',   target: 'Target ≥ 30%',    trend: 'up',   trendText: '+6pp vs last month'   },
      { metric: 'Avg time to auto-release',        value: '44 min', target: 'Target ≤ 60 min', trend: 'down', trendText: '-12 min'              },
    ],
  },
  {
    label: 'RECOVERY',
    cols: 3,
    cards: [
      { metric: 'External referral recovery yield', value: '17%',  target: 'Target ≥ 50%',    trend: 'up',   trendText: '+3pp vs last quarter' },
      { metric: 'Net recovery (after fees)',         value: '$47K', target: 'Target —',        trend: 'up',   trendText: '+$18K'                },
      { metric: 'Active external referrals',         value: '2',   target: 'Target —',        trend: 'flat', trendText: 'Stable'               },
    ],
  },
  {
    label: 'HELD ORDERS',
    cols: 2,
    cards: [
      { metric: 'Revenue currently blocked',        value: '$710K', target: 'Target —',        trend: 'down', trendText: '-$95K vs last week'   },
      { metric: 'Revenue released this week',       value: '$310K', target: 'Target —',        trend: 'up',   trendText: '+$120K'               },
    ],
  },
  {
    label: 'RULE CHANGE',
    cols: 2,
    cards: [
      { metric: 'Rule changes (30 d)',              value: '7',    target: 'Target —',         trend: 'up',   trendText: '+2 vs prior month'    },
      { metric: 'Rule rollbacks (30 d)',            value: '1',    target: 'Target 0',         trend: 'flat', trendText: 'Stable'               },
    ],
  },
];
