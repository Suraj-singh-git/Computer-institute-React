import { useState, useEffect } from 'react';
import client from '../../api/client';

export default function Branches() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', address: '', phone: '', email: '', is_active: true });

  const load = () => client.get('/branches').then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ name: '', code: '', address: '', phone: '', email: '', is_active: true });
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ name: row.name, code: row.code, address: row.address || '', phone: row.phone || '', email: row.email || '', is_active: !!row.is_active });
  };

  const save = async () => {
    if (editing === 'new') {
      await client.post('/branches', form);
    } else {
      await client.put(`/branches/${editing}`, form);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this branch?')) return;
    await client.delete(`/branches/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Branches</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Add Branch</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'New Branch' : 'Edit Branch'}</h2>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Name</th><th className="p-3">Code</th><th className="p-3">Phone</th><th className="p-3">Active</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.code}</td>
                  <td className="p-3">{row.phone || '—'}</td>
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
