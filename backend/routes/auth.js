import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

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

router.post('/change-password', authMiddleware, async (req, res) => {
  const { current_password, password } = req.body;
  if (!current_password || !password) return res.status(400).json({ error: 'Current password and new password required' });
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(401).json({ error: 'User not found' });
  const ok = await bcrypt.compare(current_password, user.password);
  if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });
  const hash = await bcrypt.hash(password, 10);
  db.prepare('UPDATE users SET password = ?, updated_at = datetime(\'now\') WHERE id = ?').run(hash, req.user.id);
  res.json({ message: 'Password updated successfully' });
});

router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const db = getDb();
  const user = db.prepare('SELECT u.*, r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?').get(email);
  if (!user) return res.status(400).json({ error: 'Account not found. Only Admin or Branch Manager can reset via OTP.' });
  const allowed = user.is_admin || user.role_slug === 'branch-manager' || user.role_slug === 'admin';
  if (!allowed) return res.status(400).json({ error: 'Only Admin or Branch Manager can reset via OTP.' });
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  db.prepare('UPDATE users SET otp_code = ?, otp_expires_at = ?, otp_attempts = 0 WHERE id = ?').run(otp, expires, user.id);
  if (process.env.NODE_ENV !== 'production') res.setHeader('X-OTP-DEV', otp);
  res.json({ message: 'OTP sent to your email.', email });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ error: 'Email, OTP and new password required' });
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(400).json({ error: 'Invalid email or OTP' });
  if (!user.otp_code || !user.otp_expires_at) return res.status(400).json({ error: 'OTP not requested or expired' });
  if (new Date() > new Date(user.otp_expires_at)) return res.status(400).json({ error: 'OTP has expired' });
  if ((user.otp_attempts || 0) >= 5) return res.status(400).json({ error: 'Too many attempts. Request a new OTP.' });
  if (user.otp_code !== otp) {
    db.prepare('UPDATE users SET otp_attempts = otp_attempts + 1 WHERE id = ?').run(user.id);
    return res.status(400).json({ error: 'Invalid OTP' });
  }
  const hash = await bcrypt.hash(password, 10);
  db.prepare('UPDATE users SET password = ?, otp_code = NULL, otp_expires_at = NULL, otp_attempts = 0 WHERE id = ?').run(hash, user.id);
  res.json({ message: 'Password updated successfully. Please log in.' });
});

export default router;
