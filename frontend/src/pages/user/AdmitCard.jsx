import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import client from '../../api/client';

export default function AdmitCard() {
  const { examId } = useParams();
  const { appName } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/exams/${examId}/admit-card`).then(({ data: d }) => setData(d)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;
  if (!data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-red-500">Admit card not found.</p><Link to="/user/my-exams" className="text-amber-600 ml-2">My Exams</Link></div>;

  const { exam, user, settings } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/user/my-exams" className="text-xl font-semibold text-amber-400">{appName}</Link>
        <Link to="/user/my-exams" className="text-slate-300 hover:text-white text-sm">← My Exams</Link>
      </header>
      <main className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-xl border-2 border-slate-300 p-8 shadow-lg">
          <div className="text-center border-b-2 border-slate-200 pb-4 mb-4">
            <h1 className="text-xl font-bold text-slate-800">{settings?.app_name || appName}</h1>
            {settings?.address && <p className="text-sm text-slate-500">{settings.address}</p>}
            {settings?.contact_no && <p className="text-sm text-slate-500">{settings.contact_no}</p>}
          </div>
          <h2 className="text-center text-lg font-semibold text-slate-800 mb-6">ADMIT CARD</h2>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span className="text-slate-500">Exam:</span><span className="font-medium">{exam?.title}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Course:</span><span>{exam?.course_title}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Branch:</span><span>{exam?.branch_name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Candidate Name:</span><span className="font-medium">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Email:</span><span>{user?.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span>{user?.phone || '—'}</span></div>
            {exam?.exam_date && <div className="flex justify-between"><span className="text-slate-500">Date & Time:</span><span>{new Date(exam.exam_date).toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Duration:</span><span>{exam?.duration} minutes</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Venue:</span><span>{exam?.branch_address || exam?.branch_name}</span></div>
          </div>
          <p className="text-xs text-slate-500 text-center">Bring this admit card and a valid ID to the exam center.</p>
        </div>
      </main>
    </div>
  );
}
