import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { useSettings } from '../../context/SettingsContext';

export default function ContactUs() {
  const { appName, contactNo, email, address } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Contact Us</h1>
        <p className="text-slate-600 mb-8">Get in touch with UMA Technical & Electrical Institute.</p>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h2>
            <p className="text-slate-700 font-medium">{appName}</p>
            {address && <p className="text-slate-600 mt-2">📍 {address}</p>}
            {contactNo && <p className="text-slate-600 mt-2">📞 <a href={`tel:${contactNo}`} className="text-amber-600 hover:underline">{contactNo}</a></p>}
            {email && <p className="text-slate-600 mt-2">✉ <a href={`mailto:${email}`} className="text-amber-600 hover:underline">{email}</a></p>}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Send a Message</h2>
            {sent ? (
              <p className="text-green-600 font-medium">Thank you! We will get back to you soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
                <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300" required />
                <button type="submit" className="w-full px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Send</button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-amber-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
