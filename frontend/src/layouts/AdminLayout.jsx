import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/branches', label: 'Branches' },
  { to: '/courses', label: 'Courses' },
  { to: '/batches', label: 'Batches' },
  { to: '/students', label: 'Students' },
  { to: '/fee-management', label: 'Fee Management' },
  { to: '/admission-requests', label: 'Admission Requests' },
  { to: '/users', label: 'Users' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link to="/dashboard" className="text-xl font-semibold text-amber-400">Computer Institute</Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-auto">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-3 py-2 rounded-lg text-sm transition ${location.pathname === to ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-slate-800 font-medium">Admin</h1>
          <span className="text-sm text-slate-600">{user?.name} ({user?.email})</span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
