import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useSettings } from '../../context/SettingsContext';

export default function FeeInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appName: contextAppName, address: contextAddress, contactNo } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/fees/${id}/invoice`).then(({ data: d }) => setData(d)).catch(() => navigate('/admin/fee-management')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !data) return <p className="text-slate-500">Loading...</p>;

  const { feeCollection: fc, settings } = data;
  const appName = settings?.app_name || contextAppName;
  const address = settings?.address || contextAddress;
  const contact = settings?.contact_no || contactNo;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/admin/fee-management')} className="text-slate-600 hover:underline">← Back to Fee Management</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl mx-auto">
        <div className="text-center border-b border-slate-200 pb-4 mb-4">
          <h1 className="text-xl font-semibold text-slate-800">{appName}</h1>
          {(address || settings?.address) && <p className="text-sm text-slate-500">{address || settings?.address}</p>}
          {(contact || settings?.contact_no) && <p className="text-sm text-slate-500">{contact || settings?.contact_no}</p>}
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Fee Invoice #{fc.id}</h2>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <span className="text-slate-500">Student:</span><span className="font-medium">{fc.user_name}</span>
          <span className="text-slate-500">Email:</span><span>{fc.email}</span>
          <span className="text-slate-500">Phone:</span><span>{fc.phone || '—'}</span>
          <span className="text-slate-500">Course:</span><span>{fc.course_title}</span>
          <span className="text-slate-500">Batch:</span><span>{fc.batch_name}</span>
          <span className="text-slate-500">Branch:</span><span>{fc.branch_name}</span>
        </div>
        <div className="border-t border-slate-200 pt-4 mt-4">
          <p><span className="text-slate-500">Total Fee:</span> <strong>₹{fc.total_fee}</strong></p>
          <p><span className="text-slate-500">Paid:</span> <strong>₹{fc.paid_amount}</strong></p>
          <p><span className="text-slate-500">Remaining:</span> <strong>₹{fc.remaining_amount}</strong></p>
          <p><span className="text-slate-500">Status:</span> <span className="font-medium capitalize">{fc.status}</span></p>
        </div>
        {fc.payments && fc.payments.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-slate-800 mb-2">Payment History</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-1">Date</th><th className="text-left py-1">Amount</th><th className="text-left py-1">Method</th></tr></thead>
              <tbody>
                {fc.payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-1">{p.payment_date}</td>
                    <td className="py-1">₹{p.amount}</td>
                    <td className="py-1">{p.payment_method || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
