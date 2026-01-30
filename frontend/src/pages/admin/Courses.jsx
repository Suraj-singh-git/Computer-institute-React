import { useState, useEffect } from 'react';
import client from '../../api/client';

export default function Courses() {
  const [list, setList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ branch_id: '', title: '', description: '', fee: '', duration: 0, status: true });

  const load = () => client.get('/courses').then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    client.get('/branches').then(({ data }) => setBranches(data));
  }, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ branch_id: '', title: '', description: '', fee: '', duration: 0, status: true });
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ branch_id: row.branch_id || '', title: row.title, description: row.description || '', fee: row.fee, duration: row.duration || 0, status: !!row.status });
  };

  const save = async () => {
    const payload = { ...form, branch_id: form.branch_id || null, fee: Number(form.fee), duration: Number(form.duration) };
    if (editing === 'new') await client.post('/courses', payload);
    else await client.put(`/courses/${editing}`, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this course?')) return;
    await client.delete(`/courses/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Courses</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Add Course</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'New Course' : 'Edit Course'}</h2>
            <select value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
              <option value="">No branch</option>
              {branches.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={2} />
            <input type="number" placeholder="Fee" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <input type="number" placeholder="Duration (months)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.status} onChange={(e) => setForm({ ...form, status: e.target.checked })} /> Active</label>
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
              <tr><th className="p-3">Title</th><th className="p-3">Branch</th><th className="p-3">Fee</th><th className="p-3">Duration</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.title}</td>
                  <td className="p-3">{row.branch_name || '—'}</td>
                  <td className="p-3">{row.fee}</td>
                  <td className="p-3">{row.duration} mo</td>
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
