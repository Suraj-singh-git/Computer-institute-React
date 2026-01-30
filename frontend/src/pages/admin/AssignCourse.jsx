import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';

export default function AssignCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ branch_id: '', course_id: '', batch_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get(`/users/${id}`).then(({ data }) => setStudent(data)).catch(() => navigate('/students'));
    client.get('/branches').then(({ data }) => setBranches(data));
    client.get('/courses').then(({ data }) => setCourses(data));
    client.get('/batches').then(({ data }) => setBatches(data));
  }, [id, navigate]);

  useEffect(() => { setLoading(false); }, [student]);

  const branchCourses = courses.filter((c) => c.branch_id == form.branch_id);
  const branchBatches = batches.filter((b) => b.branch_id == form.branch_id && b.course_id == form.course_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/assign-courses', { user_id: Number(id), branch_id: Number(form.branch_id), course_id: Number(form.course_id), batch_id: Number(form.batch_id) });
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign');
    }
  };

  if (!student) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/students')} className="text-slate-600 hover:underline mb-2 block">← Back to Students</button>
        <h1 className="text-2xl font-semibold text-slate-800">Assign Course to {student.name}</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-md space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
          <select value={form.branch_id} onChange={(e) => setForm({ branch_id: e.target.value, course_id: '', batch_id: '' })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
            <option value="">Select branch</option>
            {branches.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
          <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value, batch_id: '' })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
            <option value="">Select course</option>
            {branchCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Batch</label>
          <select value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
            <option value="">Select batch</option>
            {branchBatches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Assign</button>
      </form>
    </div>
  );
}
