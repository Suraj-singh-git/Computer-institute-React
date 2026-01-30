import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const exam_id = req.query.exam_id;
  if (!exam_id) return res.status(400).json({ error: 'exam_id required' });
  const rows = db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY "order", id').all(exam_id);
  const withAnswers = rows.map((q) => {
    const answers = db.prepare('SELECT * FROM answers WHERE question_id = ? ORDER BY "order", id').all(q.id);
    return { ...q, answers };
  });
  res.json(withAnswers);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Question not found' });
  const answers = db.prepare('SELECT * FROM answers WHERE question_id = ? ORDER BY "order", id').all(row.id);
  res.json({ ...row, answers });
});

router.post('/', requireAdmin, (req, res) => {
  const { exam_id, type, question, marks, order, is_active, answers } = req.body;
  if (!exam_id || !question) return res.status(400).json({ error: 'exam_id and question required' });
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO questions (exam_id, type, question, marks, "order", is_active) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(exam_id, type || 'mcq', question, Number(marks) || 1, Number(order) || 0, is_active !== false ? 1 : 0);
  const qId = r.lastInsertRowid;
  if (Array.isArray(answers) && answers.length) {
    const ins = db.prepare('INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES (?, ?, ?, ?)');
    answers.forEach((a, i) => ins.run(qId, a.answer_text || '', a.is_correct ? 1 : 0, a.order ?? i));
  }
  const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(qId);
  const ans = db.prepare('SELECT * FROM answers WHERE question_id = ? ORDER BY "order"').all(qId);
  res.status(201).json({ ...row, answers: ans });
});

router.put('/:id', requireAdmin, (req, res) => {
  const { type, question, marks, order, is_active, answers } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Question not found' });
  db.prepare(
    'UPDATE questions SET type=?, question=?, marks=?, "order"=?, is_active=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(type ?? existing.type, question ?? existing.question, marks != null ? Number(marks) : existing.marks, order != null ? Number(order) : existing.order, is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active, req.params.id);
  if (Array.isArray(answers)) {
    db.prepare('DELETE FROM answers WHERE question_id = ?').run(req.params.id);
    const ins = db.prepare('INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES (?, ?, ?, ?)');
    answers.forEach((a, i) => ins.run(req.params.id, a.answer_text || '', a.is_correct ? 1 : 0, a.order ?? i));
  }
  const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  const ans = db.prepare('SELECT * FROM answers WHERE question_id = ? ORDER BY "order"').all(req.params.id);
  res.json({ ...row, answers: ans });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const r = db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Question not found' });
  res.status(204).send();
});

export default router;
