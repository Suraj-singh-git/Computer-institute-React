import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';

export default function MyCourses() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    client.get('/assign-courses', { params: { user_id: user.id } })
      .then(({ data }) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/user/dashboard" className="text-xl font-semibold text-amber-400">Computer Institute</Link>
        <Link to="/user/dashboard" className="text-slate-300 hover:text-white text-sm">← Dashboard</Link>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">My Courses</h1>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500">No courses enrolled yet.</p>
        ) : (
          <ul className="space-y-4">
            {list.filter(a => a.is_active).map((a) => (
              <li key={a.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-800">{a.course_title}</h2>
                <p className="text-sm text-slate-500">Batch: {a.batch_name} · Branch: {a.branch_name}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
