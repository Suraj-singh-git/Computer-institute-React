import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';

const placeholderCount = 12;

export default function Gallery() {
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Gallery</h1>
        <p className="text-slate-600 mb-8">Photos and events from UMA Technical & Electrical Institute.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: placeholderCount }, (_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
              Image {i + 1}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/" className="text-amber-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
