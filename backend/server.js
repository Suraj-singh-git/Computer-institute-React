import express from 'express';
import cors from 'cors';
import { initDb } from './db/index.js';

await initDb();

import authRoutes from './routes/auth.js';
import branchRoutes from './routes/branches.js';
import courseRoutes from './routes/courses.js';
import batchRoutes from './routes/batches.js';
import userRoutes from './routes/users.js';
import assignCourseRoutes from './routes/assignCourses.js';
import feeRoutes from './routes/fees.js';
import admissionRoutes from './routes/admissionRequests.js';
import roleRoutes from './routes/roles.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/branches', authMiddleware, branchRoutes);
app.use('/api/courses', authMiddleware, courseRoutes);
app.use('/api/batches', authMiddleware, batchRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/assign-courses', authMiddleware, assignCourseRoutes);
app.use('/api/fees', authMiddleware, feeRoutes);
app.use('/api/admission-requests', authMiddleware, admissionRoutes);
app.use('/api/roles', authMiddleware, roleRoutes);

app.get('/api/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
