import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';

export default function Questions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: 'mcq', question: '', marks: 1, order: 0, is_active: true, answers: [{ answer_text: '', is_correct: false, order: 0 }] });

  const load = () => {
    client.get(`/exams/${examId}`).then(({ data }) => setExam(data)).catch(() => navigate('/exams'));
    client.get('/questions', { params: { exam_id: examId } }).then(({ data }) => setList(data)).catch(() => setList([]));
  };

  useEffect(() => {
    load();
  }, [examId]);

  useEffect(() => { setLoading(false); }, [list, exam]);

  const openCreate = () => {
    setEditing('new');
    setForm({ type: 'mcq', question: '', marks: 1, order: 0, is_active: true, answers: [{ answer_text: '', is_correct: false, order: 0 }] });
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      type: row.type || 'mcq',
      question: row.question,
      marks: row.marks || 1,
      order: row.order || 0,
      is_active: !!row.is_active,
      answers: (row.answers && row.answers.length) ? row.answers.map((a) => ({ answer_text: a.answer_text, is_correct: !!a.is_correct, order: a.order || 0 })) : [{ answer_text: '', is_correct: false, order: 0 }],
    });
  };

  const addAnswer = () => setForm((f) => ({ ...f, answers: [...f.answers, { answer_text: '', is_correct: false, order: f.answers.length }] }));
  const updateAnswer = (i, field, value) => setForm((f) => ({
    ...f,
    answers: f.answers.map((a, j) => (j === i ? { ...a, [field]: value } : a)),
  }));
  const removeAnswer = (i) => setForm((f) => ({ ...f, answers: f.answers.filter((_, j) => j !== i) }));

  const save = async () => {
    const payload = { exam_id: examId, type: form.type, question: form.question, marks: Number(form.marks), order: Number(form.order), is_active: form.is_active };
    if (form.type === 'mcq' && form.answers.length) payload.answers = form.answers;
    if (editing === 'new') await client.post('/questions', payload);
    else await client.put(`/questions/${editing}`, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this question?')) return;
    await client.delete(`/questions/${id}`);
    load();
  };

  if (!exam) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/exams')} className="text-slate-600 hover:underline mb-2 block">← Back to Exams</button>
        <h1 className="text-2xl font-semibold text-slate-800">Questions: {exam.title}</h1>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4 overflow-auto">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4">
            <h2 className="font-semibold text-slate-800">{editing === 'new' ? 'New Question' : 'Edit Question'}</h2>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300">
              <option value="mcq">MCQ</option>
              <option value="short_answer">Short Answer</option>
            </select>
            <textarea placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={3} required />
            <input type="number" placeholder="Marks" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
            {form.type === 'mcq' && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Options</p>
                {form.answers.map((a, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <input value={a.answer_text} onChange={(e) => updateAnswer(i, 'answer_text', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-slate-300" placeholder="Option text" />
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" checked={a.is_correct} onChange={(e) => updateAnswer(i, 'is_correct', e.target.checked)} /> Correct</label>
                    <button type="button" onClick={() => removeAnswer(i)} className="text-red-600 text-sm">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addAnswer} className="text-sm text-amber-600 hover:underline">+ Add option</button>
              </div>
            )}
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mb-4">
        <span className="text-slate-600">{list.length} question(s)</span>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Add Question</button>
      </div>
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <ul className="space-y-4">
          {list.map((q) => (
            <li key={q.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-800">{q.question}</p>
                  <p className="text-sm text-slate-500 mt-1">Type: {q.type} · Marks: {q.marks}</p>
                  {q.answers && q.answers.length > 0 && (
                    <ul className="mt-2 text-sm text-slate-600 list-disc list-inside">
                      {q.answers.map((a) => <li key={a.id}>{a.answer_text} {a.is_correct ? '(correct)' : ''}</li>)}
                    </ul>
                  )}
                </div>
                <div>
                  <button onClick={() => openEdit(q)} className="text-amber-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => remove(q.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
