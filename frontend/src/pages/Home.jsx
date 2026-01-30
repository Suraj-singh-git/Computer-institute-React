import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-semibold text-amber-400">Computer Institute</span>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 transition">Register</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn. Grow. Succeed.</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
          Join our computer institute to master programming, web development, and IT skills with expert instructors and hands-on projects.
        </p>
        <Link to="/register" className="inline-block px-8 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition">
          Get Started
        </Link>
      </div>
    </div>
  );
}
