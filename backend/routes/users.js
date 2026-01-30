import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const role = req.query.role; // 'student' to list students
  let sql = `SELECT u.id, u.name, u.email, u.phone, u.address, u.admission_date, u.status, u.branch_id, u.role_id, u.is_admin,
    r.slug as role_slug, r.name as role_name, b.name as branch_name FROM users u
    LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN branches b ON u.branch_id = b.id`;
  const params = [];
  if (role === 'student') { sql += ' WHERE r.slug = ?'; params.push('student'); }
  sql += ' ORDER BY u.name';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.address, u.admission_date, u.status, u.branch_id, u.role_id, u.is_admin,
    r.slug as role_slug, r.name as role_name, b.name as branch_name FROM users u
    LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN branches b ON u.branch_id = b.id WHERE u.id = ?`
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json(row);
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, email, password, phone, address, branch_id, role_id, status } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const hash = await bcrypt.hash(password, 10);
  const r = db.prepare(
    'INSERT INTO users (name, email, password, phone, address, branch_id, role_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, email, hash, phone || null, address || null, branch_id || null, role_id || null, status || 'Active');
  const row = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.address, u.branch_id, u.role_id, u.status, r.slug as role_slug, b.name as branch_name FROM users u
    LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN branches b ON u.branch_id = b.id WHERE u.id = ?`
  ).get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { name, email, phone, address, branch_id, role_id, status, password } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });
  if (email && email !== existing.email) {
    const dup = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (dup) return res.status(400).json({ error: 'Email already exists' });
  }
  let hash = existing.password;
  if (password) hash = await bcrypt.hash(password, 10);
  db.prepare(
    'UPDATE users SET name=?, email=?, phone=?, address=?, branch_id=?, role_id=?, status=?, password=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(name ?? existing.name, email ?? existing.email, phone ?? existing.phone, address ?? existing.address, branch_id ?? existing.branch_id, role_id ?? existing.role_id, status ?? existing.status, hash, req.params.id);
  const row = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.address, u.branch_id, u.role_id, u.status, r.slug as role_slug, b.name as branch_name FROM users u
    LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN branches b ON u.branch_id = b.id WHERE u.id = ?`
  ).get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
});

export default router;
