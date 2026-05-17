import { Router } from 'express';
import { kpis, slaHotlist, ruleChanges, autoReleases } from '../data/dashboard.js';

const router = Router();

// GET /api/dashboard/kpis
router.get('/kpis', (_req, res) => {
  res.json({ data: kpis });
});

// GET /api/dashboard/sla-hotlist
router.get('/sla-hotlist', (_req, res) => {
  res.json({ data: slaHotlist });
});

// GET /api/dashboard/rule-changes
router.get('/rule-changes', (_req, res) => {
  res.json({ data: ruleChanges });
});

// GET /api/dashboard/auto-releases
router.get('/auto-releases', (_req, res) => {
  res.json({ data: autoReleases });
});

// GET /api/dashboard  (all sections in one request)
router.get('/', (_req, res) => {
  res.json({ kpis, slaHotlist, ruleChanges, autoReleases });
});

export default router;
