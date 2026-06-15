export const casesBase = [
  { id: 'CASE-2506', orderId: 'ORD-77260', decId: 'DEC-9001', dealer: 'Alpine Equipment Co',    accountNo: 'DLR-001', priority: 'Critical', status: 'Escalated',                owner: 'Jane Doe',    team: 'Escalation', slaHoursLeft: -36, slaTotalHours: 96, createdAgo: '374d ago' },
  { id: 'CASE-2504', orderId: 'ORD-77351', decId: 'DEC-9002', dealer: 'ProGear Distribution',   accountNo: 'DLR-002', priority: 'Medium',   status: 'Waiting on Dealer',         owner: 'Unassigned',  team: 'Credit Ops', slaHoursLeft: 2,   slaTotalHours: 72, createdAgo: '372d ago' },
  { id: 'CASE-2501', orderId: 'ORD-77321', decId: 'DEC-9001', dealer: 'Alpine Equipment Co',    accountNo: 'DLR-001', priority: 'Critical', status: 'Escalated',                owner: 'Jane Doe',    team: 'Escalation', slaHoursLeft: 4,   slaTotalHours: 48, createdAgo: '371d ago' },
  { id: 'CASE-2505', orderId: 'ORD-77298', decId: 'DEC-9005', dealer: 'Peak Outdoors',          accountNo: 'DLR-005', priority: 'Low',      status: 'Auto-Released',             owner: 'System',      team: 'Credit Ops', slaHoursLeft: 20,  slaTotalHours: 24, createdAgo: '372d ago' },
  { id: 'CASE-2502', orderId: 'ORD-77342', decId: 'DEC-9002', dealer: 'ProGear Distribution',   accountNo: 'DLR-002', priority: 'High',     status: 'In Review',                 owner: 'Mike Chen',   team: 'Credit Ops', slaHoursLeft: 44,  slaTotalHours: 72, createdAgo: '371d ago' },
  { id: 'CASE-2503', orderId: 'ORD-77390', decId: 'DEC-9003', dealer: 'SportMax Dealers',       accountNo: 'DLR-003', priority: 'Medium',   status: 'Waiting on Return Update',  owner: 'Jane Doe',    team: 'Credit Ops', slaHoursLeft: 52,  slaTotalHours: 72, createdAgo: '371d ago' },
  { id: 'CASE-2499', orderId: 'ORD-77280', decId: 'DEC-9006', dealer: 'Summit Athletics',       accountNo: 'DLR-101', priority: 'Low',      status: 'New',                       owner: 'R. Torres',   team: 'Credit Ops', slaHoursLeft: 72,  slaTotalHours: 96, createdAgo: '370d ago' },
  { id: 'CASE-2498', orderId: 'ORD-77265', decId: 'DEC-9007', dealer: 'Riverside Sports Co',    accountNo: 'DLR-102', priority: 'High',     status: 'Near Breach',               owner: 'M. Patel',    team: 'Credit Ops', slaHoursLeft: 3,   slaTotalHours: 96, createdAgo: '369d ago' },
  { id: 'CASE-2495', orderId: 'ORD-77241', decId: 'DEC-9008', dealer: 'Summit Athletics',       accountNo: 'DLR-101', priority: 'Medium',   status: 'Near Breach',               owner: 'S. Chen',     team: 'Credit Ops', slaHoursLeft: 6,   slaTotalHours: 72, createdAgo: '368d ago' },
  { id: 'CASE-2492', orderId: 'ORD-77210', decId: 'DEC-9009', dealer: 'Coastal Athletics',      accountNo: 'DLR-103', priority: 'High',     status: 'In Review',                 owner: 'R. Torres',   team: 'Credit Ops', slaHoursLeft: 18,  slaTotalHours: 96, createdAgo: '367d ago' },
  { id: 'CASE-2489', orderId: 'ORD-77190', decId: 'DEC-9010', dealer: 'Nordic Sports Ltd',      accountNo: 'DLR-104', priority: 'Critical', status: 'Breached SLA',              owner: 'R. Torres',   team: 'Escalation', slaHoursLeft: -12, slaTotalHours: 96, createdAgo: '365d ago' },
  { id: 'CASE-2477', orderId: 'ORD-77098', decId: 'DEC-9011', dealer: 'Peak Outdoors',          accountNo: 'DLR-005', priority: 'Low',      status: 'Closed',                    owner: 'M. Patel',    team: 'Credit Ops', slaHoursLeft: 88,  slaTotalHours: 96, createdAgo: '362d ago' },
];

