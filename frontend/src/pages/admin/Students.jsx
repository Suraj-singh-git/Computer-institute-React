import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function Students() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', branch_id: '', status: 'Active' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => client.get('/users', { params: { role: 'student' } }).then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    client.get('/branches').then(({ data }) => setBranches(data));
    client.get('/roles').then(({ data }) => setRoles(data));
  }, []);

  const studentRoleId = roles.find((r) => r.slug === 'student')?.id;

  const openCreate = () => {
    setEditing('new');
    setError('');
    setForm({ name: '', email: '', password: '', phone: '', address: '', branch_id: '', status: 'Active' });
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setError('');
    setForm({ name: row.name, email: row.email, password: '', phone: row.phone || '', address: row.address || '', branch_id: row.branch_id || '', status: row.status || 'Active' });
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing === 'new') {
        if (!form.password) { setError('Password required'); return; }
        await client.post('/users', { ...form, role_id: studentRoleId, branch_id: form.branch_id || null });
      } else {
        const payload = { ...form, branch_id: form.branch_id || null };
        if (!payload.password) delete payload.password;
        await client.put(`/users/${editing}`, payload);
      }
      setEditing(null);
      load();
      toast.success(editing === 'new' ? 'Student added.' : 'Student updated.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Students</h1>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-300 w-64 text-sm" />
          <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Add Student</button>
        </div>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4 overflow-auto">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'Add Student' : 'Edit Student'}</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={save} className="space-y-4">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
              <input type="password" placeholder={editing === 'new' ? 'Password' : 'Password (leave blank to keep)'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required={editing === 'new'} />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
              <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
              <select value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
                <option value="">No branch</option>
                {branches.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Branch</th><th className="p-3">Status</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.filter((row) => !search.trim() || row.name?.toLowerCase().includes(search.toLowerCase()) || row.email?.toLowerCase().includes(search.toLowerCase())).map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.email}</td>
                  <td className="p-3">{row.phone || '—'}</td>
                  <td className="p-3">{row.branch_name || '—'}</td>
                  <td className="p-3">{row.status || 'Active'}</td>
                  <td className="p-3">
                    <button onClick={() => openEdit(row)} className="text-amber-600 hover:underline mr-2">Edit</button>
                    <Link to={`/admin/students/${row.id}/assign-course`} className="text-amber-600 hover:underline">Assign Course</Link>
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
