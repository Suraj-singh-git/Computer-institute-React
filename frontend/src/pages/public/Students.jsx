import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import client from '../../api/client';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/public/students', { params: { limit: 50 } }).then((r) => setStudents(r.data)).catch(() => setStudents([])).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Recently Joined Students</h1>
        <p className="text-slate-600 mb-8">Our students across branches.</p>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : students.length === 0 ? (
          <p className="text-slate-500">No students yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {students.map((s, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 px-4 py-3 shadow-sm">
                <p className="font-medium text-slate-800">{s.name}</p>
                <p className="text-slate-500 text-sm">{s.branch_name || '—'}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8">
          <Link to="/" className="text-amber-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
