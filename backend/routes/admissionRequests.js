import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const status = req.query.status;
  let sql = `SELECT ar.*, u.name as user_name, u.email, u.phone, b.name as branch_name FROM admission_requests ar
    JOIN users u ON ar.user_id = u.id JOIN branches b ON ar.branch_id = b.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND ar.status = ?'; params.push(status); }
  sql += ' ORDER BY ar.id DESC';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.get('/my', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const db = getDb();
  const rows = db.prepare(
    `SELECT ar.*, b.name as branch_name FROM admission_requests ar JOIN branches b ON ar.branch_id = b.id WHERE ar.user_id = ? ORDER BY ar.id DESC`
  ).all(req.user.id);
  res.json(rows);
});

router.post('/', (req, res) => {
  const { branch_id, message } = req.body;
  if (!branch_id) return res.status(400).json({ error: 'branch_id required' });
  const db = getDb();
  const pending = db.prepare('SELECT id FROM admission_requests WHERE user_id = ? AND branch_id = ? AND status = ?').get(req.user.id, branch_id, 'pending');
  if (pending) return res.status(400).json({ error: 'You already have a pending request for this branch' });
  const r = db.prepare(
    'INSERT INTO admission_requests (user_id, branch_id, status, message) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, branch_id, 'pending', message || null);
  const row = db.prepare(
    `SELECT ar.*, b.name as branch_name FROM admission_requests ar JOIN branches b ON ar.branch_id = b.id WHERE ar.id = ?`
  ).get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id/process', requireAdmin, (req, res) => {
  const { status, admin_notes } = req.body;
  if (!['approved', 'rejected', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const db = getDb();
  const existing = db.prepare('SELECT * FROM admission_requests WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Request not found' });
  db.prepare(
    'UPDATE admission_requests SET status=?, admin_notes=?, processed_by=?, processed_at=datetime(\'now\'), updated_at=datetime(\'now\') WHERE id=?'
  ).run(status, admin_notes || null, req.user.id, req.params.id);
  const row = db.prepare(
    `SELECT ar.*, u.name as user_name, b.name as branch_name FROM admission_requests ar JOIN users u ON ar.user_id = u.id JOIN branches b ON ar.branch_id = b.id WHERE ar.id = ?`
  ).get(req.params.id);
  res.json(row);
});

export default router;
