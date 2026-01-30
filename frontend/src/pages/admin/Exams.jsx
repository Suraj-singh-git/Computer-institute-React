import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function Exams() {
  const [list, setList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ branch_id: '', course_id: '', batch_id: '', title: '', description: '', duration: 60, total_marks: 100, passing_marks: 40, is_active: true, exam_date: '' });

  const load = () => client.get('/exams').then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    client.get('/branches').then(({ data }) => setBranches(data));
    client.get('/courses').then(({ data }) => setCourses(data));
    client.get('/batches').then(({ data }) => setBatches(data));
  }, []);

  const branchCourses = courses.filter((c) => c.branch_id == form.branch_id && c.status);
  const branchBatches = batches.filter((b) => b.branch_id == form.branch_id && b.course_id == form.course_id && b.is_active);

  const openCreate = () => {
    setEditing('new');
    setForm({ branch_id: '', course_id: '', batch_id: '', title: '', description: '', duration: 60, total_marks: 100, passing_marks: 40, is_active: true, exam_date: '' });
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ branch_id: row.branch_id, course_id: row.course_id, batch_id: row.batch_id || '', title: row.title, description: row.description || '', duration: row.duration || 60, total_marks: row.total_marks || 100, passing_marks: row.passing_marks || 40, is_active: !!row.is_active, exam_date: row.exam_date ? row.exam_date.slice(0, 16) : '' });
  };

  const save = async () => {
    const payload = { ...form, branch_id: Number(form.branch_id), course_id: Number(form.course_id), batch_id: form.batch_id ? Number(form.batch_id) : null, exam_date: form.exam_date || null };
    if (editing === 'new') await client.post('/exams', payload);
    else await client.put(`/exams/${editing}`, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this exam?')) return;
    await client.delete(`/exams/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Exams</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Add Exam</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4 overflow-auto">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'New Exam' : 'Edit Exam'}</h2>
            <select value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value, course_id: '', batch_id: '' })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
              <option value="">Select branch</option>
              {branches.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value, batch_id: '' })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
              <option value="">Select course</option>
              {branchCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <select value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
              <option value="">No batch</option>
              {branchBatches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={2} />
            <input type="number" placeholder="Duration (min)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input type="number" placeholder="Total marks" value={form.total_marks} onChange={(e) => setForm({ ...form, total_marks: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input type="number" placeholder="Passing marks" value={form.passing_marks} onChange={(e) => setForm({ ...form, passing_marks: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <input type="datetime-local" value={form.exam_date} onChange={(e) => setForm({ ...form, exam_date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Title</th><th className="p-3">Course</th><th className="p-3">Branch</th><th className="p-3">Marks</th><th className="p-3">Date</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.title}</td>
                  <td className="p-3">{row.course_title}</td>
                  <td className="p-3">{row.branch_name}</td>
                  <td className="p-3">{row.total_marks} / {row.passing_marks}</td>
                  <td className="p-3">{row.exam_date ? new Date(row.exam_date).toLocaleString() : '—'}</td>
                  <td className="p-3">
                    <Link to={`/admin/exams/${row.id}/questions`} className="text-amber-600 hover:underline mr-2">Questions</Link>
                    <Link to={`/admin/exams/${row.id}/question-paper`} className="text-amber-600 hover:underline mr-2">Question Paper</Link>
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
