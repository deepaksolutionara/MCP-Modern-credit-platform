import { Router } from 'express';
import { cases, filterAndSort } from '../data/cases.js';

const router = Router();

// GET /api/cases  — filterable + sortable list
// Query params: search, status, priority, sortBy, sortDir
router.get('/', (req, res) => {
  const results = filterAndSort(req.query);
  res.json({ total: results.length, data: results });
});

// GET /api/cases/statuses  — distinct status values
router.get('/statuses', (_req, res) => {
  const statuses = [...new Set(cases.map(c => c.status))];
  res.json({ data: statuses });
});

// GET /api/cases/:id
router.get('/:id', (req, res) => {
  const c = cases.find(c => c.id === req.params.id.toUpperCase());
  if (!c) return res.status(404).json({ error: `Case "${req.params.id}" not found` });
  res.json({ data: c });
});

export default router;
