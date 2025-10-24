import Database, {Database as DB} from 'better-sqlite3';
import path from "path";

const db: DB = new Database(path.join(process.cwd(), "src", "Database", "users_auth.db"));
export default db;