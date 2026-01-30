import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import MyCourses from './pages/user/MyCourses';
import AdmissionRequest from './pages/user/AdmissionRequest';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Branches from './pages/admin/Branches';
import Courses from './pages/admin/Courses';
import Batches from './pages/admin/Batches';
import Students from './pages/admin/Students';
import AssignCourse from './pages/admin/AssignCourse';
import FeeManagement from './pages/admin/FeeManagement';
import AdmissionRequests from './pages/admin/AdmissionRequests';
import Users from './pages/admin/Users';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/user/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (user) return <Navigate to={user.is_admin ? '/dashboard' : '/user/dashboard'} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/user/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
      <Route path="/user/admission-request" element={<ProtectedRoute><AdmissionRequest /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/branches" element={<ProtectedRoute adminOnly><AdminLayout><Branches /></AdminLayout></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute adminOnly><AdminLayout><Courses /></AdminLayout></ProtectedRoute>} />
      <Route path="/batches" element={<ProtectedRoute adminOnly><AdminLayout><Batches /></AdminLayout></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute adminOnly><AdminLayout><Students /></AdminLayout></ProtectedRoute>} />
      <Route path="/students/:id/assign-course" element={<ProtectedRoute adminOnly><AdminLayout><AssignCourse /></AdminLayout></ProtectedRoute>} />
      <Route path="/fee-management" element={<ProtectedRoute adminOnly><AdminLayout><FeeManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admission-requests" element={<ProtectedRoute adminOnly><AdminLayout><AdmissionRequests /></AdminLayout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute adminOnly><AdminLayout><Users /></AdminLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
