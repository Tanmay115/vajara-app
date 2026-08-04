const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'vajra.db');

let db = null;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function saveDB() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function initializeDB() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vajra_id TEXT,
      vajra_base_id TEXT,
      technician_id INTEGER,
      status TEXT DEFAULT 'draft',
      form_data TEXT,
      head_office_comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      reviewed_by INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS form_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id INTEGER NOT NULL,
      test_key TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS form_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      user_name TEXT,
      action TEXT NOT NULL,
      detail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const count = db.exec('SELECT COUNT(*) as cnt FROM users');
  const cnt = count[0] && count[0].values[0][0];
  if (!cnt || cnt === 0) {
    db.run('INSERT INTO users (username, password, role, name, email) VALUES (?,?,?,?,?)',
      ['tech1', hashPassword('tech123'), 'technician', 'Technician One', 'technician@vajra.com']);
    db.run('INSERT INTO users (username, password, role, name, email) VALUES (?,?,?,?,?)',
      ['head1', hashPassword('head123'), 'head_office', 'Head Office Admin', 'headoffice@vajra.com']);
    saveDB();
    console.log('Seed users created.');
  }

  console.log('Database initialized.');
  return db;
}

// Helper wrappers to mimic better-sqlite3 API
function getDB() { return db; }

function dbGet(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return undefined;
  } catch(e) { console.error('dbGet error:', e.message); return undefined; }
}

function dbAll(sql, params = []) {
  try {
    const results = db.exec(sql, params);
    if (!results || results.length === 0) return [];
    const { columns, values } = results[0];
    return values.map(row => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });
  } catch(e) { console.error('dbAll error:', e.message); return []; }
}

function dbRun(sql, params = []) {
  try {
    db.run(sql, params);
    const lastId = db.exec('SELECT last_insert_rowid() as id');
    const id = lastId[0] && lastId[0].values[0][0];
    saveDB();
    return { lastInsertRowid: id };
  } catch(e) { console.error('dbRun error:', e.message); throw e; }
}

module.exports = { initializeDB, dbGet, dbAll, dbRun, hashPassword, saveDB };
