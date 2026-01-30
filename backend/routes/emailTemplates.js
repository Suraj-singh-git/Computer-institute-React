import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM email_templates ORDER BY name').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Email template not found' });
  res.json(row);
});

router.post('/', requireAdmin, (req, res) => {
  const { name, subject, body, type, is_active } = req.body;
  if (!name || !subject || body == null) return res.status(400).json({ error: 'Name, subject and body required' });
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO email_templates (name, subject, body, type, is_active) VALUES (?, ?, ?, ?, ?)'
  ).run(name, subject, body || '', type || 'general', is_active !== false ? 1 : 0);
  const row = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAdmin, (req, res) => {
  const { name, subject, body, type, is_active } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Email template not found' });
  db.prepare(
    'UPDATE email_templates SET name=?, subject=?, body=?, type=?, is_active=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(name ?? existing.name, subject ?? existing.subject, body ?? existing.body, type ?? existing.type, is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active, req.params.id);
  const row = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM email_templates WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Email template not found' });
  res.status(204).send();
});

export default router;
