import Database from "better-sqlite3";
import { join } from "path";

const db = new Database(join(import.meta.dirname, "data.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    amount      INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, category_id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category_id INTEGER,
    detail TEXT NOT NULL,
    memo TEXT,
    method TEXT,
    transacted_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const seedCategories = [
  { code: 'FOOD',         name: '식비',   type: 'EXPENSE' },
  { code: 'CAFE',         name: '카페',   type: 'EXPENSE' },
  { code: 'TRANSPORT',    name: '교통',   type: 'EXPENSE' },
  { code: 'SHOPPING',     name: '쇼핑',   type: 'EXPENSE' },
  { code: 'GROCERIES',    name: '식료품', type: 'EXPENSE' },
  { code: 'SUBSCRIPTION', name: '구독',   type: 'EXPENSE' },
  { code: 'HEALTH',       name: '건강',   type: 'EXPENSE' },
  { code: 'EDUCATION',    name: '교육',   type: 'EXPENSE' },
  { code: 'LEISURE',      name: '여가',   type: 'EXPENSE' },
  { code: 'ETC_EXPENSE',  name: '기타',   type: 'EXPENSE' },
  { code: 'SALARY',       name: '급여',   type: 'INCOME' },
  { code: 'SIDE_JOB',     name: '부업',   type: 'INCOME' },
  { code: 'INVESTMENT',   name: '투자',   type: 'INCOME' },
  { code: 'ALLOWANCE',    name: '용돈',   type: 'INCOME' },
  { code: 'ETC_INCOME',   name: '기타',   type: 'INCOME' },
];

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (code, name, type) VALUES (?, ?, ?)');
for (const cat of seedCategories) {
  insertCategory.run(cat.code, cat.name, cat.type);
}

export default db;
