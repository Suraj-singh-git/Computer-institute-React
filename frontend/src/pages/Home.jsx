import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import PublicLayout from '../layouts/PublicLayout';
import client from '../api/client';

const SITE_NAME = 'UMA Technical & Electrical Institute';

const carouselSlides = [
  { title: 'Welcome To UMA Technical & Electrical Institute', subtitle: 'Quality technical education at nominal fee since 2013.' },
  { title: 'Best Computer Training Institute', subtitle: 'DCA, CCA, DRA, Tally & more courses. Industry-ready skills.' },
  { title: 'Online Exam & Certificate', subtitle: 'Take exams online and verify your marksheet anytime.' },
];

export default function Home() {
  const { appName, contactNo, address } = useSettings();
  const [slide, setSlide] = useState(0);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    document.title = appName || SITE_NAME;
  }, [appName]);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % carouselSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    client.get('/public/courses').then((r) => setCourses(r.data.slice(0, 6))).catch(() => setCourses([]));
    client.get('/public/branches').then((r) => setBranches(r.data.slice(0, 6))).catch(() => setBranches([]));
    client.get('/public/students').then((r) => setStudents(r.data.slice(0, 12))).catch(() => setStudents([]));
  }, []);

  return (
    <PublicLayout>
      {/* Carousel */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-amber-900 text-white min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            {carouselSlides[slide].title}
          </h1>
          <p className="text-slate-200 text-lg">{carouselSlides[slide].subtitle}</p>
          <div className="flex justify-center gap-2 mt-6">
            {carouselSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full transition ${i === slide ? 'bg-amber-500 scale-125' : 'bg-slate-500'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">UMA TECHNICAL & ELECTRICAL INSTITUTE</h2>
          <p className="text-slate-600 leading-relaxed">
            The Institute Of Industrial Training & Education (UMA TECHNICAL & ELECTRICAL INSTITUTE) has been run to provide high technical computer education at nominal fee since 2013. UTEI is registered under Ministry of Corporate Affairs Govt. of India, Ministry of Small and Medium Enterprises, Labour Department Govt. of Uttar Pradesh. UTEI is an ISO Certified Institution and authorised Training Center of All India Computer Saksharta Mission (AICSM).
          </p>
          <Link to="/courses" className="inline-block mt-6 px-6 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Read More</Link>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Popular Courses</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">We provide all types of computer courses – Basic computer training, Networking, Tally, DCA, CCA, DRA and more.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.length === 0 ? (
              <p className="col-span-full text-center text-slate-500">No courses yet. Check back soon.</p>
            ) : (
              courses.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-slate-800 mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{c.description || '—'}</p>
                  <p className="text-sm text-amber-600 mt-2">₹{c.fee} · {c.duration} months</p>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/courses" className="text-amber-600 font-medium hover:underline">Browse All Courses →</Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                Image {i}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/gallery" className="text-amber-600 font-medium hover:underline">View Gallery →</Link>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section id="branches" className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Our Branches</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.length === 0 ? (
              <p className="col-span-full text-center text-slate-500">No branches yet.</p>
            ) : (
              branches.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h3 className="font-semibold text-slate-800">{b.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{b.address || '—'}</p>
                  {b.phone && <p className="text-sm text-amber-600 mt-1">📞 {b.phone}</p>}
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/branches" className="text-amber-600 font-medium hover:underline">All Branches →</Link>
          </div>
        </div>
      </section>

      {/* Recently Joined Students */}
      <section id="students" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Recently Joined Students</h2>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {students.length === 0 ? (
              <p className="col-span-full text-center text-slate-500">No students yet.</p>
            ) : (
              students.map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                  <p className="font-medium text-slate-800">{s.name}</p>
                  <p className="text-sm text-slate-500">{s.branch_name || '—'}</p>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/students" className="text-amber-600 font-medium hover:underline">View All →</Link>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section id="news-events" className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">News & Events</h2>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-slate-600 leading-relaxed mb-4">
              UMA TECHNICAL believes in the foundation of technology. Computer science has brought new opportunities and changed the foundational concepts in education.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Special Offer:</strong> Students who get 80% in their 10 or 12 board exams get 20% off on any course and free admission. (For limited period)
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Objective:</strong> To provide such a technical system in which students get the real benefits of the time and fees paid by them, making them capable of self-employment.
            </p>
          </div>
          <div className="text-center mt-6">
            <Link to="/news-events" className="text-amber-600 font-medium hover:underline">More News & Events →</Link>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Contact Us</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-center">
            {contactNo && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-500 text-sm">Phone</p>
                <a href={`tel:${contactNo}`} className="text-amber-600 font-semibold text-lg">{contactNo}</a>
              </div>
            )}
            {address && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-500 text-sm">Address</p>
                <p className="text-slate-800 font-medium">{address}</p>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/contact" className="inline-block px-6 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Contact Us</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
