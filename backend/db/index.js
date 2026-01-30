import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'institute.db');

let db = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export async function initDb() {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      admission_date TEXT,
      status TEXT DEFAULT 'Active',
      profile_picture TEXT,
      branch_id INTEGER REFERENCES branches(id),
      role_id INTEGER REFERENCES roles(id),
      is_admin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      branch_id INTEGER REFERENCES branches(id),
      title TEXT NOT NULL,
      description TEXT,
      fee REAL NOT NULL,
      duration INTEGER DEFAULT 0,
      status INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      branch_id INTEGER NOT NULL REFERENCES branches(id),
      course_id INTEGER NOT NULL REFERENCES courses(id),
      name TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,
      start_date TEXT,
      end_date TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assign_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      branch_id INTEGER NOT NULL REFERENCES branches(id),
      course_id INTEGER NOT NULL REFERENCES courses(id),
      batch_id INTEGER NOT NULL REFERENCES batches(id),
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS fee_collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      assign_course_id INTEGER NOT NULL REFERENCES assign_courses(id),
      total_fee REAL NOT NULL,
      payment_mode TEXT NOT NULL CHECK(payment_mode IN ('one_time','quarterly','half_yearly')),
      paid_amount REAL DEFAULT 0,
      remaining_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','partial','completed')),
      due_date TEXT,
      next_installment_date TEXT,
      remarks TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS fee_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fee_collection_id INTEGER NOT NULL REFERENCES fee_collections(id),
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      payment_method TEXT,
      transaction_id TEXT,
      remarks TEXT,
      received_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admission_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      branch_id INTEGER NOT NULL REFERENCES branches(id),
      status TEXT DEFAULT 'pending',
      message TEXT,
      admin_notes TEXT,
      processed_by INTEGER REFERENCES users(id),
      processed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const row = database.prepare("SELECT COUNT(*) as c FROM roles").get();
  if (row.c === 0) {
    database.prepare("INSERT INTO roles (name, slug, description) VALUES (?, ?, ?)").run('Student', 'student', 'Student role');
    database.prepare("INSERT INTO roles (name, slug, description) VALUES (?, ?, ?)").run('Admin', 'admin', 'Administrator');
    database.prepare("INSERT INTO branches (name, code, address) VALUES (?, ?, ?)").run('Main Branch', 'MAIN', 'Head Office');
    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash('admin123', 10);
    database.prepare(
      "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)"
    ).run('Admin', 'admin@institute.com', hash, 1);
    console.log('Seeded: admin@institute.com / admin123, Main Branch, roles.');
  }
}
