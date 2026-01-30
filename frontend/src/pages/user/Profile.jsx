import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/user/dashboard" className="text-xl font-semibold text-amber-400">Computer Institute</Link>
        <Link to="/user/dashboard" className="text-slate-300 hover:text-white text-sm">← Dashboard</Link>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">My Profile</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p><span className="text-slate-500 font-medium">Name:</span> {user?.name}</p>
          <p><span className="text-slate-500 font-medium">Email:</span> {user?.email}</p>
          <p><span className="text-slate-500 font-medium">Phone:</span> {user?.phone || '—'}</p>
          <p><span className="text-slate-500 font-medium">Address:</span> {user?.address || '—'}</p>
          <p><span className="text-slate-500 font-medium">Status:</span> {user?.status || 'Active'}</p>
        </div>
      </main>
    </div>
  );
}
