import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import pool from "./config/db.js";

console.log("SERVER FILE LOADED: main Express file");
import dashboardRoutes  from './routes/dashboard.js';
import workQueueRoutes  from './routes/workQueue.js';
import casesRoutes      from './routes/cases.js';
import heldOrdersRoutes from './routes/heldOrders.js';

const app  = express();
const PORT = process.env.PORT || 3001;
// const CORS_ORIGINS = process.env.CORS_ORIGINS.split(',').map(o => o.trim());

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PORT);
// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: "http://localhost:5175"
}));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method}  ${req.url}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/work-queue',  workQueueRoutes);
// app.use('/api/cases',       casesRoutes);
app.use('/api/held-orders', heldOrdersRoutes);

app.get('/hello',async(req,res)=>{
  res.json("hello");
})
// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.get('/api/cases', async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cases");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cases:", error);

    res.status(500).json({
      message: "Database error",
      error: error.message,
      code: error.code
    });
  }
});


app.get('/api/test', (_req, res) => {
  res.json({ message: "Test route working" });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  MCMP API running on port ${PORT}\n`);
});
