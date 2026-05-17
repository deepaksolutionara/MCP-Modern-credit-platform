import { Router } from 'express';
import { heldOrders, sortOrders } from '../data/heldOrders.js';

const router = Router();

// GET /api/held-orders?sortBy=Amount&sortDir=desc
router.get('/', (req, res) => {
  const { sortBy = 'Amount', sortDir = 'desc' } = req.query;
  const results = sortOrders(heldOrders, sortBy, sortDir);
  res.json({ total: results.length, data: results });
});

// GET /api/held-orders/:id
router.get('/:id', (req, res) => {
  const order = heldOrders.find(o => o.id === req.params.id.toUpperCase());
  if (!order) return res.status(404).json({ error: `Order "${req.params.id}" not found` });
  res.json({ data: order });
});

export default router;
