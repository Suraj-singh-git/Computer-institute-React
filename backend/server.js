import express from 'express';
import cors from 'cors';
import { initDb } from './db/index.js';

await initDb();

import authRoutes from './routes/auth.js';
import branchRoutes from './routes/branches.js';
import courseRoutes from './routes/courses.js';
import batchRoutes from './routes/batches.js';
import userRoutes from './routes/users.js';
import assignCourseRoutes from './routes/assignCourses.js';
import feeRoutes from './routes/fees.js';
import admissionRoutes from './routes/admissionRequests.js';
import roleRoutes from './routes/roles.js';
import emailTemplateRoutes from './routes/emailTemplates.js';
import settingsRoutes from './routes/settings.js';
import examRoutes from './routes/exams.js';
import questionRoutes from './routes/questions.js';
import examAttemptsRoutes from './routes/examAttempts.js';
import reportsRoutes from './routes/reports.js';
import publicRoutes from './routes/public.js';
import { authMiddleware } from './middleware/auth.js';
import { getDb } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'computer-institute-api' });
});

app.get('/api/settings/public', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT app_name, app_icon, contact_no, email, address FROM settings LIMIT 1').get();
  res.json(row || { app_name: 'UMA Technical & Electrical Institute', contact_no: '', email: '', address: '' });
});

app.use('/api/public', publicRoutes);

app.use('/api/branches', authMiddleware, branchRoutes);
app.use('/api/courses', authMiddleware, courseRoutes);
app.use('/api/batches', authMiddleware, batchRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/assign-courses', authMiddleware, assignCourseRoutes);
app.use('/api/fees', authMiddleware, feeRoutes);
app.use('/api/admission-requests', authMiddleware, admissionRoutes);
app.use('/api/roles', authMiddleware, roleRoutes);
app.use('/api/email-templates', authMiddleware, emailTemplateRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/exams', authMiddleware, examRoutes);
app.use('/api/questions', authMiddleware, questionRoutes);
app.use('/api/exam-attempts', examAttemptsRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

app.put('/api/profile', authMiddleware, (req, res) => {
  const { name, email } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.user.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });
  if (email && email !== existing.email) {
    const dup = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (dup) return res.status(400).json({ error: 'Email already in use' });
  }
  db.prepare('UPDATE users SET name = ?, email = ?, updated_at = datetime(\'now\') WHERE id = ?').run(name ?? existing.name, email ?? existing.email, req.user.id);
  const user = db.prepare('SELECT u.id, u.name, u.email, u.phone, u.address, u.branch_id, u.role_id, u.is_admin, r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?').get(req.user.id);
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
