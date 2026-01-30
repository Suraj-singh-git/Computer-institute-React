# Computer Institute – Installation Guide

Step-by-step guide to install all software and dependencies for the React + Node.js Computer Institute project.

---

## 1. Install Node.js (required)

Node.js is required to run both the backend and frontend.

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** version (e.g. 20.x or 22.x).
3. Run the installer and follow the prompts. Ensure **“Add to PATH”** is checked.
4. Verify installation in a new terminal/PowerShell:

   ```bash
   node --version
   npm --version
   ```

   You should see version numbers (e.g. `v20.x.x` and `10.x.x`).

---

## 2. Get the project files

If you don’t have the project yet:

1. Clone the repo (if using Git):

   ```bash
   git clone <repository-url> computerInstitute
   cd computerInstitute
   ```

   Or copy/unzip the `computerInstitute` folder to your machine and open a terminal in that folder.

2. Confirm you have two folders: `backend` and `frontend`.

---

## 3. Backend setup

1. Open a terminal (PowerShell or Command Prompt).

2. Go to the backend folder:

   ```bash
   cd c:\xampp\demos\computerInstitute\backend
   ```

   (Use your actual path if different.)

3. Install dependencies:

   ```bash
   npm install
   ```

   Wait until it finishes (no errors).

4. Start the backend server:

   ```bash
   npm run dev
   ```

   You should see:

   - `Seeded: admin@institute.com / admin123, Main Branch, roles.` (on first run)
   - `Server running on http://localhost:5000`

5. Leave this terminal open. The backend must stay running while you use the app.

---

## 4. Frontend setup

1. Open a **second** terminal.

2. Go to the frontend folder:

   ```bash
   cd c:\xampp\demos\computerInstitute\frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   Wait until it finishes.

4. Start the frontend dev server:

   ```bash
   npm run dev
   ```

   You should see something like:

   - `Local: http://localhost:5173/`

5. Leave this terminal open as well.

---

## 5. Verify installation

1. Backend: in the first terminal, the server should still be running on port 5000.
2. Frontend: in the second terminal, Vite should be running on port 5173.
3. Open a browser and go to: **http://localhost:5173**
4. You should see the Computer Institute home page.
5. Log in with:
   - **Email:** `admin@institute.com`
   - **Password:** `admin123`

If you see the admin dashboard after login, installation is complete.

---

## 6. Optional: Git (for cloning only)

Only needed if you clone from Git.

1. Download Git from [https://git-scm.com](https://git-scm.com).
2. Run the installer with default options.
3. Verify: `git --version`

---

## 7. Troubleshooting

| Issue | What to do |
|--------|------------|
| `node` or `npm` not found | Reinstall Node.js and ensure “Add to PATH” was selected. Restart the terminal. |
| Port 5000 or 5173 already in use | Stop the other app using that port, or change the port (e.g. in backend `server.js` set `PORT=5001` and in frontend `vite.config.js` set `server.port: 5174`). |
| `npm install` fails | Run `npm cache clean --force`, then `npm install` again. Ensure you have internet. |
| Backend “Cannot find module” | Run `npm install` again inside the `backend` folder. |
| Frontend “Cannot find module” | Run `npm install` again inside the `frontend` folder. |
| Login fails / 401 | Ensure the backend is running and the frontend proxy is used (open the app via http://localhost:5173, not by opening the backend URL in the browser). |

---

## 8. Dependency summary

**Backend** (`backend/package.json`):

- express  
- cors  
- better-sqlite3  
- bcryptjs  
- jsonwebtoken  

**Frontend** (`frontend/package.json`):

- react  
- react-dom  
- react-router-dom  
- axios  
- tailwindcss  
- vite  
- @vitejs/plugin-react  

All of these are installed automatically when you run `npm install` in `backend` and `frontend` respectively.

---

## Quick reference

```text
1. Install Node.js (nodejs.org) → verify with node --version and npm --version
2. cd backend  → npm install  → npm run dev
3. cd frontend → npm install  → npm run dev
4. Open http://localhost:5173 and login with admin@institute.com / admin123
```
