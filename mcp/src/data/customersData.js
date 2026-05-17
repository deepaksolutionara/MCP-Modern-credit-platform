// Shared customer data used by both Customers list and CustomerDetail pages

export const customersBase = [
  { accountNo: 'DLR-001', customer: 'Alpine Equipment Co',       region: 'West',      status: 'On Hold',   salesRep: 'T. Kim'   },
  { accountNo: 'DLR-002', customer: 'ProGear Distribution',      region: 'Midwest',   status: 'Watchlist', salesRep: 'J. Lopez' },
  { accountNo: 'DLR-003', customer: 'SportMax Dealers',          region: 'South',     status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-004', customer: 'TrailBlaze Inc',            region: 'Northeast', status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-005', customer: 'Peak Outdoors',             region: 'West',      status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-101', customer: "Dick's Sporting Goods",     region: 'Northeast', status: 'On Hold',   salesRep: 'T. Kim'   },
  { accountNo: 'DLR-102', customer: 'Academy Sports + Outdoors', region: 'South',     status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-103', customer: 'REI Co-op',                 region: 'West',      status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-104', customer: 'Bass Pro Shops',            region: 'Midwest',   status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-105', customer: "Cabela's",                  region: 'Midwest',   status: 'On Hold',   salesRep: 'T. Kim'   },
  { accountNo: 'DLR-106', customer: 'Sports Authority',          region: 'South',     status: 'Watchlist', salesRep: 'J. Lopez' },
  { accountNo: 'DLR-107', customer: 'Eastern Mountain Sports',   region: 'Northeast', status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-108', customer: 'Hibbett Sports',            region: 'South',     status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-109', customer: 'Big 5 Sporting Goods',      region: 'West',      status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-110', customer: "Dunham's Sports",           region: 'Midwest',   status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-111', customer: "Modell's Sporting Goods",   region: 'Northeast', status: 'On Hold',   salesRep: 'T. Kim'   },
  { accountNo: 'DLR-112', customer: 'Gart Sports',               region: 'West',      status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-113', customer: 'Sport Chalet',              region: 'West',      status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-114', customer: 'MC Sports',                 region: 'Midwest',   status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-115', customer: 'City Sports',               region: 'Northeast', status: 'On Hold',   salesRep: 'T. Kim'   },
  { accountNo: 'DLR-116', customer: 'National Sports',           region: 'Northeast', status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-117', customer: 'Olympia Sports',            region: 'Northeast', status: 'Watchlist', salesRep: 'T. Kim'   },
  { accountNo: 'DLR-118', customer: "Gold's Gym Sports",         region: 'South',     status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-119', customer: 'Sport Supply Group',        region: 'South',     status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-120', customer: 'Northwest River Supplies',  region: 'West',      status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-121', customer: 'Adventure Sports Co',       region: 'West',      status: 'Active',    salesRep: 'T. Kim'   },
  { accountNo: 'DLR-122', customer: 'Midwest Sporting Goods',    region: 'Midwest',   status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-123', customer: 'Southern Cross Sports',     region: 'South',     status: 'On Hold',   salesRep: 'T. Kim'   },
  { accountNo: 'DLR-124', customer: 'Northeast Athletic Supply', region: 'Northeast', status: 'Active',    salesRep: 'J. Lopez' },
  { accountNo: 'DLR-125', customer: 'Riverside Sports Co',       region: 'South',     status: 'Active',    salesRep: 'T. Kim'   },
];

// Full detail records — keyed by accountNo
export const customerDetails = {
  'DLR-001': {
    contacts: [
      { name: 'Sara Nguyen',  role: 'Dealer Finance Contact', email: 'finance@alpineequip.com', phone: '555-201-7714' },
      { name: 'Greg Holland', role: 'Dealer Order Writer',    email: 'orders@alpineequip.com',  phone: '555-201-7710' },
      { name: 'Maria Alpine', role: 'Owner',                  email: 'maria@alpineequip.com',   phone: '555-201-7700' },
    ],
    aging: [
      { label: 'CURRENT',  amount: '$1.4M',  raw: 1400000, red: false },
      { label: '1-30',     amount: '$320K',  raw: 320000,  red: false },
      { label: '31-60',    amount: '$380K',  raw: 380000,  red: false },
      { label: '61-90',    amount: '$200K',  raw: 200000,  red: false },
      { label: 'PAST DUE', amount: '$580K',  raw: 580000,  red: true  },
    ],
    agingTotal: '$2.88M',
    credit: { limit: '$2.5M', totalAR: '$2.3M', available: '$200K', utilPct: 92, openAR: '$580K', score: 'C+', lastReview: '2025-11-01', nextReview: '2026-05-01', terms: 'Net 60', riskTier: 'High' },
    heldOrders: [
      { id: 'ORD-77321', docType: 'C7',  value: '$240K', terms: 'Net 60', reason: 'Awaiting return posting', sla: 'Near Breach', lifecycle: 'Pending Credit Review' },
    ],
    payments: [
      { date: '2025-03-15', amount: '$50,000', method: 'Wire Transfer', status: 'Posted', ref: 'PAY-8821' },
      { date: '2025-02-10', amount: '$30,000', method: 'Check',         status: 'Posted', ref: 'PAY-8644' },
      { date: '2024-12-05', amount: '$80,000', method: 'Wire Transfer', status: 'Posted', ref: 'PAY-8201' },
    ],
    invoices: [
      { id: 'INV-30021', amount: '$220K', due: '2025-02-11', status: 'In Collections' },
      { id: 'INV-30019', amount: '$180K', due: '2025-03-10', status: 'Open'           },
      { id: 'INV-30005', amount: '$180K', due: '2025-03-24', status: 'Open'           },
    ],
    disputes: [
      { id: 'DISP-7003', amount: '$15K', type: 'Credit memo expectation', status: 'Open' },
    ],
    cases: [
      { id: 'CASE-2501', status: 'Escalated', priority: 'Critical', owner: 'Jane Doe' },
      { id: 'CASE-2506', status: 'Escalated', priority: 'Critical', owner: 'Jane Doe' },
    ],
    notes: [
      { author: 'T. Kim',   date: '2025-04-20', text: 'Customer flagged for collections escalation. Awaiting payment confirmation from finance contact.' },
      { author: 'M. Patel', date: '2025-03-15', text: 'Payment of $50K received. Credit limit review scheduled for Q2.' },
    ],
    arLedger: [
      { ref: 'INV-30032', amount: '$28.4K', label: 'open',   type: 'Invoice', aging: 'Current' },
      { ref: 'PAY-8821',  amount: '$50K',   label: 'posted', type: 'Payment', aging: '—'       },
      { ref: 'PAY-8644',  amount: '$30K',   label: 'posted', type: 'Payment', aging: '—'       },
      { ref: 'INV-30019', amount: '$180K',  label: 'open',   type: 'Invoice', aging: '31-60'   },
    ],
    communications: [
      { date: '21/4/2025, 6:30:00 pm', channel: 'Email',  subject: 'Final notice prior to external referral', user: 'Mike Chen'  },
      { date: '21/4/2025, 6:30:00 pm', channel: 'Email',  subject: 'Email touch — Refused',                   user: 'Mike Chen'  },
      { date: '15/4/2025, 3:00:00 pm', channel: 'Letter', subject: 'Formal demand letter mailed',             user: 'Mike Chen'  },
      { date: '15/4/2025, 3:00:00 pm', channel: 'Letter', subject: 'Letter touch — No Answer',                user: 'Mike Chen'  },
      { date: '3/4/2025, 2:30:00 pm',  channel: 'Email',  subject: 'Re: Invoice INV-30021 now past due',      user: 'Sara Nguyen'},
    ],
    auditHistory: [
      { date: '23/4/2025, 1:30:00 pm', user: 'System',   action: 'Auto-escalated case',   detail: 'No response within 24h'                    },
      { date: '22/4/2025, 2:45:00 pm', user: 'System',   action: 'Case created',           detail: 'Order ORD-77321 did not meet criteria'      },
      { date: '21/4/2025, 2:31:00 pm', user: 'System',   action: 'SLA breached',           detail: 'Elapsed 84h vs target 48h'                 },
      { date: '20/4/2025, 9:10:00 am', user: 'T. Kim',   action: 'Case assigned',          detail: 'Routing rule R-RT-001 applied'             },
      { date: '15/3/2025, 11:05:00 am',user: 'T. Kim',   action: 'Payment recorded',       detail: 'PAY-8821 · $50K wire transfer posted'      },
      { date: '01/2/2025, 3:00:00 pm', user: 'M. Patel', action: 'Credit limit reviewed',  detail: 'Limit maintained at $500K, risk tier → High' },
    ],
  },

  'DLR-002': {
    contacts: [
      { name: 'James Chen',  role: 'Dealer Finance Contact', email: 'finance@progear.com', phone: '555-302-8821' },
      { name: 'Lisa Park',   role: 'Dealer Order Writer',    email: 'orders@progear.com',  phone: '555-302-8822' },
      { name: 'Robert Gear', role: 'Owner',                  email: 'robert@progear.com',  phone: '555-302-8800' },
    ],
    aging: [
      { label: 'CURRENT',  amount: '$34K',   raw: 34000,  red: false },
      { label: '1-30',     amount: '$110K',  raw: 110000, red: false },
      { label: '31-60',    amount: '$70K',   raw: 70000,  red: false },
      { label: '61-90',    amount: '$0',     raw: 0,      red: false },
      { label: 'PAST DUE', amount: '$0',     raw: 0,      red: true  },
    ],
    agingTotal: '$214K',
    credit: { limit: '$250,000', used: '$214,000', available: '$36,000', utilPct: 86, score: 'B-', lastReview: '2025-12-01', nextReview: '2026-06-01', terms: 'Net 45', riskTier: 'Medium' },
    heldOrders: [
      { id: 'ORD-77342', docType: 'SO', value: '$180K', terms: 'Net 45', reason: 'Manual hold by credit', sla: 'Near Breach', lifecycle: 'Pending Credit Review' },
    ],
    payments: [
      { date: '2025-04-01', amount: '$25,000', method: 'ACH',   status: 'Posted', ref: 'PAY-9001' },
      { date: '2025-03-01', amount: '$40,000', method: 'Check', status: 'Posted', ref: 'PAY-8910' },
    ],
    invoices: [
      { id: 'INV-30028', date: '2025-01-10', due: '2025-02-09', amount: '$110,000', aging: '1–30',  status: 'Open' },
      { id: 'INV-30024', date: '2024-12-15', due: '2025-01-14', amount: '$70,000',  aging: '31–60', status: 'Open' },
      { id: 'INV-30033', date: '2025-02-01', due: '2025-03-03', amount: '$34,000',  aging: 'Current', status: 'Open' },
    ],
    disputes: [],
    cases: [
      { id: 'CASE-2502', type: 'Credit Review', priority: 'High', status: 'In Review', age: '2d', amount: '$34,000' },
    ],
    notes: [
      { author: 'J. Lopez', date: '2025-04-15', text: 'Watchlist flag added due to utilization approaching limit. Monitor weekly.' },
    ],
    arLedger: [
      { ref: 'INV-30033', amount: '$34K', label: 'open',   type: 'Invoice', aging: 'Current' },
      { ref: 'PAY-9001',  amount: '$25K', label: 'posted', type: 'Payment', aging: '—'       },
    ],
    communications: [
      { date: '2025-04-15', channel: 'Email',  direction: 'Out', subject: 'Watchlist notice — utilization threshold reached', status: 'Delivered' },
    ],
    auditHistory: [
      { date: '2025-04-15', user: 'J. Lopez', action: 'Account added to Watchlist', detail: 'Utilization exceeded 85%' },
    ],
  },

  'DLR-003': {
    contacts: [
      { name: 'Amanda Fox',  role: 'Dealer Finance Contact', email: 'finance@sportmax.com', phone: '555-403-9931' },
      { name: 'Kevin Reyes', role: 'Dealer Order Writer',    email: 'orders@sportmax.com',  phone: '555-403-9932' },
      { name: 'Max Harmon',  role: 'Owner',                  email: 'max@sportmax.com',     phone: '555-403-9900' },
    ],
    aging: [
      { label: 'CURRENT',  amount: '$22.3K', raw: 22300, red: false },
      { label: '1-30',     amount: '$45K',   raw: 45000, red: false },
      { label: '31-60',    amount: '$0',     raw: 0,     red: false },
      { label: '61-90',    amount: '$0',     raw: 0,     red: false },
      { label: 'PAST DUE', amount: '$0',     raw: 0,     red: true  },
    ],
    agingTotal: '$67.3K',
    credit: { limit: '$150,000', used: '$67,300', available: '$82,700', utilPct: 45, score: 'A-', lastReview: '2026-01-10', nextReview: '2026-07-10', terms: 'Net 60', riskTier: 'Low' },
    heldOrders: [
      { id: 'ORD-77390', docType: 'RM', value: '$95K', terms: 'Net 60', reason: 'Awaiting return posting', sla: 'Near Breach', lifecycle: 'Pending Credit Review' },
    ],
    payments: [
      { date: '2025-04-20', amount: '$45,000', method: 'Wire Transfer', status: 'Posted', ref: 'PAY-9110' },
    ],
    invoices: [
      { id: 'INV-30032', date: '2025-02-10', due: '2025-04-11', amount: '$67,000', aging: '1–30', status: 'Disputed' },
      { id: 'INV-30040', date: '2025-03-01', due: '2025-04-30', amount: '$22,300', aging: 'Current', status: 'Open' },
    ],
    disputes: [
      { id: 'DISP-7002', type: 'Short shipment', amount: '$28,000', status: 'Waiting on Internal Review', opened: '2025-03-20' },
    ],
    cases: [
      { id: 'CASE-2503', type: 'Collections', priority: 'Medium', status: 'Waiting on Return', age: '4d', amount: '$22,300' },
    ],
    notes: [
      { author: 'T. Kim', date: '2025-03-20', text: 'Dispute filed for short shipment. Return RMA-8821 initiated.' },
    ],
    arLedger: [
      { ref: 'INV-30032', amount: '$67K', label: 'open',   type: 'Disputed', aging: '1-30' },
      { ref: 'PAY-9110',  amount: '$45K', label: 'posted', type: 'Payment',  aging: '—'    },
    ],
    communications: [
      { date: '2025-03-21', channel: 'Email', direction: 'Out', subject: 'Dispute confirmation — DISP-7002', status: 'Delivered' },
    ],
    auditHistory: [
      { date: '2025-03-20', user: 'T. Kim', action: 'Dispute DISP-7002 opened', detail: 'Short shipment — $28K' },
    ],
  },

  'DLR-004': {
    contacts: [
      { name: 'Patricia Moore', role: 'Dealer Finance Contact', email: 'finance@trailblaze.com', phone: '555-504-1141' },
      { name: 'David Trail',    role: 'Dealer Order Writer',    email: 'orders@trailblaze.com',  phone: '555-504-1142' },
      { name: 'Tom Blaze',      role: 'Owner',                  email: 'tom@trailblaze.com',     phone: '555-504-1100' },
    ],
    aging: [
      { label: 'CURRENT',  amount: '$171K', raw: 171000, red: false },
      { label: '1-30',     amount: '$80K',  raw: 80000,  red: false },
      { label: '31-60',    amount: '$0',    raw: 0,      red: false },
      { label: '61-90',    amount: '$0',    raw: 0,      red: false },
      { label: 'PAST DUE', amount: '$250K', raw: 250000, red: true  },
    ],
    agingTotal: '$501K',
    credit: { limit: '$400,000', used: '$501,000', available: '-$101,000', utilPct: 125, score: 'D', lastReview: '2025-10-01', nextReview: '2026-04-01', terms: 'Prepaid', riskTier: 'Critical' },
    heldOrders: [
      { id: 'ORD-94496', docType: 'CA', value: '$171K', terms: 'Prepaid', reason: 'Past due > $250K', sla: 'On Track', lifecycle: 'Awaiting Payment' },
    ],
    payments: [
      { date: '2025-01-15', amount: '$100,000', method: 'Wire Transfer', status: 'Posted', ref: 'PAY-8500' },
    ],
    invoices: [
      { id: 'INV-31001', date: '2024-09-01', due: '2024-10-01', amount: '$250,000', aging: '90+',    status: 'Past Due' },
      { id: 'INV-31010', date: '2024-12-01', due: '2025-01-01', amount: '$80,000',  aging: '1–30',   status: 'Open'     },
      { id: 'INV-31020', date: '2025-02-01', due: '2025-03-01', amount: '$171,000', aging: 'Current', status: 'Open'    },
    ],
    disputes: [],
    cases: [],
    notes: [
      { author: 'J. Lopez', date: '2025-02-01', text: 'Account switched to Prepaid terms due to 90+ day balance exceeding $250K.' },
    ],
    arLedger: [
      { ref: 'INV-31020', amount: '$171K', label: 'open',   type: 'Invoice', aging: 'Current' },
      { ref: 'PAY-8500',  amount: '$100K', label: 'posted', type: 'Payment', aging: '—'       },
    ],
    communications: [
      { date: '2025-02-02', channel: 'Email', direction: 'Out', subject: 'Payment terms changed to Prepaid', status: 'Delivered' },
    ],
    auditHistory: [
      { date: '2025-02-01', user: 'J. Lopez', action: 'Payment terms updated', detail: 'Net 30 → Prepaid (90+ balance threshold exceeded)' },
    ],
  },

  'DLR-005': {
    contacts: [
      { name: 'Sandra Lee',   role: 'Dealer Finance Contact', email: 'finance@peakoutdoors.com', phone: '555-605-2251' },
      { name: 'Mark Heights', role: 'Dealer Order Writer',    email: 'orders@peakoutdoors.com',  phone: '555-605-2252' },
      { name: 'Chris Summit', role: 'Owner',                  email: 'chris@peakoutdoors.com',   phone: '555-605-2200' },
    ],
    aging: [
      { label: 'CURRENT',  amount: '$130K', raw: 130000, red: false },
      { label: '1-30',     amount: '$0',    raw: 0,      red: false },
      { label: '31-60',    amount: '$0',    raw: 0,      red: false },
      { label: '61-90',    amount: '$0',    raw: 0,      red: false },
      { label: 'PAST DUE', amount: '$0',    raw: 0,      red: true  },
    ],
    agingTotal: '$130K',
    credit: { limit: '$300,000', used: '$130,000', available: '$170,000', utilPct: 43, score: 'B+', lastReview: '2026-02-01', nextReview: '2026-08-01', terms: 'Net 45', riskTier: 'Low' },
    heldOrders: [
      { id: 'ORD-94705', docType: 'SO', value: '$130K', terms: 'Net 45', reason: 'Utilization > 85%', sla: 'Breached', lifecycle: 'Pending Credit Review' },
    ],
    payments: [
      { date: '2025-04-25', amount: '$60,000', method: 'ACH', status: 'Posted', ref: 'PAY-9200' },
      { date: '2025-03-20', amount: '$40,000', method: 'ACH', status: 'Posted', ref: 'PAY-9050' },
    ],
    invoices: [
      { id: 'INV-32001', date: '2025-03-01', due: '2025-04-15', amount: '$130,000', aging: 'Current', status: 'Open' },
    ],
    disputes: [],
    cases: [],
    notes: [
      { author: 'J. Lopez', date: '2025-04-25', text: 'Order ORD-94705 held due to utilization spike. Likely auto-release after payment posts.' },
    ],
    arLedger: [
      { ref: 'INV-32001', amount: '$130K', label: 'open',   type: 'Invoice', aging: 'Current' },
      { ref: 'PAY-9200',  amount: '$60K',  label: 'posted', type: 'Payment', aging: '—'       },
    ],
    communications: [
      { date: '2025-04-26', channel: 'Email', direction: 'Out', subject: 'Order ORD-94705 on hold — utilization review', status: 'Delivered' },
    ],
    auditHistory: [
      { date: '2025-04-25', user: 'System', action: 'Order ORD-94705 placed on hold', detail: 'Utilization threshold 85% exceeded' },
    ],
  },
};

// Generate a default detail record for dealers without a specific profile
function makeDefaultDetail(base) {
  const slug = base.customer.toLowerCase().replace(/[^a-z]/g, '');
  return {
    contacts: [
      { name: 'Finance Team',   role: 'Dealer Finance Contact', email: `finance@${slug}.com`, phone: '555-000-0001' },
      { name: 'Orders Team',    role: 'Dealer Order Writer',    email: `orders@${slug}.com`,  phone: '555-000-0002' },
    ],
    aging: [
      { label: 'CURRENT',  amount: '$0', raw: 0, red: false },
      { label: '1-30',     amount: '$0', raw: 0, red: false },
      { label: '31-60',    amount: '$0', raw: 0, red: false },
      { label: '61-90',    amount: '$0', raw: 0, red: false },
      { label: 'PAST DUE', amount: '$0', raw: 0, red: true  },
    ],
    agingTotal: '$0',
    credit: { limit: '$200,000', used: '$0', available: '$200,000', utilPct: 0, score: 'N/A', lastReview: '—', nextReview: '—', terms: 'Net 30', riskTier: 'Unknown' },
    heldOrders: [], payments: [], invoices: [], disputes: [], cases: [],
    notes: [], arLedger: [], communications: [], auditHistory: [],
  };
}

export function getCustomerDetail(accountNo) {
  const base = customersBase.find(c => c.accountNo === accountNo);
  if (!base) return null;
  const detail = customerDetails[accountNo] || makeDefaultDetail(base);
  return { ...base, ...detail };
}
