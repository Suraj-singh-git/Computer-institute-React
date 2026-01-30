import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import client from '../../api/client';
import { useSettings } from '../../context/SettingsContext';

export default function VerifyResult() {
  const { appName } = useSettings();
  const [attemptId, setAttemptId] = useState('');
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setData(null);
    if (!attemptId.trim() || !code.trim()) {
      setError('Enter Attempt ID and Verification Code.');
      return;
    }
    setLoading(true);
    try {
      const { data: res } = await client.get('/public/verify-result', { params: { attempt_id: attemptId.trim(), code: code.trim() } });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.error || 'Result not found or invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Verify Result / Marksheet</h1>
        <p className="text-slate-600 mb-8">Enter your Attempt ID and 6-digit verification code (received after exam submission) to view your marksheet without login.</p>

        <form onSubmit={handleVerify} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Attempt ID</label>
            <input type="text" placeholder="e.g. 1" value={attemptId} onChange={(e) => setAttemptId(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <label className="block text-sm font-medium text-slate-700">Verification Code (6 digits)</label>
            <input type="text" placeholder="e.g. 123456" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 rounded-lg border border-slate-300 font-mono" />
          </div>
          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="mt-6 w-full px-4 py-3 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify & View Marksheet'}
          </button>
        </form>

        {data && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm print:shadow-none">
            <div className="flex items-center justify-between mb-6 no-print">
              <h2 className="text-xl font-bold text-slate-800">Marksheet</h2>
              <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Print</button>
            </div>
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-slate-800">{data.exam?.title}</h3>
              <p className="text-slate-500 text-sm">{data.exam?.course_title} · {data.exam?.branch_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <span className="text-slate-500">Candidate:</span><span className="font-medium">{data.user?.name}</span>
              <span className="text-slate-500">Email:</span><span>{data.user?.email}</span>
              <span className="text-slate-500">Score:</span><span className="font-bold">{data.attempt?.score} / {data.attempt?.total_marks}</span>
              <span className="text-slate-500">Passing:</span><span>{data.attempt?.passing_marks}</span>
              <span className="text-slate-500">Status:</span><span className={data.passed ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{data.passed ? 'PASSED' : 'FAILED'}</span>
            </div>
            <h4 className="font-medium text-slate-800 mb-3">Question-wise</h4>
            <ul className="space-y-3">
              {data.answers?.map((a, i) => (
                <li key={a.id} className="border-b border-slate-100 pb-2 text-sm">
                  <p className="font-medium text-slate-700">Q{i + 1}: {a.question}</p>
                  <p className="text-slate-500">Marks: {a.marks_awarded} / {a.marks}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Attempt ID and verification code are shown after you submit an exam (logged-in students).</p>
          <Link to="/login" className="text-amber-600 hover:underline mt-2 inline-block">Student Login</Link>
        </div>
        <div className="mt-6">
          <Link to="/" className="text-amber-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