export const caseDetails = {
  'CASE-2506': {
    type: 'Credit Review',
    escalatedTo: 'Finance Leadership',
    lastEvaluated: '394d ago',
    creditPolicy: 'Credit Policy v1.8',
    dueDate: '21/4/2025',
    description: 'Credit review escalated due to 36h SLA breach. Alpine Equipment Co has an outstanding past-due balance of $580K.',
    drivers: [
      { term: 'Past Due',          desc: 'Past due > $500K with 90+ day balance' },
      { term: 'Credit Threshold',  desc: 'Utilization 92% exceeds 85% threshold' },
      { term: 'Liquidity',         desc: 'Liquidity flag raised by engine' },
    ],
    nextActions: [
      'SLA breached — escalate or close immediately',
      'Currently 36.0h over target',
    ],
    decisionContext: {
      outcome: 'Hold-Payment',
      engineScore: 38,
      engineGrade: 'D',
      workflow: 'Escalated',
      reasonCodes: [
        { code: 'PD-90', description: 'Past Due: 90+ day balance' },
      ],
      thresholdBreaches: [
        { rule: 'Utilization', threshold: '85%',  actual: '92%'  },
        { rule: 'Past Due',    threshold: '$250K', actual: '$580K' },
      ],
    },
    timeline: [
      { action: 'SLA breached',            detail: 'Elapsed 84h vs target 48h',             user: 'System',   timeAgo: '392d ago' },
      { action: 'Case assigned to Escalation', detail: 'Transferred from Credit Ops',        user: 'Jane Doe', timeAgo: '393d ago' },
      { action: 'Case created',            detail: 'Triggered by hold on ORD-77260',         user: 'System',   timeAgo: '394d ago' },
    ],
    notes: [
      { author: 'System', timeAgo: '392d ago', text: 'SLA breached.' },
      { author: 'Jane Doe', timeAgo: '393d ago', text: 'Customer unresponsive. Escalating to collections team.' },
    ],
    resolution: null,
    invoices: [
      { id: 'INV-30005', amount: '$180K', status: 'Open' },
    ],
    invoicesTotal: '$180K',
    disputes: [
      { id: 'DISP-7003', amount: '$15K', reason: 'Short payment', status: 'Open' },
    ],
    disputesTotal: '$15K',
    financial: {
      totalAR: '$2.3M', pastDue: '$580K', creditLimit: '$2.5M', available: '$200K',
      utilization: '92%', agingTrend: 'Deteriorating',
      openOrderImpact: '$240K', pendingReturns: '$45K', liquidityFlag: true,
    },
    notifications: [
      { channel: 'Credit_Team', timeAgo: '392d ago', subject: 'SLA breached: CASE-2506', recipient: 'credit-leads@dunlop.com' },
    ],
  },

  'CASE-2504': {
    type: 'Credit Review',
    escalatedTo: null,
    lastEvaluated: '372d ago',
    creditPolicy: 'Credit Policy v1.8',
    dueDate: '19/4/2025',
    description: 'Order ORD-77351 on hold pending dealer response. Awaiting payment commitment.',
    drivers: [
      { term: 'Payment Commitment', desc: 'No payment commitment received in 48h' },
      { term: 'Utilization',        desc: 'Credit utilization at 82% of $1.2M limit' },
    ],
    nextActions: [
      'Follow up with AP contact at ProGear',
      'Escalate if no response by 2025-04-18',
    ],
    decisionContext: {
      outcome: 'On Hold',
      engineScore: 55,
      engineGrade: 'C',
      workflow: 'Credit Review',
      reasonCodes: [
        { code: 'AWAIT-COM', description: 'Awaiting dealer commitment' },
        { code: 'UTIL-82',   description: 'Utilization > 80%' },
      ],
      thresholdBreaches: [
        { rule: 'Utilization',       threshold: '80%', actual: '82%' },
        { rule: 'Response Deadline', threshold: '24h', actual: '48h' },
      ],
    },
    timeline: [
      { action: 'Reminder sent to dealer', detail: 'Auto-reminder via email',               user: 'System',   timeAgo: '371d ago' },
      { action: 'Status updated',          detail: 'Waiting on Dealer — contact attempted', user: 'J. Lopez', timeAgo: '372d ago' },
      { action: 'Case created',            detail: 'Triggered by hold on ORD-77351',        user: 'System',   timeAgo: '372d ago' },
    ],
    notes: [
      { author: 'J. Lopez', timeAgo: '372d ago', text: 'Left voicemail for finance contact. Awaiting callback.' },
    ],
    resolution: null,
    invoices: [
      { id: 'INV-29401', amount: '$88K',  status: 'Open'     },
      { id: 'INV-29380', amount: '$120K', status: 'Past Due' },
    ],
    invoicesTotal: '$208K',
    disputes: [],
    disputesTotal: null,
    financial: {
      totalAR: '$980K', pastDue: '$120K', creditLimit: '$1.2M', available: '$220K',
      utilization: '82%', agingTrend: 'Stable',
      openOrderImpact: '$88K', pendingReturns: '$0', liquidityFlag: false,
    },
    notifications: [
      { channel: 'Email', timeAgo: '371d ago', subject: 'Payment commitment required – ORD-77351', recipient: 'ap@progear.com' },
    ],
  },

  'CASE-2501': {
    type: 'Credit Review',
    escalatedTo: 'Finance Leadership',
    lastEvaluated: '371d ago',
    creditPolicy: 'Credit Policy v1.8',
    dueDate: '16/4/2025',
    description: 'Return posting pending for ORD-77321. Case escalated — 4h remaining on 48h SLA.',
    drivers: [
      { term: 'RMA Pending',   desc: 'RMA-8821 not yet confirmed by warehouse' },
      { term: 'SLA Near Breach', desc: '4h remaining on 48h SLA window' },
    ],
    nextActions: [
      'Confirm RMA-8821 warehouse receipt immediately',
      'Post credit memo before SLA expires',
    ],
    decisionContext: {
      outcome: 'On Hold',
      engineScore: 44,
      engineGrade: 'D',
      workflow: 'Return Credit',
      reasonCodes: [
        { code: 'RMA-PEND', description: 'RMA processing incomplete' },
        { code: 'SLA-NEAR', description: 'Less than 12h remaining' },
      ],
      thresholdBreaches: [
        { rule: 'SLA Time Remaining', threshold: '12h', actual: '4h'  },
        { rule: 'RMA Processing SLA', threshold: '24h', actual: '36h' },
      ],
    },
    timeline: [
      { action: 'Case escalated',       detail: '4h remaining on 48h SLA',                user: 'Jane Doe', timeAgo: '370d ago' },
      { action: 'Return RMA initiated', detail: 'RMA-8821 created in JDE',                user: 'T. Kim',   timeAgo: '371d ago' },
      { action: 'Case created',         detail: 'Triggered by hold on ORD-77321',         user: 'System',   timeAgo: '371d ago' },
    ],
    notes: [
      { author: 'T. Kim', timeAgo: '371d ago', text: 'Return initiated. Awaiting warehouse confirmation before posting credit.' },
    ],
    resolution: null,
    invoices: [
      { id: 'INV-29090', amount: '$145K', status: 'Pending Return' },
    ],
    invoicesTotal: '$145K',
    disputes: [],
    disputesTotal: null,
    financial: {
      totalAR: '$2.3M', pastDue: '$580K', creditLimit: '$2.5M', available: '$200K',
      utilization: '92%', agingTrend: 'Worsening',
      openOrderImpact: '$145K', pendingReturns: '$145K', liquidityFlag: true,
    },
    notifications: [
      { channel: 'Email', timeAgo: '370d ago', subject: 'SLA near breach – CASE-2501 escalated', recipient: 'finance@alpine.com' },
    ],
  },

  'CASE-2505': {
    type: 'Credit Review',
    escalatedTo: null,
    lastEvaluated: '372d ago',
    creditPolicy: 'Credit Policy v1.8',
    dueDate: '15/4/2025',
    description: 'Order ORD-77298 auto-released after payment PAY-9200 confirmed by JDE sync.',
    drivers: [
      { term: 'Payment Confirmed', desc: 'PAY-9200 posted in JDE — full order value cleared' },
    ],
    nextActions: [
      'No action required — case auto-resolved',
    ],
    decisionContext: {
      outcome: 'Released',
      engineScore: 82,
      engineGrade: 'B',
      workflow: 'Auto-Release',
      reasonCodes: [
        { code: 'PAY-CONF', description: 'Payment confirmed via JDE sync' },
      ],
      thresholdBreaches: [],
    },
    timeline: [
      { action: 'Order auto-released',  detail: 'AUTO-RELEASE-PAYMENT trigger fired',  user: 'System', timeAgo: '372d ago' },
      { action: 'JDE sync acknowledged',detail: 'Payment posted in JDE',               user: 'System', timeAgo: '372d ago' },
      { action: 'Case created',         detail: 'Triggered by hold on ORD-77298',      user: 'System', timeAgo: '372d ago' },
    ],
    notes: [],
    resolution: 'Auto-released via payment trigger on 2025-04-15.',
    invoices: [
      { id: 'INV-29201', amount: '$34K', status: 'Paid' },
    ],
    invoicesTotal: '$34K',
    disputes: [],
    disputesTotal: null,
    financial: {
      totalAR: '$420K', pastDue: '$0', creditLimit: '$600K', available: '$180K',
      utilization: '70%', agingTrend: 'Stable',
      openOrderImpact: '$0', pendingReturns: '$0', liquidityFlag: false,
    },
    notifications: [
      { channel: 'Email', timeAgo: '372d ago', subject: 'Order ORD-77298 released – payment confirmed', recipient: 'billing@peakoutdoors.com' },
    ],
  },

  'CASE-2502': {
    type: 'Credit Review',
    escalatedTo: null,
    lastEvaluated: '371d ago',
    creditPolicy: 'Credit Policy v1.8',
    dueDate: '17/4/2025',
    description: 'ProGear Distribution utilization at 86%. Under review for temporary credit limit increase.',
    drivers: [
      { term: 'High Utilization', desc: 'At 86% of $1.2M limit — 1% over threshold' },
      { term: 'Strong History',   desc: '12-month payment record supports limit increase' },
    ],
    nextActions: [
      'Approve temporary $50K limit increase',
      'Or release order with documented override',
    ],
    decisionContext: {
      outcome: 'Under Review',
      engineScore: 62,
      engineGrade: 'C',
      workflow: 'Credit Review',
      reasonCodes: [
        { code: 'UTIL-86',   description: 'Utilization > 85%' },
        { code: 'LIMIT-INC', description: 'Limit increase candidate — strong history' },
      ],
      thresholdBreaches: [
        { rule: 'Utilization Limit', threshold: '85%', actual: '86%' },
      ],
    },
    timeline: [
      { action: 'Credit analysis started', detail: 'Reviewing 12-month payment history',  user: 'Mike Chen', timeAgo: '370d ago' },
      { action: 'Case created',            detail: 'Triggered by hold on ORD-77342',      user: 'System',    timeAgo: '371d ago' },
    ],
    notes: [
      { author: 'Mike Chen', timeAgo: '370d ago', text: 'Payment history is strong. Recommending temporary limit increase of $50K.' },
    ],
    resolution: null,
    invoices: [
      { id: 'INV-29350', amount: '$96K', status: 'Open' },
      { id: 'INV-29290', amount: '$88K', status: 'Open' },
    ],
    invoicesTotal: '$184K',
    disputes: [],
    disputesTotal: null,
    financial: {
      totalAR: '$980K', pastDue: '$40K', creditLimit: '$1.2M', available: '$168K',
      utilization: '86%', agingTrend: 'Stable',
      openOrderImpact: '$96K', pendingReturns: '$0', liquidityFlag: false,
    },
    notifications: [
      { channel: 'Email', timeAgo: '371d ago', subject: 'Account hold notice – ORD-77342', recipient: 'ap@progear.com' },
    ],
  },

  'CASE-2503': {
    type: 'Collections',
    escalatedTo: null,
    lastEvaluated: '371d ago',
    creditPolicy: 'Credit Policy v1.8',
    dueDate: '17/4/2025',
    description: 'Disputed invoice INV-30032 pending return update. Short-shipment dispute on 20 units.',
    drivers: [
      { term: 'Short Shipment', desc: '20 units missing — warehouse confirmed' },
      { term: 'RMA Pending',    desc: 'RMA-8821 not confirmed, credit memo blocked' },
    ],
    nextActions: [
      'Confirm warehouse receipt of RMA-8821',
      'Issue credit memo for 20 missing units',
    ],
    decisionContext: {
      outcome: 'Disputed',
      engineScore: 58,
      engineGrade: 'C',
      workflow: 'Dispute Resolution',
      reasonCodes: [
        { code: 'SHORT-SHP', description: 'Short shipment — 20 units' },
        { code: 'RMA-PEND',  description: 'RMA processing incomplete' },
      ],
      thresholdBreaches: [
        { rule: 'Dispute Resolution SLA', threshold: '72h', actual: '52h remaining' },
      ],
    },
    timeline: [
      { action: 'Waiting on return update', detail: 'RMA-8821 not confirmed by warehouse', user: 'Jane Doe', timeAgo: '370d ago' },
      { action: 'Dispute acknowledged',     detail: 'Short shipment confirmed — 20 units', user: 'T. Kim',   timeAgo: '371d ago' },
      { action: 'Case created',             detail: 'Triggered by dispute DISP-7002',      user: 'System',   timeAgo: '371d ago' },
    ],
    notes: [
      { author: 'T. Kim', timeAgo: '371d ago', text: 'Warehouse confirmed short shipment. Credit memo pending return receipt.' },
    ],
    resolution: null,
    invoices: [
      { id: 'INV-30032', amount: '$67K', status: 'Disputed' },
    ],
    invoicesTotal: '$67K',
    disputes: [
      { id: 'DISP-7002', amount: '$67K', reason: 'Short shipment (20 units)', status: 'Open' },
    ],
    disputesTotal: '$67K',
    financial: {
      totalAR: '$540K', pastDue: '$67K', creditLimit: '$800K', available: '$260K',
      utilization: '68%', agingTrend: 'Stable',
      openOrderImpact: '$0', pendingReturns: '$67K', liquidityFlag: false,
    },
    notifications: [
      { channel: 'Email', timeAgo: '371d ago', subject: 'Dispute DISP-7002 acknowledged – CASE-2503', recipient: 'billing@sportmax.com' },
    ],
  },
};

export function getCaseDetail(id) {
  const base = casesBase.find(c => c.id === id);
  if (!base) return null;
  const detail = caseDetails[id] || {
    type: 'Credit Review',
    escalatedTo: null,
    lastEvaluated: base.createdAgo,
    creditPolicy: 'Credit Policy v1.8',
    dueDate: null,
    description: 'Case details pending review.',
    drivers: [],
    nextActions: ['Assign case owner and begin review.'],
    decisionContext: {
      outcome: 'On Hold',
      engineScore: null,
      engineGrade: null,
      workflow: 'Credit Review',
      reasonCodes: [],
      thresholdBreaches: [],
    },
    timeline: [{ action: 'Case created', detail: `Triggered by hold on ${base.orderId}`, user: 'System', timeAgo: base.createdAgo }],
    notes: [],
    resolution: null,
    invoices: [],
    invoicesTotal: null,
    disputes: [],
    disputesTotal: null,
    financial: null,
    notifications: [],
  };
  return { ...base, ...detail };
}
