import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'campermap.sqlite');
export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    primary_vehicle TEXT DEFAULT 'car',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    total_nights INTEGER DEFAULT 0,
    total_steps INTEGER DEFAULT 0,
    total_km REAL DEFAULT 0,
    total_elevation INTEGER DEFAULT 0,
    spots_explored INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    spot_id TEXT NOT NULL,
    spot_name TEXT NOT NULL,
    spot_region TEXT,
    check_in_date TEXT NOT NULL,
    nights_count INTEGER DEFAULT 1,
    km_hiked REAL DEFAULT 0,
    steps_count INTEGER DEFAULT 0,
    notes TEXT,
    weather_condition TEXT,
    rating INTEGER DEFAULT 5,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_favorites (
    user_id TEXT NOT NULL,
    spot_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, spot_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS custom_spots (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    data_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);
