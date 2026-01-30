import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import client from '../../api/client';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/public/courses').then((r) => setCourses(r.data)).catch(() => setCourses([])).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Our Courses</h1>
        <p className="text-slate-600 mb-8">We provide all types of computer and technical courses – DCA, CCA, Tally, DRA and more.</p>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-slate-500">No courses available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">{c.title}</h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{c.description || '—'}</p>
                <p className="text-amber-600 font-medium">₹{c.fee} · Duration: {c.duration} months</p>
                <p className="text-slate-500 text-sm mt-1">{c.branch_name}</p>
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
