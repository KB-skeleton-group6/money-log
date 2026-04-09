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

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category_id TEXT,
    detail TEXT NOT NULL,
    memo TEXT,
    method TEXT,
    transacted_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export default db;
