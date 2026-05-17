export const casesByTab = {
  new:             [],
  in_review: [
    { id: 'CASE-2502', dealer: 'ProGear Distribution', type: 'Credit Review', priority: 'High',     age: '2d', sla: '44h left',      amount: '$34,000' },
  ],
  waiting_dealer: [
    { id: 'CASE-2504', dealer: 'ProGear Distribution', type: 'Dispute',       priority: 'Medium',   age: '3d', sla: '2h left',       amount: '$18,500' },
  ],
  waiting_payment: [],
  waiting_return: [
    { id: 'CASE-2503', dealer: 'SportMax Dealers',     type: 'Collections',   priority: 'Medium',   age: '4d', sla: '52h left',      amount: '$22,300' },
  ],
  escalated: [
    { id: 'CASE-2506', dealer: 'Alpine Equipment Co',  type: 'Credit Review', priority: 'Critical', age: '5d', sla: 'Breached +36h', amount: '$91,000' },
    { id: 'CASE-2501', dealer: 'Alpine Equipment Co',  type: 'Dispute',       priority: 'Critical', age: '4d', sla: '4h left',       amount: '$45,200' },
  ],
  near_breach: [
    { id: 'CASE-2498', dealer: 'Riverside Sports Co',  type: 'Credit Review', priority: 'High',     age: '3d', sla: '3h left',       amount: '$27,800' },
    { id: 'CASE-2495', dealer: 'Summit Athletics',     type: 'Onboarding',    priority: 'Medium',   age: '2d', sla: '6h left',       amount: '$15,600' },
  ],
  breached_sla: [
    { id: 'CASE-2489', dealer: 'Nordic Sports Ltd',    type: 'Collections',   priority: 'Critical', age: '7d', sla: 'Breached +12h', amount: '$63,400' },
  ],
  auto_released: [
    { id: 'CASE-2477', dealer: 'Peak Outdoors',        type: 'Credit Review', priority: 'Low',      age: '1d', sla: 'Released',      amount: '$11,200' },
  ],
  closed: [],
};

export const TAB_KEYS = [
  'new', 'in_review', 'waiting_dealer', 'waiting_payment',
  'waiting_return', 'escalated', 'near_breach', 'breached_sla',
  'auto_released', 'closed',
];
