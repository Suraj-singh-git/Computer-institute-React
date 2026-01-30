import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Login() {
  const { appName } = useSettings();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await client.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate(data.user.is_admin ? '/dashboard' : '/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold text-amber-400">{appName}</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Sign in</h2>
          {successMessage && <p className="text-green-400 text-sm mb-4">{successMessage}</p>}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 mb-6 focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50 transition">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="mt-3 text-center text-slate-400 text-sm">
            <Link to="/forgot-password" className="text-amber-400 hover:underline">Forgot password?</Link>
          </p>
          <p className="mt-2 text-center text-slate-400 text-sm">
            Don't have an account? <Link to="/register" className="text-amber-400 hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
