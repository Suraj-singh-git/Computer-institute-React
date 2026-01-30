import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function Students() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/users', { params: { role: 'student' } }).then(({ data }) => setList(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Students</h1>
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Branch</th><th className="p-3">Status</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.email}</td>
                  <td className="p-3">{row.phone || '—'}</td>
                  <td className="p-3">{row.branch_name || '—'}</td>
                  <td className="p-3">{row.status || 'Active'}</td>
                  <td className="p-3">
                    <Link to={`/students/${row.id}/assign-course`} className="text-amber-600 hover:underline">Assign Course</Link>
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
