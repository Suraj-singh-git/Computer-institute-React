import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { branch_id, course_id } = req.query;
  let sql = `SELECT e.*, b.name as branch_name, c.title as course_title, bt.name as batch_name FROM exams e
    LEFT JOIN branches b ON e.branch_id = b.id LEFT JOIN courses c ON e.course_id = c.id LEFT JOIN batches bt ON e.batch_id = bt.id WHERE 1=1`;
  const params = [];
  if (branch_id) { sql += ' AND e.branch_id = ?'; params.push(branch_id); }
  if (course_id) { sql += ' AND e.course_id = ?'; params.push(course_id); }
  sql += ' ORDER BY e.exam_date DESC, e.id DESC';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.get('/:id/admit-card', (req, res) => {
  const db = getDb();
  const exam = db.prepare(
    `SELECT e.*, b.name as branch_name, b.address as branch_address, b.phone as branch_phone, c.title as course_title, bt.name as batch_name FROM exams e
    LEFT JOIN branches b ON e.branch_id = b.id LEFT JOIN courses c ON e.course_id = c.id LEFT JOIN batches bt ON e.batch_id = bt.id WHERE e.id = ?`
  ).get(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  const userId = req.query.user_id || (req.user && req.user.id);
  if (!userId) return res.status(400).json({ error: 'user_id required or login' });
  const user = db.prepare('SELECT id, name, email, phone FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.user && !req.user.is_admin && req.user.id !== Number(userId)) return res.status(403).json({ error: 'Forbidden' });
  const settings = db.prepare('SELECT app_name, contact_no, address FROM settings LIMIT 1').get();
  res.json({ exam, user, settings: settings || {} });
});

router.get('/:id/question-paper', requireAdmin, (req, res) => {
  const db = getDb();
  const answerKey = req.query.answer_key === 'true';
  const exam = db.prepare(
    `SELECT e.*, b.name as branch_name, c.title as course_title, bt.name as batch_name FROM exams e
    LEFT JOIN branches b ON e.branch_id = b.id LEFT JOIN courses c ON e.course_id = c.id LEFT JOIN batches bt ON e.batch_id = bt.id WHERE e.id = ?`
  ).get(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  const questions = db.prepare('SELECT * FROM questions WHERE exam_id = ? AND is_active = 1 ORDER BY "order", id').all(req.params.id);
  const withAnswers = questions.map((q) => {
    const answers = db.prepare('SELECT id, answer_text, is_correct, "order" FROM answers WHERE question_id = ? ORDER BY "order"').all(q.id);
    return { ...q, answers: answerKey ? answers : answers.map((a) => ({ id: a.id, answer_text: a.answer_text, order: a.order })) };
  });
  const settings = db.prepare('SELECT app_name FROM settings LIMIT 1').get();
  res.json({ exam, questions: withAnswers, answerKey, settings: settings || {} });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare(
    `SELECT e.*, b.name as branch_name, c.title as course_title, bt.name as batch_name FROM exams e
    LEFT JOIN branches b ON e.branch_id = b.id LEFT JOIN courses c ON e.course_id = c.id LEFT JOIN batches bt ON e.batch_id = bt.id WHERE e.id = ?`
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Exam not found' });
  res.json(row);
});

router.post('/', requireAdmin, (req, res) => {
  const { branch_id, course_id, batch_id, title, description, duration, total_marks, passing_marks, is_active, exam_date } = req.body;
  if (!branch_id || !course_id || !title) return res.status(400).json({ error: 'Branch, course and title required' });
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO exams (branch_id, course_id, batch_id, title, description, duration, total_marks, passing_marks, is_active, exam_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(branch_id, course_id, batch_id || null, title, description || null, Number(duration) || 60, Number(total_marks) || 100, Number(passing_marks) || 40, is_active !== false ? 1 : 0, exam_date || null);
  const row = db.prepare('SELECT * FROM exams WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAdmin, (req, res) => {
  const { branch_id, course_id, batch_id, title, description, duration, total_marks, passing_marks, is_active, exam_date } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM exams WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Exam not found' });
  const data = {
    branch_id: branch_id ?? existing.branch_id,
    course_id: course_id ?? existing.course_id,
    batch_id: batch_id !== undefined ? batch_id : existing.batch_id,
    title: title ?? existing.title,
    description: description ?? existing.description,
    duration: duration != null ? Number(duration) : existing.duration,
    total_marks: total_marks != null ? Number(total_marks) : existing.total_marks,
    passing_marks: passing_marks != null ? Number(passing_marks) : existing.passing_marks,
    is_active: is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
    exam_date: exam_date !== undefined ? exam_date : existing.exam_date,
  };
  db.prepare(
    'UPDATE exams SET branch_id=?, course_id=?, batch_id=?, title=?, description=?, duration=?, total_marks=?, passing_marks=?, is_active=?, exam_date=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(data.branch_id, data.course_id, data.batch_id, data.title, data.description, data.duration, data.total_marks, data.passing_marks, data.is_active, data.exam_date, req.params.id);
  const row = db.prepare('SELECT * FROM exams WHERE id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM exams WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Exam not found' });
  res.status(204).send();
});

export default router;
