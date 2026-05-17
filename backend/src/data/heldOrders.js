export const heldOrders = [
  {
    id: 'ORD-77321',
    status: 'held',
    dealerId: 'DLR-001',
    caseId: 'CASE-2501',
    decId: 'DEC-9001',
    dealer: 'Alpine Equipment Co',
    amount: '$240K',
    amountRaw: 240000,
    holdReason: 'Past due + utilization breach',
    submittedAgo: '376d ago',
    autoReleaseStatus: 'Awaiting $200K minimum payment',
    invoices: [
      { id: 'INV-30021', status: 'In Collections', statusColor: 'red',     agingBucket: '90+',   amount: '$220K' },
      { id: 'INV-30019', status: 'Open',           statusColor: 'outline', agingBucket: '31-60', amount: '$180K' },
    ],
    invoiceExposure: '$400K',
    disputes: [],
    disputedAmount: '$0K',
    timeline: [
      { event: 'Auto-escalated case',  detail: 'No response within 24h',                    ago: '375d ago' },
      { event: 'Case created',         detail: 'Order ORD-77321 did not meet criteria',     ago: '376d ago' },
    ],
    notifications: [
      { role: 'Dealer Order Writer',    message: 'Your order is under review',                       ago: '376d ago' },
      { role: 'Dealer Finance Contact', message: 'Action required: Order ORD-77321 on hold',         ago: '376d ago' },
      { role: 'Sales Rep',              message: 'On hold — Alpine Equipment Co',                    ago: '376d ago' },
    ],
    resolutionHistory: [],
  },
  {
    id: 'ORD-77342',
    status: 'held',
    dealerId: 'DLR-002',
    caseId: 'CASE-2502',
    decId: 'DEC-9002',
    dealer: 'ProGear Distribution',
    amount: '$180K',
    amountRaw: 180000,
    holdReason: 'Open order pushes exposure above limit',
    submittedAgo: '376d ago',
    autoReleaseStatus: 'Awaiting credit limit review and approval',
    invoices: [
      { id: 'INV-30028', status: 'Open', statusColor: 'outline', agingBucket: '1-30',  amount: '$110K' },
      { id: 'INV-30024', status: 'Open', statusColor: 'outline', agingBucket: '31-60', amount: '$70K'  },
    ],
    invoiceExposure: '$180K',
    disputes: [],
    disputedAmount: '$0K',
    timeline: [
      { event: 'Case assigned', detail: 'Routing rule R-RT-001',                          ago: '376d ago' },
      { event: 'Case created',  detail: 'Order ORD-77342 did not meet criteria',          ago: '376d ago' },
    ],
    notifications: [
      { role: 'Dealer Finance Contact', message: 'Action required: Order ORD-77342 on hold', ago: '376d ago' },
      { role: 'Sales Rep',              message: 'On hold — ProGear Distribution',            ago: '376d ago' },
    ],
    resolutionHistory: [],
  },
  {
    id: 'ORD-77390',
    status: 'release-eligible',
    dealerId: 'DLR-003',
    caseId: 'CASE-2503',
    decId: 'DEC-9003',
    dealer: 'SportMax Dealers',
    amount: '$95K',
    amountRaw: 95000,
    holdReason: 'Return $28K pending posting',
    submittedAgo: '376d ago',
    autoReleaseStatus: 'Return posted — recalculation will release',
    invoices: [
      { id: 'INV-30032', status: 'Disputed', statusColor: 'orange', agingBucket: '1-30', amount: '$67K' },
    ],
    invoiceExposure: '$67K',
    disputes: [
      { id: 'DISP-7002', status: 'Waiting on Internal Review', statusColor: 'orange', type: 'Short shipment', amount: '$28K' },
    ],
    disputedAmount: '$28K',
    timeline: [
      { event: 'Resolution event recorded', detail: 'Webhook from Returns service', ago: '375d ago' },
    ],
    notifications: [],
    resolutionHistory: [
      { event: 'Return Status Change', amount: '$28K', detail: 'RMA-8821 posted to account', ago: '375d ago' },
    ],
  },
];

export function sortOrders(orders, sortBy = 'Amount', sortDir = 'desc') {
  return [...orders].sort((a, b) => {
    let av, bv;
    switch (sortBy) {
      case 'Amount':         av = a.amountRaw;    bv = b.amountRaw;    break;
      case 'Release status': av = a.status;       bv = b.status;       break;
      case 'Submitted':      av = a.submittedAgo; bv = b.submittedAgo; break;
      case 'Dealer':         av = a.dealer;       bv = b.dealer;       break;
      case 'Order ID':       av = a.id;           bv = b.id;           break;
      default: return 0;
    }
    if (typeof av === 'number') return sortDir === 'asc' ? bv - av : av - bv;
    return sortDir === 'asc'
      ? String(bv).localeCompare(String(av))
      : String(av).localeCompare(String(bv));
  });
}
