import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import client from '../api/client';

export default function ForgotPassword() {
  const { appName } = useSettings();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpDev, setOtpDev] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOtpDev('');
    setLoading(true);
    try {
      const res = await client.post('/auth/request-otp', { email });
      const otp = res.headers['x-otp-dev'];
      if (otp) setOtpDev(`Dev mode: OTP is ${otp}`);
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed');
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
          <h2 className="text-xl font-semibold text-white mb-6">Forgot Password</h2>
          <p className="text-slate-400 text-sm mb-4">Enter your admin email. An OTP will be sent (in dev, check response header or console).</p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {otpDev && <p className="text-amber-400 text-sm mb-4">{otpDev}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 mb-6 focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50 transition">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
          <p className="mt-4 text-center text-slate-400 text-sm">
            <Link to="/login" className="text-amber-400 hover:underline">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
