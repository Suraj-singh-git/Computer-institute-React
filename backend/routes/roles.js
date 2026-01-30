import { Router } from 'express';
import { getDb } from '../db/index.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM roles ORDER BY name').all();
  res.json(rows);
});

export default router;
