import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ branches: 0, courses: 0, students: 0, pendingAdmissions: 0 });

  useEffect(() => {
    Promise.all([
      client.get('/branches').then((r) => r.data.length),
      client.get('/courses').then((r) => r.data.length),
      client.get('/users', { params: { role: 'student' } }).then((r) => r.data.length),
      client.get('/admission-requests', { params: { status: 'pending' } }).then((r) => r.data.length),
    ]).then(([branches, courses, students, pendingAdmissions]) => {
      setStats({ branches, courses, students, pendingAdmissions });
    });
  }, []);

  const cards = [
    { label: 'Branches', value: stats.branches, to: '/branches', color: 'bg-amber-500' },
    { label: 'Courses', value: stats.courses, to: '/courses', color: 'bg-emerald-500' },
    { label: 'Students', value: stats.students, to: '/students', color: 'bg-blue-500' },
    { label: 'Pending Admissions', value: stats.pendingAdmissions, to: '/admission-requests', color: 'bg-violet-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, to, color }) => (
          <Link key={to} to={to} className={`${color} text-white rounded-xl p-6 hover:opacity-90 transition`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-white/90 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
