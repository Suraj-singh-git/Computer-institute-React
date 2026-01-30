import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM branches ORDER BY name').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM branches WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Branch not found' });
  res.json(row);
});

router.post('/', requireAdmin, (req, res) => {
  const { name, code, address, phone, email, is_active } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'Name and code required' });
  const db = getDb();
  try {
    const r = db.prepare(
      'INSERT INTO branches (name, code, address, phone, email, is_active) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, code, address || null, phone || null, email || null, is_active !== false ? 1 : 0);
    const row = db.prepare('SELECT * FROM branches WHERE id = ?').get(r.lastInsertRowid);
    res.status(201).json(row);
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ error: 'Code already exists' });
    throw e;
  }
});

router.put('/:id', requireAdmin, (req, res) => {
  const { name, code, address, phone, email, is_active } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM branches WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Branch not found' });
  db.prepare(
    'UPDATE branches SET name=?, code=?, address=?, phone=?, email=?, is_active=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(name ?? existing.name, code ?? existing.code, address ?? null, phone ?? null, email ?? null, is_active !== false ? 1 : 0, req.params.id);
  const row = db.prepare('SELECT * FROM branches WHERE id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM branches WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Branch not found' });
  res.status(204).send();
});

export default router;
