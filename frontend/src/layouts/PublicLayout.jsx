import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const SITE_NAME = 'UMA Technical & Electrical Institute';
const SITE_SHORT = 'UTEI';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/branches', label: 'Branches' },
  { to: '/students', label: 'Students' },
  { to: '/news-events', label: 'News & Events' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/verify-result', label: 'Verify Result' },
];

export default function PublicLayout({ children }) {
  const location = useLocation();
  const { appName, contactNo, email, address } = useSettings();
  const { user } = useAuth();
  const displayName = appName || SITE_NAME;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-lg shrink-0">
                {SITE_SHORT}
              </div>
              <div>
                <span className="font-bold text-amber-400 text-lg block">{SITE_SHORT}</span>
                <span className="text-xs text-slate-300 hidden sm:block">{SITE_NAME}</span>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {contactNo && <a href={`tel:${contactNo}`} className="text-amber-400 text-sm">📞 {contactNo}</a>}
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-2 py-1 rounded text-sm font-medium transition ${location.pathname === to ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'}`}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <Link to={user.is_admin ? '/dashboard' : '/user/dashboard'} className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 font-medium text-sm hover:bg-amber-400">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/verify-result" className="px-3 py-1.5 rounded-lg border border-amber-500/50 text-amber-400 text-sm hover:bg-amber-500/10">
                    Verify Result
                  </Link>
                  <Link to="/login" className="px-3 py-1.5 rounded-lg border border-amber-500/50 text-amber-400 text-sm hover:bg-amber-500/10">
                    Login
                  </Link>
                  <Link to="/register" className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 font-medium text-sm hover:bg-amber-400">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-amber-400 text-lg">{SITE_SHORT}</p>
              <p className="text-sm">{displayName}</p>
              {address && <p className="text-sm mt-1">{address}</p>}
              {contactNo && <p className="text-sm">Contact: {contactNo}</p>}
              {email && <p className="text-sm">Email: {email}</p>}
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/contact" className="hover:text-amber-400">Contact Us</Link>
              <Link to="/verify-result" className="hover:text-amber-400">Verify Result</Link>
              <Link to="/login" className="hover:text-amber-400">Login</Link>
            </div>
          </div>
          <p className="text-center text-slate-500 text-xs mt-6">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
