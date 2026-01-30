import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import client from '../../api/client';

export default function ExamResult() {
  const { attemptId } = useParams();
  const { appName } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/exam-attempts/${attemptId}/result`).then(({ data: d }) => setData(d)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;
  if (!data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-red-500">Result not found.</p><Link to="/user/my-exams" className="text-amber-600 ml-2">My Exams</Link></div>;

  const { attempt, exam, user, answers, passed } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:bg-white print:text-slate-800">
        <Link to="/user/my-exams" className="text-xl font-semibold text-amber-400 print:text-slate-800 print:no-underline">{appName}</Link>
        <Link to="/user/my-exams" className="text-slate-300 hover:text-white text-sm print:hidden">← My Exams</Link>
      </header>
      <main className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 no-print">
          <h1 className="text-2xl font-semibold text-slate-800">Marksheet</h1>
          <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Print Marksheet</button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 print:shadow-none">
          <div className="text-center border-b border-slate-200 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">{exam?.title}</h2>
            <p className="text-slate-500">{exam?.course_title} · {exam?.branch_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <span className="text-slate-500">Candidate:</span><span className="font-medium">{user?.name}</span>
            <span className="text-slate-500">Email:</span><span>{user?.email}</span>
            <span className="text-slate-500">Score:</span><span className="font-bold">{attempt?.score} / {attempt?.total_marks}</span>
            <span className="text-slate-500">Passing:</span><span>{attempt?.passing_marks}</span>
            <span className="text-slate-500">Status:</span><span className={passed ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{passed ? 'PASSED' : 'FAILED'}</span>
          </div>
          {attempt?.verification_code && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm no-print">
              <p className="font-medium text-slate-700">Verify result without login</p>
              <p className="text-slate-600 mt-1">Attempt ID: <strong>{attemptId}</strong> · Code: <strong>{attempt.verification_code}</strong></p>
              <Link to="/verify-result" className="text-amber-600 hover:underline mt-1 inline-block">Open Verify Result page →</Link>
            </div>
          )}
        </div>
        <h3 className="font-medium text-slate-800 mb-3">Question-wise</h3>
        <ul className="space-y-3">
          {answers?.map((a, i) => (
            <li key={a.id} className="bg-white rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-medium text-slate-700">Q{i + 1}: {a.question}</p>
              <p className="text-slate-500 mt-1">Marks: {a.marks_awarded} / {a.marks}</p>
              {a.correct_answer && <p className="text-slate-600 mt-1">Correct: {a.correct_answer.answer_text}</p>}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
