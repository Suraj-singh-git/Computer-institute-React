import { useState, useEffect } from 'react';
import client from '../../api/client';

export default function AdmissionRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => client.get('/admission-requests', filter ? { params: { status: filter } } : {}).then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, [filter]);

  const [processing, setProcessing] = useState(null);
  const [processForm, setProcessForm] = useState({ status: 'approved', admin_notes: '' });

  const processRequest = async (e) => {
    e.preventDefault();
    await client.put(`/admission-requests/${processing}/process`, processForm);
    setProcessing(null);
    setProcessForm({ status: 'approved', admin_notes: '' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Admission Requests</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-300">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">Process Request</h2>
            <select value={processForm.status} onChange={(e) => setProcessForm({ ...processForm, status: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <textarea placeholder="Admin notes" value={processForm.admin_notes} onChange={(e) => setProcessForm({ ...processForm, admin_notes: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={3} />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setProcessing(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={processRequest} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Submit</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Student</th><th className="p-3">Branch</th><th className="p-3">Message</th><th className="p-3">Status</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.user_name}<br /><span className="text-slate-500 text-sm">{row.email}</span></td>
                  <td className="p-3">{row.branch_name}</td>
                  <td className="p-3 max-w-xs truncate">{row.message || '—'}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${row.status === 'pending' ? 'bg-amber-100 text-amber-800' : row.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{row.status}</span></td>
                  <td className="p-3">
                    {row.status === 'pending' && (
                      <button onClick={() => { setProcessing(row.id); setProcessForm({ status: 'approved', admin_notes: '' }); }} className="text-amber-600 hover:underline">Process</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
