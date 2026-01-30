import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-6">You don't have permission to view this page.</p>
        <Link to="/user/dashboard" className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
