import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'institute-secret-key';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = db.prepare(
      `SELECT u.id, u.name, u.email, u.phone, u.address, u.admission_date, u.status, u.branch_id, u.role_id, u.is_admin,
        r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?`
    ).get(decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = { ...user, is_admin: !!user.is_admin };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user?.is_admin) return res.status(403).json({ error: 'Admin required' });
  next();
}
