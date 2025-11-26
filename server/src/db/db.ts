import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db/database.sqlite');

const db = new Database(dbPath);

export default db;

// Helper functions for queries
export const runQuery = (query: string, params: any[] = []) => {
  return db.prepare(query).run(params);
};

export const getQuery = (query: string, params: any[] = []) => {
  return db.prepare(query).get(params);
};

export const allQuery = (query: string, params: any[] = []) => {
  return db.prepare(query).all(params);
};