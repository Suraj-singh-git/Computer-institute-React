import { Router } from 'express';
import { getDb } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);
router.use(requireAdmin);

// Fee summary: total collected, optional branch filter
router.get('/fee-summary', (req, res) => {
  const db = getDb();
  const { branch_id } = req.query;
  let sql = `SELECT fc.id, fc.paid_amount, b.name as branch_name FROM fee_collections fc JOIN branches b ON fc.branch_id = b.id WHERE 1=1`;
  const params = [];
  if (branch_id) { sql += ' AND fc.branch_id = ?'; params.push(branch_id); }
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  const totalCollected = rows.reduce((s, r) => s + (Number(r.paid_amount) || 0), 0);
  const byBranch = {};
  rows.forEach((r) => {
    byBranch[r.branch_name] = (byBranch[r.branch_name] || 0) + (Number(r.paid_amount) || 0);
  });
  res.json({
    totalCollected,
    count: rows.length,
    byBranch: Object.entries(byBranch).map(([branch_name, total]) => ({ branch_name, total })),
  });
});

// Exam results: list attempts with user, exam, score, passed (optional exam_id / branch_id)
router.get('/exam-results', (req, res) => {
  const db = getDb();
  const { exam_id, branch_id } = req.query;
  let sql = `SELECT ea.id, ea.user_id, ea.exam_id, ea.score, ea.total_marks, ea.passing_marks, ea.status, ea.submitted_at,
    e.title as exam_title, e.branch_id as exam_branch_id, u.name as user_name, u.email as user_email,
    b.name as branch_name FROM exam_attempts ea
    JOIN exams e ON ea.exam_id = e.id JOIN users u ON ea.user_id = u.id JOIN branches b ON e.branch_id = b.id
    WHERE ea.status = 'submitted'`;
  const params = [];
  if (exam_id) { sql += ' AND ea.exam_id = ?'; params.push(exam_id); }
  if (branch_id) { sql += ' AND e.branch_id = ?'; params.push(branch_id); }
  sql += ' ORDER BY ea.submitted_at DESC';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  const results = rows.map((r) => ({
    id: r.id,
    user_name: r.user_name,
    user_email: r.user_email,
    exam_title: r.exam_title,
    branch_name: r.branch_name,
    score: r.score,
    total_marks: r.total_marks,
    passing_marks: r.passing_marks,
    passed: r.score >= (r.passing_marks || 0),
    submitted_at: r.submitted_at,
  }));
  res.json(results);
});

// Recent exam attempts (for admin dashboard)
router.get('/recent-attempts', (req, res) => {
  const db = getDb();
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const rows = db.prepare(
    `SELECT ea.id, ea.score, ea.total_marks, ea.status, ea.submitted_at, e.title as exam_title, u.name as user_name
     FROM exam_attempts ea JOIN exams e ON ea.exam_id = e.id JOIN users u ON ea.user_id = u.id
     ORDER BY ea.id DESC LIMIT ?`
  ).all(limit);
  res.json(rows);
});

// CSV export: students
router.get('/students-export', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.address, u.status, u.admission_date, b.name as branch_name, r.name as role_name
     FROM users u LEFT JOIN branches b ON u.branch_id = b.id LEFT JOIN roles r ON u.role_id = r.id WHERE r.slug = 'student' ORDER BY u.name`
  ).all();
  const header = 'Id,Name,Email,Phone,Address,Status,Admission Date,Branch,Role\n';
  const escape = (v) => (v == null ? '' : String(v).replace(/"/g, '""'));
  const csv = header + rows.map((r) =>
    [r.id, r.name, r.email, r.phone || '', r.address || '', r.status, r.admission_date || '', r.branch_name || '', r.role_name || ''].map(escape).join(',')
  ).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
  res.send('\uFEFF' + csv);
});

// CSV export: fee collections
router.get('/fees-export', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT fc.id, u.name as user_name, u.email, c.title as course_title, b.name as batch_name, br.name as branch_name,
     fc.total_fee, fc.paid_amount, fc.remaining_amount, fc.status, fc.payment_mode
     FROM fee_collections fc JOIN users u ON fc.user_id = u.id JOIN assign_courses ac ON fc.assign_course_id = ac.id
     JOIN courses c ON ac.course_id = c.id JOIN batches b ON ac.batch_id = b.id JOIN branches br ON ac.branch_id = br.id
     ORDER BY fc.id DESC`
  ).all();
  const header = 'Id,Student,Email,Course,Batch,Branch,Total Fee,Paid,Remaining,Status,Payment Mode\n';
  const escape = (v) => (v == null ? '' : String(v).replace(/"/g, '""'));
  const csv = header + rows.map((r) =>
    [r.id, r.user_name, r.email, r.course_title, r.batch_name, r.branch_name, r.total_fee, r.paid_amount, r.remaining_amount, r.status, r.payment_mode].map(escape).join(',')
  ).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=fee-collections.csv');
  res.send('\uFEFF' + csv);
});

export default router;
