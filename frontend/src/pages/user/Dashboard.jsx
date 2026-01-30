import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  const links = [
    { to: '/user/profile', label: 'My Profile', desc: 'View and edit your profile' },
    { to: '/user/my-courses', label: 'My Courses', desc: 'View enrolled courses' },
    { to: '/user/admission-request', label: 'Admission Request', desc: 'Request admission to a branch' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-amber-400">Computer Institute</Link>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">{user?.name}</span>
          <Link to="/user/profile" className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm">Profile</Link>
          <Link to="/" onClick={(e) => { e.preventDefault(); logout(); }} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-900 text-sm font-medium">Logout</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Student Dashboard</h1>
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
