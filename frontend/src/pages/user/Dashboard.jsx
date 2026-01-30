import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import client from '../../api/client';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { appName } = useSettings();
  const [exams, setExams] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/exam-attempts/available').then((r) => r.data).catch(() => []),
      client.get('/fees').then((r) => r.data).catch(() => []),
    ]).then(([examList, feeList]) => {
      setExams(examList);
      setFees(feeList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const links = [
    { to: '/user/profile', label: 'My Profile', desc: 'View and edit your profile' },
    { to: '/user/my-courses', label: 'My Courses', desc: 'View enrolled courses' },
    { to: '/user/my-exams', label: 'My Exams', desc: 'Take exams and view marksheets' },
    { to: '/user/admission-request', label: 'Admission Request', desc: 'Request admission to a branch' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-amber-400">{appName}</Link>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">{user?.name}</span>
          <Link to="/user/profile" className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm">Profile</Link>
          <Link to="/" onClick={(e) => { e.preventDefault(); logout(); }} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-900 text-sm font-medium">Logout</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Student Dashboard</h1>

        {!loading && (exams.filter((e) => e.attempt?.status !== 'submitted').length > 0 || fees.filter((f) => f.status !== 'completed').length > 0) && (
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {exams.filter((e) => e.attempt?.status !== 'submitted').length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-800 mb-3">Upcoming / In-progress Exams</h2>
                <ul className="space-y-2 text-sm">
                  {exams.filter((e) => e.attempt?.status !== 'submitted').slice(0, 3).map((e) => (
                    <li key={e.id} className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{e.title}</span>
                      <Link to={e.attempt?.status === 'in_progress' ? `/user/take-exam/${e.attempt.id}` : `/user/start-exam/${e.id}`} className="text-amber-600 hover:underline">
                        {e.attempt?.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/user/my-exams" className="text-amber-600 text-sm mt-2 inline-block hover:underline">All exams →</Link>
              </div>
            )}
            {fees.filter((f) => f.status !== 'completed').length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-800 mb-3">Fee Status</h2>
                <ul className="space-y-2 text-sm">
                  {fees.filter((f) => f.status !== 'completed').slice(0, 3).map((f) => (
                    <li key={f.id} className="flex justify-between items-center">
                      <span className="text-slate-700">{f.course_title}</span>
                      <span>₹{f.paid_amount} / ₹{f.total_fee} <span className="text-slate-500">({f.status})</span></span>
                    </li>
                  ))}
                </ul>
                <Link to="/user/my-courses" className="text-amber-600 text-sm mt-2 inline-block hover:underline">My courses →</Link>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {links.map(({ to, label, desc }) => (
            <Link key={to} to={to} className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition">
              <h2 className="font-semibold text-slate-800 mb-1">{label}</h2>
              <p className="text-sm text-slate-500">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
