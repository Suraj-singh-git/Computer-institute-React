import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import client from '../../api/client';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/public/branches').then((r) => setBranches(r.data)).catch(() => setBranches([])).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Our Branches</h1>
        <p className="text-slate-600 mb-8">Find your nearest UTEI center.</p>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : branches.length === 0 ? (
          <p className="text-slate-500">No branches available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800">{b.name}</h2>
                <p className="text-slate-500 text-sm mt-1">Code: {b.code}</p>
                <p className="text-slate-600 mt-2">{b.address || '—'}</p>
                {b.phone && <p className="text-amber-600 mt-2">📞 {b.phone}</p>}
                {b.email && <p className="text-slate-600 text-sm">✉ {b.email}</p>}
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
