import { Router } from 'express';
import { getDb } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/available', (req, res) => {
  const db = getDb();
  const userId = req.user.id;
  const assignments = db.prepare('SELECT course_id, batch_id, branch_id FROM assign_courses WHERE user_id = ? AND is_active = 1').all(userId);
  if (!assignments.length) return res.json([]);
  const exams = [];
  for (const a of assignments) {
    const rows = db.prepare(
      `SELECT e.*, b.name as branch_name, c.title as course_title, bt.name as batch_name FROM exams e
       JOIN branches b ON e.branch_id = b.id JOIN courses c ON e.course_id = c.id LEFT JOIN batches bt ON e.batch_id = bt.id
       WHERE e.is_active = 1 AND (e.batch_id = ? OR (e.batch_id IS NULL AND e.course_id = ?))`
    ).all(a.batch_id, a.course_id);
    for (const r of rows) {
      const attempted = db.prepare('SELECT id, score, total_marks, status FROM exam_attempts WHERE user_id = ? AND exam_id = ? ORDER BY id DESC LIMIT 1').get(userId, r.id);
      exams.push({ ...r, attempt: attempted });
    }
  }
  const seen = new Set();
  const unique = exams.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
  res.json(unique);
});

router.post('/', (req, res) => {
  const { exam_id } = req.body;
  if (!exam_id) return res.status(400).json({ error: 'exam_id required' });
  const db = getDb();
  const exam = db.prepare('SELECT * FROM exams WHERE id = ? AND is_active = 1').get(exam_id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  const userId = req.user.id;
  const assignments = db.prepare('SELECT id FROM assign_courses WHERE user_id = ? AND (course_id = ? OR batch_id = ?) AND is_active = 1').all(userId, exam.course_id, exam.batch_id || 0);
  if (!assignments.length && exam.batch_id) {
    const anyBatch = db.prepare('SELECT id FROM assign_courses WHERE user_id = ? AND course_id = ? AND is_active = 1').all(userId, exam.course_id);
    if (!anyBatch.length) return res.status(403).json({ error: 'You are not enrolled for this exam' });
  } else if (!assignments.length) return res.status(403).json({ error: 'You are not enrolled for this exam' });
  const existing = db.prepare('SELECT id FROM exam_attempts WHERE user_id = ? AND exam_id = ? AND status = ?').get(userId, exam_id, 'in_progress');
  if (existing) return res.status(400).json({ error: 'You already have an attempt in progress', attempt_id: existing.id });
  const r = db.prepare(
    'INSERT INTO exam_attempts (user_id, exam_id, total_marks, passing_marks) VALUES (?, ?, ?, ?)'
  ).run(userId, exam_id, exam.total_marks, exam.passing_marks);
  const attempt = db.prepare('SELECT * FROM exam_attempts WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(attempt);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const attempt = db.prepare('SELECT * FROM exam_attempts WHERE id = ?').get(req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const exam = db.prepare('SELECT * FROM exams WHERE id = ?').get(attempt.exam_id);
  const questions = db.prepare('SELECT * FROM questions WHERE exam_id = ? AND is_active = 1 ORDER BY "order", id').all(attempt.exam_id);
  const withAnswers = questions.map((q) => {
    const answers = db.prepare('SELECT id, answer_text, "order" FROM answers WHERE question_id = ? ORDER BY "order"').all(q.id);
    const saved = db.prepare('SELECT answer_text, selected_answer_id FROM exam_attempt_answers WHERE attempt_id = ? AND question_id = ?').get(req.params.id, q.id);
    return { ...q, answers, saved: saved || null };
  });
  res.json({ attempt, exam, questions: withAnswers });
});

router.post('/:id/submit', (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers array required' });
  const db = getDb();
  const attempt = db.prepare('SELECT * FROM exam_attempts WHERE id = ?').get(req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (attempt.status === 'submitted') return res.status(400).json({ error: 'Already submitted' });
  const exam = db.prepare('SELECT * FROM exams WHERE id = ?').get(attempt.exam_id);
  let totalScore = 0;
  const ins = db.prepare('INSERT INTO exam_attempt_answers (attempt_id, question_id, answer_text, selected_answer_id, marks_awarded) VALUES (?, ?, ?, ?, ?)');
  for (const a of answers) {
    const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(a.question_id);
    if (!q) continue;
    let marks = 0;
    if (q.type === 'mcq' && a.selected_answer_id) {
      const ans = db.prepare('SELECT is_correct FROM answers WHERE id = ?').get(a.selected_answer_id);
      if (ans?.is_correct) marks = q.marks || 1;
    } else if (q.type === 'short_answer' && a.answer_text) {
      marks = 0;
    }
    totalScore += marks;
    ins.run(req.params.id, a.question_id, a.answer_text || null, a.selected_answer_id || null, marks);
  }
  const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
  db.prepare('UPDATE exam_attempts SET score = ?, status = ?, submitted_at = datetime(\'now\'), verification_code = ? WHERE id = ?').run(totalScore, 'submitted', verificationCode, req.params.id);
  const updated = db.prepare('SELECT * FROM exam_attempts WHERE id = ?').get(req.params.id);
  const passed = updated.score >= (exam?.passing_marks || 0);
  res.json({ attempt: { ...updated, verification_code: verificationCode }, passed });
});

router.get('/:id/result', (req, res) => {
  const db = getDb();
  const attempt = db.prepare('SELECT * FROM exam_attempts WHERE id = ?').get(req.params.id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const exam = db.prepare('SELECT e.*, b.name as branch_name, c.title as course_title FROM exams e JOIN branches b ON e.branch_id = b.id JOIN courses c ON e.course_id = c.id WHERE e.id = ?').get(attempt.exam_id);
  const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(attempt.user_id);
  const answers = db.prepare(
    `SELECT eaa.*, q.question, q.type, q.marks FROM exam_attempt_answers eaa JOIN questions q ON eaa.question_id = q.id WHERE eaa.attempt_id = ? ORDER BY eaa.id`
  ).all(req.params.id);
  const withCorrect = answers.map((a) => {
    const correct = db.prepare('SELECT id, answer_text FROM answers WHERE question_id = ? AND is_correct = 1').get(a.question_id);
    return { ...a, correct_answer: correct };
  });
  const passed = attempt.score >= (attempt.passing_marks || 0);
  res.json({ attempt: { ...attempt, verification_code: attempt.verification_code || null }, exam, user, answers: withCorrect, passed });
});

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT ea.*, e.title as exam_title, u.name as user_name FROM exam_attempts ea JOIN exams e ON ea.exam_id = e.id JOIN users u ON ea.user_id = u.id WHERE ea.user_id = ? ORDER BY ea.id DESC`
  ).all(req.user.id);
  res.json(rows);
});

export default router;
