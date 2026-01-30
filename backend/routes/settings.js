import { Router } from 'express';
import { getDb } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM settings LIMIT 1').get();
  res.json(row || {});
});

router.put('/', requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM settings LIMIT 1').get();
  const fields = ['app_name', 'app_icon', 'contact_no', 'email', 'address', 'google_secret_key', 'google_id', 'facebook_key', 'facebook_id', 'onesignal_key', 'onesignal_id', 'mail_mailer', 'mail_host', 'mail_port', 'mail_username', 'mail_password', 'mail_from_address', 'mail_from_name'];
  const data = {};
  for (const f of fields) if (req.body[f] !== undefined) data[f] = req.body[f];
  if (existing) {
    const set = Object.keys(data).map((k) => `${k}=?`).join(', ');
    const vals = Object.values(data);
    db.prepare(`UPDATE settings SET ${set}, updated_at=datetime('now') WHERE id=?`).run(...vals, existing.id);
  } else {
    const keys = ['app_name', 'app_icon', 'contact_no', 'email', 'address', 'google_secret_key', 'google_id', 'facebook_key', 'facebook_id', 'onesignal_key', 'onesignal_id', 'mail_mailer', 'mail_host', 'mail_port', 'mail_username', 'mail_password', 'mail_from_address', 'mail_from_name'];
    const placeholders = keys.map(() => '?').join(', ');
    const vals = keys.map((k) => data[k] ?? null);
    db.prepare(`INSERT INTO settings (${keys.join(', ')}) VALUES (${placeholders})`).run(...vals);
  }
  const row = db.prepare('SELECT * FROM settings LIMIT 1').get();
  res.json(row || {});
});

export default router;
