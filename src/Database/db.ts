import Database, { Database as DB } from 'better-sqlite3';
import path from "path";

let dbInstance: DB | null = null;

export function getDatabase(): DB {
  if (!dbInstance) {
    dbInstance = new Database(path.join(process.cwd(), "src", "Database", "users_auth.db"));
  }
  return dbInstance;
}

const db = getDatabase();
export default db;