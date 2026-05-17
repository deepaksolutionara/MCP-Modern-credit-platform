import { Router } from 'express';
import { casesByTab, TAB_KEYS } from '../data/workQueue.js';

const router = Router();

// GET /api/work-queue/counts  — count of cases per tab
router.get('/counts', (_req, res) => {
  const counts = {};
  TAB_KEYS.forEach(k => { counts[k] = (casesByTab[k] ?? []).length; });
  res.json({ data: counts });
});

// GET /api/work-queue?tab=escalated  — cases for a specific tab (default: all)
router.get('/', (req, res) => {
  const { tab } = req.query;
  if (tab) {
    if (!TAB_KEYS.includes(tab)) {
      return res.status(400).json({ error: `Unknown tab "${tab}". Valid tabs: ${TAB_KEYS.join(', ')}` });
    }
    return res.json({ tab, data: casesByTab[tab] ?? [] });
  }
  // No tab param → return everything
  res.json({ data: casesByTab });
});

export default router;
