export const heldOrders = [
  {
    orderId: 'ORD-80018', dealer: 'PGA Tour Superstore',
    holdReason: 'Past due > policy threshold', amount: 274000,
    decision: 'DEC-9111 · Hold-Payment', caseId: 'CASE-2611',
    criteria: [
      { met: true, text: 'All policy criteria met', sub: 'Order would auto-release.' },
    ],
  },
  {
    orderId: 'ORD-80103', dealer: 'Birdie Bay Pro Shop',
    holdReason: 'Pending dispute review', amount: 265000,
    decision: 'DEC-9112 · Hold-Dispute', caseId: 'CASE-2612',
    criteria: [
      { met: false, text: 'Dispute DISP-7113 must be resolved', sub: 'Currently: Waiting on Internal Review' },
      { met: true,  text: 'Credit limit check passed', sub: null },
    ],
  },
  {
    orderId: 'ORD-80223', dealer: 'Summit Sports E-Tail',
    holdReason: 'Pending dispute review', amount: 246000,
    decision: 'DEC-9113 · Hold-Dispute', caseId: 'CASE-2613',
    criteria: [
      { met: false, text: 'Dispute DISP-7003 must be resolved', sub: 'Currently: Open' },
      { met: true,  text: 'No past-due balance', sub: null },
    ],
  },
  {
    orderId: 'ORD-80188', dealer: 'Hilltop Golf Center (Collections)',
    holdReason: 'Open order pushes exposure above limit', amount: 245000,
    decision: 'DEC-9114 · Hold-Exposure', caseId: 'CASE-2614',
    criteria: [
      { met: false, text: 'Exposure must drop below credit limit', sub: 'Current exposure $1.2M vs limit $950K' },
      { met: false, text: 'Awaiting payment of $250K minimum', sub: null },
    ],
  },
  {
    orderId: 'ORD-80225', dealer: 'Heritage Golf Pro Shop',
    holdReason: 'Past due > policy threshold', amount: 245000,
    decision: 'DEC-9115 · Hold-Payment', caseId: 'CASE-2615',
    criteria: [
      { met: false, text: 'Past due balance must be cleared', sub: 'Currently $89K overdue (61–90 d bucket)' },
      { met: true,  text: 'Credit limit headroom available', sub: null },
    ],
  },
  {
    orderId: 'ORD-77321', dealer: 'Alpine Equipment Co',
    holdReason: 'Past due + utilization breach', amount: 240000,
    decision: 'DEC-9116 · Hold-Utilization', caseId: 'CASE-2616',
    criteria: [
      { met: false, text: 'Past due balance must be cleared', sub: 'Currently $200K overdue (90+ d bucket)' },
      { met: false, text: 'Utilization must fall below 85%', sub: 'Current utilization 97%' },
    ],
  },
  {
    orderId: 'ORD-80179', dealer: 'Lakeshore Pro Shop (Collections)',
    holdReason: 'Open order pushes exposure above limit', amount: 219000,
    decision: 'DEC-9117 · Hold-Exposure', caseId: 'CASE-2617',
    criteria: [
      { met: false, text: 'Exposure must drop below credit limit', sub: 'Current exposure $780K vs limit $650K' },
    ],
  },
  {
    orderId: 'ORD-80181', dealer: 'Lakeshore Pro Shop (Collections)',
    holdReason: 'Pending dispute review', amount: 214000,
    decision: 'DEC-9118 · Hold-Dispute', caseId: 'CASE-2618',
    criteria: [
      { met: false, text: 'Dispute DISP-7117 must be resolved', sub: 'Currently: Waiting on Dealer' },
      { met: true,  text: 'No past-due balance', sub: null },
    ],
  },
  {
    orderId: 'ORD-80104', dealer: 'Birdie Bay Pro Shop',
    holdReason: 'Past due > policy threshold', amount: 209000,
    decision: 'DEC-9119 · Hold-Payment', caseId: 'CASE-2619',
    criteria: [
      { met: false, text: 'Past due balance must be cleared', sub: 'Currently $44K overdue (31–60 d bucket)' },
      { met: true,  text: 'Credit limit headroom available', sub: null },
    ],
  },
  {
    orderId: 'ORD-80031', dealer: 'Bandon Dunes Golf Resort',
    holdReason: 'Open order pushes exposure above limit', amount: 206000,
    decision: 'DEC-9120 · Hold-Exposure', caseId: 'CASE-2620',
    criteria: [
      { met: false, text: 'Exposure must drop below credit limit', sub: 'Current exposure $560K vs limit $450K' },
    ],
  },
];
