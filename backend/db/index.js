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

    CREATE TABLE IF NOT EXISTS email_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      type TEXT DEFAULT 'general',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT,
      app_icon TEXT,
      contact_no TEXT,
      email TEXT,
      address TEXT,
      google_secret_key TEXT,
      google_id TEXT,
      facebook_key TEXT,
      facebook_id TEXT,
      onesignal_key TEXT,
      onesignal_id TEXT,
      mail_mailer TEXT,
      mail_host TEXT,
      mail_port TEXT,
      mail_username TEXT,
      mail_password TEXT,
      mail_from_address TEXT,
      mail_from_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      branch_id INTEGER NOT NULL REFERENCES branches(id),
      course_id INTEGER NOT NULL REFERENCES courses(id),
      batch_id INTEGER REFERENCES batches(id),
      title TEXT NOT NULL,
      description TEXT,
      duration INTEGER DEFAULT 60,
      total_marks INTEGER DEFAULT 100,
      passing_marks INTEGER DEFAULT 40,
      is_active INTEGER DEFAULT 1,
      exam_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      type TEXT DEFAULT 'mcq' CHECK(type IN ('mcq','short_answer')),
      question TEXT NOT NULL,
      marks INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      answer_text TEXT NOT NULL,
      is_correct INTEGER DEFAULT 0,
      "order" INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exam_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      started_at TEXT DEFAULT (datetime('now')),
      submitted_at TEXT,
      score REAL DEFAULT 0,
      total_marks INTEGER DEFAULT 0,
      passing_marks INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_progress' CHECK(status IN ('in_progress','submitted')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exam_attempt_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      answer_text TEXT,
      selected_answer_id INTEGER REFERENCES answers(id),
      marks_awarded REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const hasOtp = database.prepare("SELECT COUNT(*) as c FROM pragma_table_info('users') WHERE name='otp_code'").get();
  if (hasOtp.c === 0) {
    database.exec(`
      ALTER TABLE users ADD COLUMN otp_code TEXT;
      ALTER TABLE users ADD COLUMN otp_expires_at TEXT;
      ALTER TABLE users ADD COLUMN otp_attempts INTEGER DEFAULT 0;
    `);
  }

  const hasVerificationCode = database.prepare("SELECT COUNT(*) as c FROM pragma_table_info('exam_attempts') WHERE name='verification_code'").get();
  if (hasVerificationCode.c === 0) {
    database.exec(`ALTER TABLE exam_attempts ADD COLUMN verification_code TEXT;`);
  }

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
