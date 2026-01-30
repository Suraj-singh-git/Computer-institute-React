import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useSettings } from '../../context/SettingsContext';

export default function QuestionPaper() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { appName } = useSettings();
  const [data, setData] = useState(null);
  const [answerKey, setAnswerKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/exams/${examId}/question-paper`, { params: { answer_key: answerKey } })
      .then(({ data: d }) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [examId, answerKey]);

  if (loading || !data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;

  const { exam, questions, answerKey: withKey, settings } = data;
  const showKey = withKey ?? answerKey;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <button onClick={() => navigate('/admin/exams')} className="text-slate-600 hover:underline">← Back to Exams</button>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={answerKey} onChange={(e) => setAnswerKey(e.target.checked)} />
            <span className="text-sm">Show answer key</span>
          </label>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm print:shadow-none">
          <div className="text-center border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-xl font-bold text-slate-800">{settings?.app_name || appName}</h1>
            <h2 className="text-lg font-semibold text-slate-700 mt-2">{exam?.title}</h2>
            <p className="text-sm text-slate-500">{exam?.course_title} · {exam?.branch_name} · Total: {exam?.total_marks} marks · Duration: {exam?.duration} min</p>
          </div>
          <ol className="list-decimal list-inside space-y-6">
            {questions?.map((q, i) => (
              <li key={q.id} className="text-slate-800">
                <p className="font-medium mb-2">{q.question}</p>
                <p className="text-sm text-slate-500 mb-2">({q.marks} mark{q.marks !== 1 ? 's' : ''})</p>
                {q.type === 'mcq' && (
                  <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                    {q.answers?.map((a) => (
                      <li key={a.id} className={showKey && a.is_correct ? 'text-green-700 font-medium' : ''}>
                        {a.answer_text}
                        {showKey && a.is_correct && ' ✓'}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Print Question Paper</button>
        </div>
      </div>
    </div>
  );
}
