export const kpis = [
  { value: '1',           label: 'Orders under review',   icon: 'Briefcase',     color: '#3b82f6', bg: '#eff6ff' },
  { value: '2',           label: 'Held orders awaiting',  icon: 'Package',       color: '#f97316', bg: '#fff7ed' },
  { value: '2',           label: 'Near SLA breach',        icon: 'Clock',         color: '#f59e0b', bg: '#fffbeb' },
  { value: '1',           label: 'Breached SLA',           icon: 'AlertTriangle', color: '#ef4444', bg: '#fef2f2' },
  { value: '1',           label: 'Recently auto-released', icon: 'CheckCircle2',  color: '#22c55e', bg: '#f0fdf4' },
  { value: '2',           label: 'Escalation queue',       icon: 'ArrowUpRight',  color: '#ef4444', bg: '#fef2f2' },
  { value: '6 (2 hold)',  label: 'Re-decisions (24h)',    icon: 'RefreshCw',     color: '#3b82f6', bg: '#eff6ff' },
  { value: '$887K (1 crit)', label: 'Past-due AR',         icon: 'ShieldAlert',   color: '#e11d48', bg: '#fff1f2' },
  { value: '1',           label: 'Pending referrals',      icon: 'ArrowUpRight',  color: '#f97316', bg: '#fff7ed' },
];

export const slaHotlist = [
  { id: 'CASE-2506', status: 'Escalated',                priority: 'Critical', dealerName: 'Alpine Equipment Co',  slaTargetHours: 96, slaElapsedHours: 132 },
  { id: 'CASE-2504', status: 'Waiting on Dealer',         priority: 'Medium',   dealerName: 'ProGear Distribution', slaTargetHours: 96, slaElapsedHours: 94  },
  { id: 'CASE-2501', status: 'Escalated',                priority: 'Critical', dealerName: 'Alpine Equipment Co',  slaTargetHours: 96, slaElapsedHours: 92  },
  { id: 'CASE-2502', status: 'In Review',                priority: 'High',     dealerName: 'ProGear Distribution', slaTargetHours: 96, slaElapsedHours: 52  },
  { id: 'CASE-2503', status: 'Waiting on Return Update',  priority: 'Medium',   dealerName: 'SportMax Dealers',     slaTargetHours: 96, slaElapsedHours: 44  },
];

export const ruleChanges = [
  { rule: 'R-THR-001', oldVal: '80%', newVal: '85%', author: 'M. Patel', time: '369d ago' },
  { rule: 'R-SLA-001', oldVal: '96h', newVal: '72h', author: 'M. Patel', time: '371d ago' },
];

export const autoReleases = [
  {
    dealer:  'Peak Outdoors',
    orderId: 'ORD-77298',
    reason:  'Qualifying payment received; policy criteria met',
    badge:   'AUTO-RELEASE-PAYMENT',
    time:    '370d ago',
  },
];
