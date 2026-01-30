import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/branches', label: 'Branches' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/batches', label: 'Batches' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/fee-management', label: 'Fee Management' },
  { to: '/admin/admission-requests', label: 'Admission Requests' },
  { to: '/admin/exams', label: 'Exams' },
  { to: '/admin/email-templates', label: 'Email Templates' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/roles', label: 'Roles' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/change-password', label: 'Change Password' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { appName } = useSettings();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link to="/dashboard" className="text-xl font-semibold text-amber-400">{appName}</Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-auto">
          {nav.map(({ to, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to + '/'));
            return (
              <Link
                key={to}
                to={to}
                className={`block px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                {label}
              </Link>
            );
          })}
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
