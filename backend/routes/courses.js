import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const branchId = req.query.branch_id;
  let sql = 'SELECT c.*, b.name as branch_name FROM courses c LEFT JOIN branches b ON c.branch_id = b.id';
  const params = [];
  if (branchId) { sql += ' WHERE c.branch_id = ?'; params.push(branchId); }
  sql += ' ORDER BY c.title';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare(
    'SELECT c.*, b.name as branch_name FROM courses c LEFT JOIN branches b ON c.branch_id = b.id WHERE c.id = ?'
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Course not found' });
  res.json(row);
});

router.post('/', requireAdmin, (req, res) => {
  const { branch_id, title, description, fee, duration, status } = req.body;
  if (!title || fee == null) return res.status(400).json({ error: 'Title and fee required' });
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO courses (branch_id, title, description, fee, duration, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(branch_id || null, title, description || null, Number(fee), Number(duration) || 0, status !== 0 ? 1 : 0);
  const row = db.prepare('SELECT * FROM courses WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAdmin, (req, res) => {
  const { branch_id, title, description, fee, duration, status } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Course not found' });
  db.prepare(
    'UPDATE courses SET branch_id=?, title=?, description=?, fee=?, duration=?, status=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(branch_id ?? existing.branch_id, title ?? existing.title, description ?? existing.description, fee != null ? Number(fee) : existing.fee, duration != null ? Number(duration) : existing.duration, status !== undefined ? (status ? 1 : 0) : existing.status, req.params.id);
  const row = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Course not found' });
  res.status(204).send();
});

export default router;
