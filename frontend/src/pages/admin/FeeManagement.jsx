import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function FeeManagement() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ user_id: '', assign_course_id: '', total_fee: '', payment_mode: 'one_time' });
  const [showPayment, setShowPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', payment_date: new Date().toISOString().slice(0, 10), payment_method: 'cash' });
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => client.get('/fees').then(({ data }) => setList(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);
  useEffect(() => {
    client.get('/users', { params: { role: 'student' } }).then(({ data }) => setStudents(data));
  }, []);

  useEffect(() => {
    if (createForm.user_id) {
      client.get('/assign-courses', { params: { user_id: createForm.user_id } }).then(({ data }) => setAssignments(data.filter((a) => a.is_active)));
    } else setAssignments([]);
  }, [createForm.user_id]);

  const createFee = async (e) => {
    e.preventDefault();
    try {
      await client.post('/fees', {
        user_id: Number(createForm.user_id),
        assign_course_id: Number(createForm.assign_course_id),
        total_fee: Number(createForm.total_fee),
        payment_mode: createForm.payment_mode,
      });
      setShowCreate(false);
      setCreateForm({ user_id: '', assign_course_id: '', total_fee: '', payment_mode: 'one_time' });
      load();
      toast.success('Fee record created.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create fee record');
    }
  };

  const addPayment = async (e) => {
    e.preventDefault();
    try {
      await client.post(`/fees/${showPayment}/payments`, {
        amount: Number(paymentForm.amount),
        payment_date: paymentForm.payment_date,
        payment_method: paymentForm.payment_method,
      });
      setShowPayment(null);
      setPaymentForm({ amount: '', payment_date: new Date().toISOString().slice(0, 10), payment_method: 'cash' });
      load();
      toast.success('Payment recorded.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to record payment');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Fee Management</h1>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search by student name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-300 w-64 text-sm" />
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Create Fee Record</button>
        </div>
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">Create Fee Record</h2>
            <select value={createForm.user_id} onChange={(e) => setCreateForm({ ...createForm, user_id: e.target.value, assign_course_id: '' })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
              <option value="">Select student</option>
              {students.filter((s) => (s.status || 'Active') === 'Active').map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
            <select value={createForm.assign_course_id} onChange={(e) => setCreateForm({ ...createForm, assign_course_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required>
              <option value="">Select assignment</option>
              {assignments.map((a) => <option key={a.id} value={a.id}>{a.course_title} - {a.batch_name}</option>)}
            </select>
            <input type="number" placeholder="Total fee" value={createForm.total_fee} onChange={(e) => setCreateForm({ ...createForm, total_fee: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <select value={createForm.payment_mode} onChange={(e) => setCreateForm({ ...createForm, payment_mode: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
              <option value="one_time">One Time</option>
              <option value="quarterly">Quarterly</option>
              <option value="half_yearly">Half Yearly</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={createFee} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Create</button>
            </div>
          </div>
        </div>
      )}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-semibold text-slate-800">Collect Payment</h2>
            <input type="number" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
            <input type="date" value={paymentForm.payment_date} onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            <select value={paymentForm.payment_method} onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowPayment(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={addPayment} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Record</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr><th className="p-3">Student</th><th className="p-3">Course</th><th className="p-3">Total</th><th className="p-3">Paid</th><th className="p-3">Status</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {list.filter((row) => !search.trim() || (row.user_name && row.user_name.toLowerCase().includes(search.toLowerCase())) || (row.email && row.email.toLowerCase().includes(search.toLowerCase()))).map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.user_name}</td>
                  <td className="p-3">{row.course_title}</td>
                  <td className="p-3">{row.total_fee}</td>
                  <td className="p-3">{row.paid_amount}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${row.status === 'completed' ? 'bg-green-100 text-green-800' : row.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{row.status}</span></td>
                  <td className="p-3">
                    <Link to={`/admin/fee-management/${row.id}/invoice`} className="text-amber-600 hover:underline mr-2">Invoice</Link>
                    {row.status !== 'completed' && (
                      <button onClick={() => setShowPayment(row.id)} className="text-amber-600 hover:underline">Collect</button>
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
