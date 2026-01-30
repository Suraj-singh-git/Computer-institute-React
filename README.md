# Computer Institute (React + Node.js)

A full-stack computer institute management system converted from the original Laravel project. Built with **React** (Vite, React Router, Tailwind) and **Node.js** (Express, SQLite, JWT).

## Features

- **Public:** Home, Login, Register
- **Student:** Dashboard, Profile, My Courses, Admission Request
- **Admin:** Dashboard, Branches, Courses, Batches, Students, Assign Course, Fee Management, Admission Requests, Users

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
| GET | /api/me | Current user (requires auth) |
| GET/POST/PUT/DELETE | /api/branches | Branches CRUD |
| GET/POST/PUT/DELETE | /api/courses | Courses CRUD |
| GET/POST/PUT/DELETE | /api/batches | Batches CRUD |
| GET/POST/PUT/DELETE | /api/users | Users CRUD |
| GET/POST/PUT/DELETE | /api/assign-courses | Assign course to student |
| GET/POST | /api/fees | Fee collections; POST /api/fees/:id/payments to record payment |
| GET/POST | /api/admission-requests | Admission requests; PUT /api/admission-requests/:id/process to process |
| GET | /api/roles | List roles |

All routes except `/api/auth/*` require `Authorization: Bearer <token>`.
