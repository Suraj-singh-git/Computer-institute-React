import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import client from '../api/client';

export default function ResetPassword() {
  const { appName } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await client.post('/auth/verify-otp', { email, otp, password });
      navigate('/login', { state: { message: 'Password updated. Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP or request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/login" className="text-2xl font-semibold text-amber-400">{appName}</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Reset Password</h2>
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
            type="text"
            placeholder="OTP (6 digits)"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 mb-6 focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50 transition">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <p className="mt-4 text-center text-slate-400 text-sm">
            <Link to="/login" className="text-amber-400 hover:underline">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
