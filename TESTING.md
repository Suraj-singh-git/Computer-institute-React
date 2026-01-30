# Testing Checklist – Computer Institute

## Prerequisites

1. **Backend**: From project root run `cd backend && npm install && node server.js` (or `npm run dev`). Server runs on **http://localhost:5000**.
2. **Frontend**: From project root run `cd frontend && npm install && npm run dev`. App runs on **http://localhost:5173** (or next free port).
3. If port 5000 is in use, set `PORT=5001` in backend `.env` and use `VITE_API_URL=http://localhost:5001/api` in frontend `.env`.

---

## Step-by-step tests

### 1. Backend health

- Open or curl: **http://localhost:5000/api/health**
- Expected: `{"ok":true,"service":"computer-institute-api"}`

### 2. Public site (no login)

- **Home** (/) – Carousel, intro, courses, gallery, branches, students, news, contact.
- **Courses** (/courses) – List of courses from API.
- **Branches** (/branches) – List of branches.
- **Students** (/students) – Recent students.
- **Gallery** (/gallery), **News & Events** (/news-events), **Contact** (/contact) – Load without errors.
- **Verify Result** (/verify-result) – Form with Attempt ID + Code; submit with invalid data shows error; valid data shows marksheet.

### 3. Login & Register

- **Register** (/register) – Create a student account; redirect to student dashboard or login.
- **Login** (/login) – Use `admin@institute.com` / `admin123` for admin; student email/password for student.
- **Forgot password** (/forgot-password) – Request OTP (if mail/SMS configured).

### 4. Student (after login)

- **Dashboard** (/user/dashboard) – Upcoming exams, fee status, links.
- **My Courses** (/user/my-courses) – Enrolled courses.
- **My Exams** (/user/my-exams) – Available exams, Start Exam, Admit Card, View Marksheet.
- **Admission Request** (/user/admission-request) – Submit request.
- **Profile** (/user/profile) – Update name/email.

### 5. Admin (after login as admin)

- **Dashboard** (/dashboard) – Stats cards link to **/admin/** pages (Branches, Courses, Students, etc.).
- **Branches** (/admin/branches) – CRUD branches.
- **Courses** (/admin/courses) – CRUD courses.
- **Batches** (/admin/batches) – CRUD batches.
- **Students** (/admin/students) – Add/edit students, **Assign Course** → /admin/students/:id/assign-course.
- **Fee Management** (/admin/fee-management) – Create fee, collect payment, **Invoice** → /admin/fee-management/:id/invoice.
- **Admission Requests** (/admin/admission-requests) – Approve/reject.
- **Exams** (/admin/exams) – CRUD exams, **Questions** and **Question Paper** links.
- **Reports** (/admin/reports) – Fee summary, exam results, export CSV.
- **Settings** (/admin/settings), **Profile** (/admin/profile), **Change Password** (/admin/change-password).

### 6. Exam flow

1. Admin: Create branch, course, batch → Assign course to student → Create exam → Add questions.
2. Student: My Exams → Start Exam → Take exam → Submit → View marksheet (with verification code).
3. Public: Verify Result – enter Attempt ID and 6-digit code → View marksheet without login.

### 7. Route summary

- **Public**: /, /courses, /gallery, /branches, /students, /news-events, /contact, /verify-result.
- **Auth**: /login, /register, /forgot-password, /reset-password.
- **Student**: /user/dashboard, /user/my-courses, /user/my-exams, /user/profile, /user/admission-request, /user/start-exam/:examId, /user/take-exam/:attemptId, /user/exam-result/:attemptId, /user/admit-card/:examId.
- **Admin**: /dashboard, /admin/branches, /admin/courses, /admin/batches, /admin/students, /admin/students/:id/assign-course, /admin/fee-management, /admin/fee-management/:id/invoice, /admin/admission-requests, /admin/exams, /admin/exams/:examId/questions, /admin/exams/:examId/question-paper, /admin/reports, /admin/email-templates, /admin/settings, /admin/users, /admin/roles, /admin/profile, /admin/change-password.
