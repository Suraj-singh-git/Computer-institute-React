import nodemailer from 'nodemailer';
import { getDb } from '../db/index.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const db = getDb();
  const s = db.prepare('SELECT mail_host, mail_port, mail_username, mail_password, mail_from_address, mail_from_name FROM settings LIMIT 1').get();
  if (!s?.mail_host) return null;
  transporter = nodemailer.createTransport({
    host: s.mail_host,
    port: Number(s.mail_port) || 587,
    secure: false,
    auth: s.mail_username ? { user: s.mail_username, pass: s.mail_password } : undefined,
  });
  return transporter;
}

export async function sendEmail(to, subject, html) {
  const db = getDb();
  const s = db.prepare('SELECT mail_from_address, mail_from_name, app_name FROM settings LIMIT 1').get();
  const from = s?.mail_from_address || s?.app_name || 'noreply@institute.com';
  const fromName = s?.mail_from_name || s?.app_name || 'Institute';
  const trans = getTransporter();
  if (!trans) {
    console.log('[Notification] Email not configured. Would send to', to, ':', subject);
    return { ok: false, reason: 'mail_not_configured' };
  }
  try {
    await trans.sendMail({
      from: `"${fromName}" <${from}>`,
      to,
      subject,
      html: html || subject,
    });
    return { ok: true };
  } catch (err) {
    console.error('[Notification] Email error:', err.message);
    return { ok: false, reason: err.message };
  }
}

export function sendSMS(phone, message) {
  if (!phone) return { ok: false, reason: 'no_phone' };
  console.log('[Notification] SMS (stub) to', phone, ':', message?.slice(0, 50) + '...');
  return { ok: true };
}

export async function notifyAdmissionApproved(userId, branchName) {
  const db = getDb();
  const user = db.prepare('SELECT name, email, phone FROM users WHERE id = ?').get(userId);
  if (!user) return;
  const subject = 'Admission Approved';
  const html = `<p>Dear ${user.name},</p><p>Your admission request for <strong>${branchName}</strong> has been approved.</p><p>Please visit the institute to complete further formalities.</p>`;
  await sendEmail(user.email, subject, html);
  sendSMS(user.phone, `Admission approved for ${branchName}. Visit institute to complete formalities.`);
}

export async function notifyFeeReceived(userId, amount, courseTitle) {
  const db = getDb();
  const user = db.prepare('SELECT name, email, phone FROM users WHERE id = ?').get(userId);
  if (!user) return;
  const subject = 'Fee Received';
  const html = `<p>Dear ${user.name},</p><p>We have received your payment of <strong>₹${amount}</strong> for <strong>${courseTitle}</strong>.</p><p>Thank you.</p>`;
  await sendEmail(user.email, subject, html);
  sendSMS(user.phone, `Fee of ₹${amount} received for ${courseTitle}. Thank you.`);
}
