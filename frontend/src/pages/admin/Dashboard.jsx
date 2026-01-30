import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ branches: 0, courses: 0, students: 0, pendingAdmissions: 0, exams: 0, totalFees: 0 });
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [recentFees, setRecentFees] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/branches').then((r) => r.data.length),
      client.get('/courses').then((r) => r.data.length),
      client.get('/users', { params: { role: 'student' } }).then((r) => r.data.length),
      client.get('/admission-requests', { params: { status: 'pending' } }).then((r) => r.data.length),
      client.get('/exams').then((r) => r.data.length),
      client.get('/fees').then((r) => ({ count: r.data.length, total: r.data.reduce((s, f) => s + (f.paid_amount || 0), 0) })),
      client.get('/admission-requests').then((r) => r.data.slice(0, 5)),
      client.get('/fees').then((r) => r.data.slice(0, 5)),
      client.get('/reports/recent-attempts', { params: { limit: 5 } }).then((r) => r.data).catch(() => []),
    ]).then(([branches, courses, students, pendingAdmissions, exams, feeData, admissions, fees, attempts]) => {
      setStats({ branches, courses, students, pendingAdmissions, exams, totalFees: feeData.total });
      setRecentAdmissions(admissions);
      setRecentFees(fees);
      setRecentAttempts(attempts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Branches', value: stats.branches, to: '/admin/branches', color: 'bg-amber-500' },
    { label: 'Courses', value: stats.courses, to: '/admin/courses', color: 'bg-emerald-500' },
    { label: 'Students', value: stats.students, to: '/admin/students', color: 'bg-blue-500' },
    { label: 'Pending Admissions', value: stats.pendingAdmissions, to: '/admin/admission-requests', color: 'bg-violet-500' },
    { label: 'Exams', value: stats.exams, to: '/admin/exams', color: 'bg-sky-500' },
    { label: 'Fee Collected (₹)', value: Number(stats.totalFees).toFixed(0), to: '/admin/fee-management', color: 'bg-rose-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {cards.map(({ label, value, to, color }) => (
          <Link key={to} to={to} className={`${color} text-white rounded-xl p-6 hover:opacity-90 transition`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-white/90 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Recent Admission Requests</h2>
          {recentAdmissions.length === 0 ? (
            <p className="text-slate-500 text-sm">No requests yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentAdmissions.map((r) => (
                <li key={r.id} className="flex justify-between items-center">
                  <span>{r.user_name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${r.status === 'pending' ? 'bg-amber-100 text-amber-800' : r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-slate-100'}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/admission-requests" className="text-amber-600 text-sm mt-2 inline-block hover:underline">View all →</Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Recent Fee Records</h2>
          {recentFees.length === 0 ? (
            <p className="text-slate-500 text-sm">No fee records yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentFees.map((f) => (
                <li key={f.id} className="flex justify-between items-center">
                  <span>{f.user_name}</span>
                  <span>₹{f.paid_amount} / ₹{f.total_fee}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/fee-management" className="text-amber-600 text-sm mt-2 inline-block hover:underline">View all →</Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Recent Exam Attempts</h2>
          {recentAttempts.length === 0 ? (
            <p className="text-slate-500 text-sm">No attempts yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentAttempts.map((a) => (
                <li key={a.id} className="flex justify-between items-center">
                  <span>{a.user_name} · {a.exam_title}</span>
                  <span className={a.status === 'submitted' ? 'text-slate-600' : 'text-amber-600'}>{a.status === 'submitted' ? `${a.score}/${a.total_marks}` : 'In progress'}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/reports" className="text-amber-600 text-sm mt-2 inline-block hover:underline">Reports →</Link>
        </div>
      </div>
    </div>
  );
}
