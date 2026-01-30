import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import client from '../../api/client';

export default function MyExams() {
  const { appName } = useSettings();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/exam-attempts/available').then(({ data }) => setList(data)).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/user/dashboard" className="text-xl font-semibold text-amber-400">{appName}</Link>
        <Link to="/user/dashboard" className="text-slate-300 hover:text-white text-sm">← Dashboard</Link>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">My Exams</h1>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500">No exams available. You need to be enrolled in a course/batch.</p>
        ) : (
          <ul className="space-y-4">
            {list.map((exam) => (
              <li key={exam.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-800">{exam.title}</h2>
                  <p className="text-sm text-slate-500">{exam.course_title} · {exam.batch_name || '—'} · {exam.branch_name}</p>
                  <p className="text-sm text-slate-500 mt-1">Total: {exam.total_marks} marks · Pass: {exam.passing_marks} · Duration: {exam.duration} min</p>
                  {exam.exam_date && <p className="text-sm text-slate-500">Date: {new Date(exam.exam_date).toLocaleString()}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  {exam.attempt?.status === 'submitted' ? (
                    <>
                      <span className="text-sm font-medium">Score: {exam.attempt.score}/{exam.attempt.total_marks}</span>
                      <Link to={`/user/exam-result/${exam.attempt.id}`} className="px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-500">View Marksheet</Link>
                    </>
                  ) : exam.attempt?.status === 'in_progress' ? (
                    <Link to={`/user/take-exam/${exam.attempt.id}`} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium text-sm hover:bg-amber-400">Continue Exam</Link>
                  ) : (
                    <>
                      <Link to={`/user/admit-card/${exam.id}`} className="px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50">Admit Card</Link>
                      <Link to={`/user/start-exam/${exam.id}`} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium text-sm hover:bg-amber-400">Start Exam</Link>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
