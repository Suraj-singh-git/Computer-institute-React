import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';
import { notifyFeeReceived } from '../services/notification.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  let user_id = req.query.user_id;
  if (!req.user.is_admin) user_id = req.user.id; // students see only their own fees
  let sql = `SELECT fc.*, u.name as user_name, u.email, c.title as course_title, ac.id as assign_course_id
    FROM fee_collections fc
    JOIN users u ON fc.user_id = u.id
    JOIN assign_courses ac ON fc.assign_course_id = ac.id
    JOIN courses c ON ac.course_id = c.id WHERE 1=1`;
  const params = [];
  if (user_id) { sql += ' AND fc.user_id = ?'; params.push(user_id); }
  sql += ' ORDER BY fc.id DESC';
  const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all();
  res.json(rows);
});

router.get('/:id/invoice', (req, res) => {
  const db = getDb();
  const row = db.prepare(
    `SELECT fc.*, u.name as user_name, u.email, u.phone, c.title as course_title, b.name as batch_name, br.name as branch_name, br.address as branch_address, br.phone as branch_phone FROM fee_collections fc
    JOIN users u ON fc.user_id = u.id JOIN assign_courses ac ON fc.assign_course_id = ac.id JOIN courses c ON ac.course_id = c.id JOIN batches b ON ac.batch_id = b.id JOIN branches br ON ac.branch_id = br.id WHERE fc.id = ?`
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Fee collection not found' });
  const payments = db.prepare('SELECT fp.*, u.name as received_by_name FROM fee_payments fp LEFT JOIN users u ON fp.received_by = u.id WHERE fp.fee_collection_id = ? ORDER BY fp.payment_date DESC').all(req.params.id);
  const settings = db.prepare('SELECT * FROM settings LIMIT 1').get();
  res.json({ feeCollection: { ...row, payments }, settings: settings || {} });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare(
    `SELECT fc.*, u.name as user_name, u.email, u.phone, c.title as course_title, b.name as batch_name, br.name as branch_name FROM fee_collections fc
    JOIN users u ON fc.user_id = u.id JOIN assign_courses ac ON fc.assign_course_id = ac.id JOIN courses c ON ac.course_id = c.id JOIN batches b ON ac.batch_id = b.id JOIN branches br ON ac.branch_id = br.id WHERE fc.id = ?`
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Fee collection not found' });
  const payments = db.prepare('SELECT fp.*, u.name as received_by_name FROM fee_payments fp LEFT JOIN users u ON fp.received_by = u.id WHERE fp.fee_collection_id = ? ORDER BY fp.payment_date DESC').all(req.params.id);
  res.json({ ...row, payments });
});

router.post('/', requireAdmin, (req, res) => {
  const { user_id, assign_course_id, total_fee, payment_mode, due_date, next_installment_date, remarks } = req.body;
  if (!user_id || !assign_course_id || total_fee == null) return res.status(400).json({ error: 'user_id, assign_course_id, total_fee required' });
  const mode = payment_mode || 'one_time';
  const total = Number(total_fee);
  const db = getDb();
  const r = db.prepare(
    'INSERT INTO fee_collections (user_id, assign_course_id, total_fee, payment_mode, paid_amount, remaining_amount, status, due_date, next_installment_date, remarks) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?)'
  ).run(user_id, assign_course_id, total, mode, total, 'pending', due_date || null, next_installment_date || null, remarks || null);
  const row = db.prepare('SELECT * FROM fee_collections WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.post('/:id/payments', requireAdmin, (req, res) => {
  const { amount, payment_date, payment_method, transaction_id, remarks } = req.body;
  if (!amount || !payment_date) return res.status(400).json({ error: 'amount and payment_date required' });
  const db = getDb();
  const fc = db.prepare('SELECT * FROM fee_collections WHERE id = ?').get(req.params.id);
  if (!fc) return res.status(404).json({ error: 'Fee collection not found' });
  const amt = Number(amount);
  const newPaid = fc.paid_amount + amt;
  const remaining = Math.max(0, fc.remaining_amount - amt);
  const status = remaining <= 0 ? 'completed' : 'partial';
  db.prepare(
    'INSERT INTO fee_payments (fee_collection_id, amount, payment_date, payment_method, transaction_id, remarks, received_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.params.id, amt, payment_date, payment_method || null, transaction_id || null, remarks || null, req.user.id);
  db.prepare('UPDATE fee_collections SET paid_amount=?, remaining_amount=?, status=?, updated_at=datetime(\'now\') WHERE id=?').run(newPaid, remaining, status, req.params.id);
  const fcRow = db.prepare('SELECT fc.user_id, c.title as course_title FROM fee_collections fc JOIN assign_courses ac ON fc.assign_course_id = ac.id JOIN courses c ON ac.course_id = c.id WHERE fc.id = ?').get(req.params.id);
  if (fcRow) notifyFeeReceived(fcRow.user_id, amt, fcRow.course_title).catch(() => {});
  const row = db.prepare('SELECT * FROM fee_collections WHERE id = ?').get(req.params.id);
  res.status(201).json(row);
});

export default router;
