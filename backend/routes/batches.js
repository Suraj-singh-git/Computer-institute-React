import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { branch_id, course_id } = req.query;
  let sql = 'SELECT b.*, br.name as branch_name, c.title as course_title FROM batches b LEFT JOIN branches br ON b.branch_id = br.id LEFT JOIN courses c ON b.course_id = c.id WHERE 1=1';
  const params = [];
  if (branch_id) { sql += ' AND b.branch_id = ?'; params.push(branch_id); }
  if (course_id) { sql += ' AND b.course_id = ?'; params.push(course_id); }
  sql += ' ORDER BY b.start_date DESC, b.name';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare(
    'SELECT b.*, br.name as branch_name, c.title as course_title FROM batches b LEFT JOIN branches br ON b.branch_id = br.id LEFT JOIN courses c ON b.course_id = c.id WHERE b.id = ?'
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Batch not found' });
  res.json(row);
});

router.post('/', requireAdmin, (req, res) => {
  const { branch_id, course_id, name, start_time, end_time, start_date, end_date, is_active } = req.body;
  if (!branch_id || !course_id || !name) return res.status(400).json({ error: 'Branch, course and name required' });
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO batches (branch_id, course_id, name, start_time, end_time, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(branch_id, course_id, name, start_time || null, end_time || null, start_date || null, end_date || null, is_active !== false ? 1 : 0);
  const row = db.prepare('SELECT * FROM batches WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAdmin, (req, res) => {
  const { branch_id, course_id, name, start_time, end_time, start_date, end_date, is_active } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM batches WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Batch not found' });
  const data = {
    branch_id: branch_id ?? existing.branch_id,
    course_id: course_id ?? existing.course_id,
    name: name ?? existing.name,
    start_time: start_time ?? existing.start_time,
    end_time: end_time ?? existing.end_time,
    start_date: start_date ?? existing.start_date,
    end_date: end_date ?? existing.end_date,
    is_active: is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
  };
  db.prepare(
    'UPDATE batches SET branch_id=?, course_id=?, name=?, start_time=?, end_time=?, start_date=?, end_date=?, is_active=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(data.branch_id, data.course_id, data.name, data.start_time, data.end_time, data.start_date, data.end_date, data.is_active, req.params.id);
  const row = db.prepare('SELECT * FROM batches WHERE id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM batches WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Batch not found' });
  res.status(204).send();
});

export default router;
