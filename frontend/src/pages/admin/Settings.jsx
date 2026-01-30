import { useState, useEffect } from 'react';
import client from '../../api/client';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
  const { refresh } = useSettings();
  const [form, setForm] = useState({ app_name: '', app_icon: '', contact_no: '', email: '', address: '', mail_host: '', mail_port: '', mail_username: '', mail_from_address: '', mail_from_name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    client.get('/settings').then(({ data }) => setForm((f) => ({ ...f, ...data }))).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await client.put('/settings', form);
      setMessage('Settings saved. App name and contact will update across the app.');
      refresh();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl space-y-4">
        {message && <p className="text-sm text-green-600">{message}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">App Name</label>
          <input value={form.app_name} onChange={(e) => setForm({ ...form, app_name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact No</label>
          <input value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={2} />
        </div>
        <hr className="border-slate-200" />
        <p className="text-sm font-medium text-slate-600">Mail (optional)</p>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Mail Host</label>
          <input value={form.mail_host} onChange={(e) => setForm({ ...form, mail_host: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Mail Port</label>
          <input value={form.mail_port} onChange={(e) => setForm({ ...form, mail_port: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Mail Username</label>
          <input value={form.mail_username} onChange={(e) => setForm({ ...form, mail_username: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Mail From Address</label>
          <input value={form.mail_from_address} onChange={(e) => setForm({ ...form, mail_from_address: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Mail From Name</label>
          <input value={form.mail_from_name} onChange={(e) => setForm({ ...form, mail_from_name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">Save Settings</button>
      </form>
    </div>
  );
}
