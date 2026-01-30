import { Router } from 'express';
import { getDb } from '../db/index.js';

const router = Router();

router.get('/courses', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT c.id, c.title, c.description, c.fee, c.duration, b.name as branch_name FROM courses c
     JOIN branches b ON c.branch_id = b.id WHERE c.status = 1 AND b.is_active = 1 ORDER BY c.title`
  ).all();
  res.json(rows);
});

router.get('/branches', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    'SELECT id, name, code, address, phone, email FROM branches WHERE is_active = 1 ORDER BY name'
  ).all();
  res.json(rows);
});

router.get('/students', (req, res) => {
  const db = getDb();
  const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
  const rows = db.prepare(
    `SELECT u.name, b.name as branch_name FROM users u
     LEFT JOIN branches b ON u.branch_id = b.id
     LEFT JOIN roles r ON u.role_id = r.id WHERE r.slug = 'student' ORDER BY u.id DESC LIMIT ?`
  ).all(limit);
  res.json(rows);
});

router.get('/verify-result', (req, res) => {
  const { attempt_id, code } = req.query;
  if (!attempt_id || !code) return res.status(400).json({ error: 'attempt_id and code required' });
  const db = getDb();
  const attempt = db.prepare('SELECT * FROM exam_attempts WHERE id = ? AND status = ?').get(attempt_id, 'submitted');
  if (!attempt) return res.status(404).json({ error: 'Result not found' });
  if (attempt.verification_code !== String(code).trim()) return res.status(403).json({ error: 'Invalid verification code' });
  const exam = db.prepare('SELECT e.*, b.name as branch_name, c.title as course_title FROM exams e JOIN branches b ON e.branch_id = b.id JOIN courses c ON e.course_id = c.id WHERE e.id = ?').get(attempt.exam_id);
  const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(attempt.user_id);
  const answers = db.prepare(
    `SELECT eaa.*, q.question, q.type, q.marks FROM exam_attempt_answers eaa JOIN questions q ON eaa.question_id = q.id WHERE eaa.attempt_id = ? ORDER BY eaa.id`
  ).all(attempt_id);
  const withCorrect = answers.map((a) => {
    const correct = db.prepare('SELECT id, answer_text FROM answers WHERE question_id = ? AND is_correct = 1').get(a.question_id);
    return { ...a, correct_answer: correct };
  });
  const passed = attempt.score >= (attempt.passing_marks || 0);
  res.json({ attempt, exam, user, answers: withCorrect, passed });
});

export default router;
