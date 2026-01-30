import { useState, useEffect } from 'react';
import client from '../../api/client';

export default function Reports() {
  const [feeSummary, setFeeSummary] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filterBranch, setFilterBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    Promise.all([
      client.get('/reports/fee-summary').then(({ data }) => setFeeSummary(data)).catch(() => setFeeSummary(null)),
      client.get('/reports/exam-results').then(({ data }) => setExamResults(data)).catch(() => setExamResults([])),
      client.get('/branches').then(({ data }) => setBranches(data)).catch(() => setBranches([])),
    ]).finally(() => setLoading(false));
  }, []);

  const loadFeeSummary = () => {
    client.get('/reports/fee-summary', { params: filterBranch ? { branch_id: filterBranch } : {} })
      .then(({ data }) => setFeeSummary(data)).catch(() => setFeeSummary(null));
  };

  const loadExamResults = () => {
    client.get('/reports/exam-results', { params: filterBranch ? { branch_id: filterBranch } : {} })
      .then(({ data }) => setExamResults(data)).catch(() => setExamResults([]));
  };

  const downloadExport = (path, filename) => {
    setExporting(filename);
    client.get(path, { responseType: 'blob' })
      .then(({ data }) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(data);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .finally(() => setExporting(''));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Reports</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Branch filter:
          <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-300">
            <option value="">All</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <button onClick={() => { loadFeeSummary(); loadExamResults(); }} className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-sm hover:bg-slate-300">Apply filter</button>
      </div>

      {/* Fee summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Fee Summary</h2>
        {loading && !feeSummary ? (
          <p className="text-slate-500">Loading...</p>
        ) : feeSummary ? (
          <div>
            <p className="text-lg font-medium text-slate-700">Total collected: ₹{Number(feeSummary.totalCollected).toFixed(0)} ({feeSummary.count} records)</p>
            <ul className="mt-3 space-y-1 text-sm">
              {feeSummary.byBranch?.map((b) => (
                <li key={b.branch_name} className="flex justify-between"><span>{b.branch_name}</span><span>₹{Number(b.total).toFixed(0)}</span></li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-slate-500">No data</p>
        )}
      </div>

      {/* Exam results */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Exam Results</h2>
        {examResults.length === 0 && !loading ? (
          <p className="text-slate-500">No exam results yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-600">
                <tr>
                  <th className="p-2">Student</th>
                  <th className="p-2">Exam</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200">
                    <td className="p-2">{r.user_name}</td>
                    <td className="p-2">{r.exam_title}</td>
                    <td className="p-2">{r.branch_name}</td>
                    <td className="p-2">{r.score} / {r.total_marks}</td>
                    <td className="p-2"><span className={r.passed ? 'text-green-600 font-medium' : 'text-red-600'}>{r.passed ? 'Passed' : 'Failed'}</span></td>
                    <td className="p-2">{r.submitted_at ? new Date(r.submitted_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Export</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => downloadExport('reports/students-export', 'students.csv')} disabled={!!exporting} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">{exporting === 'students.csv' ? 'Downloading...' : 'Export Students (CSV)'}</button>
          <button onClick={() => downloadExport('reports/fees-export', 'fee-collections.csv')} disabled={!!exporting} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">{exporting === 'fee-collections.csv' ? 'Downloading...' : 'Export Fees (CSV)'}</button>
        </div>
      </div>
    </div>
  );
}
