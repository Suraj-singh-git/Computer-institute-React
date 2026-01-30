# Computer Institute (React + Node.js)

A full-stack computer institute management system converted from the original Laravel project. Built with **React** (Vite, React Router, Tailwind) and **Node.js** (Express, SQLite, JWT).

## Features

- **Public:** Home, Login, Register, Forgot Password, Reset Password (OTP)
- **Student:** Dashboard, Profile, My Courses, Admission Request
- **Admin:** Dashboard, Branches, Courses, Batches, Students (Add/Edit), Assign Course, Fee Management, Fee Invoice, Admission Requests, Exams, Questions (MCQ/Short Answer), Email Templates, Users, Roles, Settings, Profile, Change Password
- **Unauthorized:** Access Denied page when a student tries to access admin routes

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, SQLite (better-sqlite3), JWT, bcryptjs

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at **http://localhost:5000**. Database file is created at `backend/data/institute.db` on first run. Default admin: **admin@institute.com** / **admin123**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** with API proxy to the backend.

## Usage

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. **Admin:** Login with admin@institute.com / admin123 → access Dashboard, Branches, Courses, etc.
5. **Student:** Register a new account → access User Dashboard, My Courses, Admission Request

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register (student) |
| POST | /api/auth/change-password | Change password (auth) |
| POST | /api/auth/request-otp | Request OTP for password reset (admin/branch-manager) |
| POST | /api/auth/verify-otp | Verify OTP and set new password |
| GET | /api/me | Current user (auth) |
| PUT | /api/profile | Update current user name/email (auth) |
| GET/POST/PUT/DELETE | /api/branches | Branches CRUD |
| GET/POST/PUT/DELETE | /api/courses | Courses CRUD |
| GET/POST/PUT/DELETE | /api/batches | Batches CRUD |
| GET/POST/PUT/DELETE | /api/users | Users CRUD |
| GET/POST/PUT/DELETE | /api/assign-courses | Assign course to student |
| GET | /api/fees | Fee collections list |
| GET | /api/fees/:id | Fee collection + payments |
| GET | /api/fees/:id/invoice | Fee invoice (collection + payments + settings) |
| POST | /api/fees | Create fee record (admin) |
| POST | /api/fees/:id/payments | Record payment (admin) |
| GET/POST | /api/admission-requests | List / create; PUT /api/admission-requests/:id/process to process |
| GET/POST/PUT/DELETE | /api/exams | Exams CRUD |
| GET/POST/PUT/DELETE | /api/questions | Questions CRUD (query exam_id; body includes answers for MCQ) |
| GET/POST/PUT/DELETE | /api/email-templates | Email templates CRUD |
| GET | /api/roles | List roles |
| GET | /api/settings | Get settings |
| PUT | /api/settings | Update settings (admin) |

All routes except `/api/auth/login`, `/api/auth/register`, `/api/auth/request-otp`, `/api/auth/verify-otp` require `Authorization: Bearer <token>`. Admin-only actions enforce `is_admin` on the backend where applicable.
