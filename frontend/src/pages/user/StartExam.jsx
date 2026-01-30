import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../../api/client';

export default function StartExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.post('/exam-attempts', { exam_id: examId })
      .then(({ data }) => navigate(`/user/take-exam/${data.id}`))
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to start exam');
        setLoading(false);
      });
  }, [examId, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Link to="/user/my-exams" className="text-amber-600 hover:underline mb-4 inline-block">← Back to My Exams</Link>
        {loading && <p className="text-slate-600">Starting exam...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
  );
}
