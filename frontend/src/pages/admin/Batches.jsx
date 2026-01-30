import { useState, useEffect } from 'react';
import client from '../../api/client';

export default function Batches() {
  const [list, setList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ branch_id: '', course_id: '', name: '', start_time: '', end_time: '', start_date: '', end_date: '', is_active: true });

  const load = () => client.get('/batches').then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    client.get('/branches').then(({ data }) => setBranches(data));
    client.get('/courses').then(({ data }) => setCourses(data));
  }, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ branch_id: '', course_id: '', name: '', start_time: '', end_time: '', start_date: '', end_date: '', is_active: true });
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ branch_id: row.branch_id, course_id: row.course_id, name: row.name, start_time: row.start_time || '', end_time: row.end_time || '', start_date: row.start_date || '', end_date: row.end_date || '', is_active: !!row.is_active });
  };

  const save = async () => {
    const payload = { ...form, branch_id: Number(form.branch_id), course_id: Number(form.course_id) };
    if (editing === 'new') await client.post('/batches', payload);
    else await client.put(`/batches/${editing}`, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this batch?')) return;
    await client.delete(`/batches/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Batches</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Add Batch</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4 overflow-auto">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'New Batch' : 'Edit Batch'}</h2>
            <select value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
              <option value="">Select branch</option>
              {branches.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
              <option value="">Select course</option>
              {courses.filter((c) => (!form.branch_id || c.branch_id == form.branch_id) && c.status).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input placeholder="Batch name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <input type="time" placeholder="Start time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input type="time" placeholder="End time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input type="date" placeholder="Start date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input type="date" placeholder="End date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Name</th><th className="p-3">Course</th><th className="p-3">Branch</th><th className="p-3">Active</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.course_title}</td>
                  <td className="p-3">{row.branch_name}</td>
                  <td className="p-3">{row.is_active ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    <button onClick={() => openEdit(row)} className="text-amber-600 hover:underline mr-2">Edit</button>
                    <button onClick={() => remove(row.id)} className="text-red-600 hover:underline">Delete</button>
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
