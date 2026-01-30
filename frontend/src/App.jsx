import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import PublicCourses from './pages/public/Courses';
import Gallery from './pages/public/Gallery';
import PublicBranches from './pages/public/Branches';
import PublicStudents from './pages/public/Students';
import NewsEvents from './pages/public/NewsEvents';
import ContactUs from './pages/public/ContactUs';
import VerifyResult from './pages/public/VerifyResult';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import MyCourses from './pages/user/MyCourses';
import MyExams from './pages/user/MyExams';
import StartExam from './pages/user/StartExam';
import TakeExam from './pages/user/TakeExam';
import ExamResult from './pages/user/ExamResult';
import AdmitCard from './pages/user/AdmitCard';
import AdmissionRequest from './pages/user/AdmissionRequest';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBranches from './pages/admin/Branches';
import AdminCourses from './pages/admin/Courses';
import Batches from './pages/admin/Batches';
import AdminStudents from './pages/admin/Students';
import AssignCourse from './pages/admin/AssignCourse';
import FeeManagement from './pages/admin/FeeManagement';
import FeeInvoice from './pages/admin/FeeInvoice';
import AdmissionRequests from './pages/admin/AdmissionRequests';
import Exams from './pages/admin/Exams';
import Questions from './pages/admin/Questions';
import EmailTemplates from './pages/admin/EmailTemplates';
import Settings from './pages/admin/Settings';
import ChangePassword from './pages/admin/ChangePassword';
import AdminProfile from './pages/admin/Profile';
import Users from './pages/admin/Users';
import Roles from './pages/admin/Roles';
import QuestionPaper from './pages/admin/QuestionPaper';
import Reports from './pages/admin/Reports';
import Unauthorized from './pages/Unauthorized';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/unauthorized" replace />;
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
      <Route path="/courses" element={<PublicCourses />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/branches" element={<PublicBranches />} />
      <Route path="/students" element={<PublicStudents />} />
      <Route path="/news-events" element={<NewsEvents />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/verify-result" element={<VerifyResult />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
      <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/user/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
      <Route path="/user/my-exams" element={<ProtectedRoute><MyExams /></ProtectedRoute>} />
      <Route path="/user/start-exam/:examId" element={<ProtectedRoute><StartExam /></ProtectedRoute>} />
      <Route path="/user/take-exam/:attemptId" element={<ProtectedRoute><TakeExam /></ProtectedRoute>} />
      <Route path="/user/exam-result/:attemptId" element={<ProtectedRoute><ExamResult /></ProtectedRoute>} />
      <Route path="/user/admit-card/:examId" element={<ProtectedRoute><AdmitCard /></ProtectedRoute>} />
      <Route path="/user/admission-request" element={<ProtectedRoute><AdmissionRequest /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/branches" element={<ProtectedRoute adminOnly><AdminLayout><AdminBranches /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute adminOnly><AdminLayout><AdminCourses /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/batches" element={<ProtectedRoute adminOnly><AdminLayout><Batches /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute adminOnly><AdminLayout><AdminStudents /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/students/:id/assign-course" element={<ProtectedRoute adminOnly><AdminLayout><AssignCourse /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminLayout><Reports /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/fee-management" element={<ProtectedRoute adminOnly><AdminLayout><FeeManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/fee-management/:id/invoice" element={<ProtectedRoute adminOnly><AdminLayout><FeeInvoice /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/admission-requests" element={<ProtectedRoute adminOnly><AdminLayout><AdmissionRequests /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/exams" element={<ProtectedRoute adminOnly><AdminLayout><Exams /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/exams/:examId/questions" element={<ProtectedRoute adminOnly><AdminLayout><Questions /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/exams/:examId/question-paper" element={<ProtectedRoute adminOnly><AdminLayout><QuestionPaper /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/email-templates" element={<ProtectedRoute adminOnly><AdminLayout><EmailTemplates /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute adminOnly><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/change-password" element={<ProtectedRoute adminOnly><AdminLayout><ChangePassword /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminLayout><Users /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/roles" element={<ProtectedRoute adminOnly><AdminLayout><Roles /></AdminLayout></ProtectedRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
