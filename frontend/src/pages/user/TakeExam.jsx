import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import client from '../../api/client';

export default function TakeExam() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { appName } = useSettings();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const answersRef = useRef(answers);
  const dataRef = useRef(data);
  answersRef.current = answers;
  dataRef.current = data;

  useEffect(() => {
    client.get(`/exam-attempts/${attemptId}`).then(({ data: d }) => {
      setData(d);
      dataRef.current = d;
      const initial = {};
      d.questions?.forEach((q) => {
        if (q.saved) {
          if (q.type === 'mcq') initial[q.id] = { selected_answer_id: q.saved.selected_answer_id };
          else initial[q.id] = { answer_text: q.saved.answer_text };
        }
      });
      setAnswers(initial);
      answersRef.current = initial;
      if (d.exam?.duration) setTimeLeft(d.exam.duration * 60);
    }).catch(() => navigate('/user/my-exams'));
  }, [attemptId, navigate]);

  const doSubmit = async () => {
    const d = dataRef.current;
    const ans = answersRef.current;
    if (!d?.questions) return;
    const answersArray = d.questions.map((q) => ({
      question_id: q.id,
      selected_answer_id: ans[q.id]?.selected_answer_id || null,
      answer_text: ans[q.id]?.answer_text || null,
    }));
    await client.post(`/exam-attempts/${attemptId}/submit`, { answers: answersArray });
    navigate(`/user/exam-result/${attemptId}`);
  };

  useEffect(() => {
    if (timeLeft == null || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timeLeft, attemptId, navigate]);

  const handleSubmit = async () => {
    if (submitting || !data) return;
    setSubmitting(true);
    try {
      await doSubmit();
    } catch (_) {
      setSubmitting(false);
    }
  };

  if (!data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;

  const { attempt, exam, questions } = data;
  const mins = timeLeft != null ? Math.floor(timeLeft / 60) : 0;
  const secs = timeLeft != null ? timeLeft % 60 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">{exam?.title}</span>
        {timeLeft != null && <span className="font-mono">Time: {mins}:{secs < 10 ? '0' : ''}{secs}</span>}
      </header>
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-slate-600">Duration: {exam?.duration} min · Total: {exam?.total_marks} marks</p>
          <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
        <ol className="space-y-6 list-decimal list-inside">
          {questions?.map((q) => (
            <li key={q.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-800 mb-2">{q.question}</p>
              <p className="text-sm text-slate-500 mb-3">({q.marks} mark{q.marks !== 1 ? 's' : ''})</p>
              {q.type === 'mcq' ? (
                <ul className="space-y-2">
                  {q.answers?.map((a) => (
                    <li key={a.id}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q-${q.id}`} checked={answers[q.id]?.selected_answer_id === a.id} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: { selected_answer_id: a.id } }))} />
                        <span>{a.answer_text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <textarea value={answers[q.id]?.answer_text || ''} onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: { answer_text: e.target.value } }))} className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={3} placeholder="Your answer" />
              )}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-end">
          <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </main>
    </div>
  );
}
