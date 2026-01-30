import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { user_id, branch_id } = req.query;
  let sql = `SELECT ac.*, u.name as user_name, u.email, b.name as branch_name, c.title as course_title, bt.name as batch_name
    FROM assign_courses ac
    JOIN users u ON ac.user_id = u.id
    JOIN branches b ON ac.branch_id = b.id
    JOIN courses c ON ac.course_id = c.id
    JOIN batches bt ON ac.batch_id = bt.id WHERE 1=1`;
  const params = [];
  if (user_id) { sql += ' AND ac.user_id = ?'; params.push(user_id); }
  if (branch_id) { sql += ' AND ac.branch_id = ?'; params.push(branch_id); }
  sql += ' ORDER BY ac.id DESC';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.post('/', requireAdmin, (req, res) => {
  const { user_id, branch_id, course_id, batch_id, is_active } = req.body;
  if (!user_id || !branch_id || !course_id || !batch_id) return res.status(400).json({ error: 'user_id, branch_id, course_id, batch_id required' });
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO assign_courses (user_id, branch_id, course_id, batch_id, is_active) VALUES (?, ?, ?, ?, ?)'
  ).run(user_id, branch_id, course_id, batch_id, is_active !== false ? 1 : 0);
  const row = db.prepare(
    `SELECT ac.*, u.name as user_name, c.title as course_title, bt.name as batch_name FROM assign_courses ac
    JOIN users u ON ac.user_id = u.id JOIN courses c ON ac.course_id = c.id JOIN batches bt ON ac.batch_id = bt.id WHERE ac.id = ?`
  ).get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAdmin, (req, res) => {
  const { is_active } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM assign_courses WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Assignment not found' });
  db.prepare('UPDATE assign_courses SET is_active=?, updated_at=datetime(\'now\') WHERE id=?').run(is_active !== false ? 1 : 0, req.params.id);
  const row = db.prepare(
    `SELECT ac.*, u.name as user_name, c.title as course_title, bt.name as batch_name FROM assign_courses ac
    JOIN users u ON ac.user_id = u.id JOIN courses c ON ac.course_id = c.id JOIN batches bt ON ac.batch_id = bt.id WHERE ac.id = ?`
  ).get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM assign_courses WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Assignment not found' });
  res.status(204).send();
});

export default router;
