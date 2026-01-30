import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function AdmissionRequest() {
  const [branches, setBranches] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/branches').then(({ data }) => setBranches(data.filter(b => b.is_active)));
    client.get('/admission-requests/my').then(({ data }) => setMyRequests(data)).catch(() => setMyRequests([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await client.post('/admission-requests', { branch_id: Number(branchId), message });
      setBranchId('');
      setMessage('');
      const { data } = await client.get('/admission-requests/my');
      setMyRequests(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/user/dashboard" className="text-xl font-semibold text-amber-400">Computer Institute</Link>
        <Link to="/user/dashboard" className="text-slate-300 hover:text-white text-sm">← Dashboard</Link>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Admission Request</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <label className="block text-sm font-medium text-slate-700 mb-2">Branch</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 mb-4"
            required
          >
            <option value="">Select branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
          <label className="block text-sm font-medium text-slate-700 mb-2">Message (optional)</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 mb-4" rows={3} />
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
        <h2 className="text-lg font-medium text-slate-800 mb-3">My Requests</h2>
        <ul className="space-y-2">
          {myRequests.map((r) => (
            <li key={r.id} className="bg-white rounded-lg border border-slate-200 p-3 flex justify-between items-center">
              <span>{r.branch_name} — <span className={`font-medium ${r.status === 'pending' ? 'text-amber-600' : r.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{r.status}</span></span>
            </li>
          ))}
          {myRequests.length === 0 && <p className="text-slate-500 text-sm">No requests yet.</p>}
        </ul>
      </main>
    </div>
  );
}
