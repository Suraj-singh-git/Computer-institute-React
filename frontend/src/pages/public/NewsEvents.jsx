import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';

export default function NewsEvents() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">News & Events</h1>
        <p className="text-slate-600 mb-8">Latest updates from UMA Technical & Electrical Institute.</p>
        <div className="space-y-6">
          <article className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Special Offer for Board Toppers</h2>
            <p className="text-slate-600 text-sm text-slate-500 mb-2">Ongoing</p>
            <p className="text-slate-600">Students who get 80% or above in their 10th or 12th board exams get 20% off on any course and free admission. Limited period offer.</p>
          </article>
          <article className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Our Objective</h2>
            <p className="text-slate-600">To provide such a technical system in which students get the real benefits of the time and fees paid by them, making them capable of self-employment. UMA TECHNICAL & ELECTRICAL INSTITUTE.</p>
          </article>
          <article className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Foundation of Technology</h2>
            <p className="text-slate-600">UMA TECHNICAL believes in the foundation of technology. Computer science has brought new opportunities and challenges to traditional study style and has changed the foundational concepts in education.</p>
          </article>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-amber-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
