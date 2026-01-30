import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'institute-secret-key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const db = getDb();
  const user = db.prepare(
    `SELECT u.*, r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?`
  ).get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safe } = user;
  res.json({ user: { ...safe, is_admin: !!safe.is_admin }, token });
});

router.post('/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const role = db.prepare("SELECT id FROM roles WHERE slug = 'student'").get();
  if (!role) return res.status(500).json({ error: 'Student role not found' });
  const hash = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, phone, address, role_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, email, hash, phone || null, address || null, role.id);
  const user = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.address, u.role_id, r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?`
  ).get(result.lastInsertRowid);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: { ...user, is_admin: false }, token });
});

export default router;
