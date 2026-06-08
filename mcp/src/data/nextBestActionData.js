/**
 * nextBestActionData.js
 *
 * Static data and tab configuration for the Next-Best-Action Hub.
 *
 * TAB_COMPONENTS is intentionally kept in the page component because it holds
 * React element factories — only pure data lives here.
 */

import { CreditCard, Lock, Scale, Clock, User } from 'lucide-react';

// ── Tab definitions ───────────────────────────────────────────────────────────

export const tabs = [
  { key: 'cash',     label: 'Cash',     Icon: CreditCard },
  { key: 'release',  label: 'Release',  Icon: Lock       },
  { key: 'disputes', label: 'Disputes', Icon: Scale      },
  { key: 'sla',      label: 'SLA',      Icon: Clock      },
  { key: 'workload', label: 'Workload', Icon: User       },
];

// ── Cash recovery worklist ────────────────────────────────────────────────────
// Passed as props to CashTab.

export const cashRecovery = [
  {
    dealer: 'Alpine Equipment Co', tier: 'D', badges: [],
    amount: '$580K', score: 85, bucket: '90+', invoices: 3,
    suggestedPlay: 'Late-Stage Pre-Referral',
  },
  {
    dealer: 'ProGear Distribution', tier: 'C', badges: ['Open dispute'],
    amount: '$240K', score: 71, bucket: '31-60', invoices: 2,
    suggestedPlay: 'Dispute-Driven Hold Pattern',
  },
  {
    dealer: 'SportMax Dealers', tier: 'C', badges: ['Strategic', 'Open dispute'],
    amount: '$67K', score: 38, bucket: '1-30', invoices: 1,
    suggestedPlay: 'Strategic-Account Coordinated Touch',
  },
];

// ── SLA-critical cases ────────────────────────────────────────────────────────
// Passed as props to SLATab.

export const slaCases = [
  { id: 'CASE-2506', status: 'Escalated',          priority: 'Critical', dealer: 'Alpine Equipment Co',               breached: 'Breached +36h' },
  { id: 'CASE-2667', status: 'Escalated',          priority: 'Medium',   dealer: 'Hilltop Golf Center (Collections)', breached: 'Breached +17h' },
  { id: 'CASE-2677', status: 'Escalated',          priority: 'Low',      dealer: 'Tradition Golf Outfitters',         breached: 'Breached +17h' },
  { id: 'CASE-2635', status: 'New',                priority: 'Critical', dealer: 'Sand Trap Golf Co',                 breached: 'Breached +16h' },
  { id: 'CASE-2655', status: 'Waiting on Payment', priority: 'Critical', dealer: 'Tennis Express',                    breached: 'Breached +14h' },
];
