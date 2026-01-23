import { Database } from "better-sqlite3";
import { User } from "../../models/types.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";

export class SqliteUserRepository implements IUserRepository {
    constructor(private db: Database) { }

    async findByIdGoogle(idGoogle: string): Promise<User | null> {
        const user = this.db.prepare("SELECT * FROM users WHERE id_google_account = ?").get(idGoogle) as User | undefined;
        return user || null;
    }

    async findById(id: number): Promise<User | null> {
        const user = this.db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
        return user || null;
    }

    async create(user: Omit<User, 'id' | 'password'>): Promise<void> {
        this.db.prepare(`
            INSERT INTO users (id_google_account, email, name, accessToken) 
            VALUES (?, ?, ?, ?)
        `).run(user.id_google_account, user.email, user.name, user.accessToken);
    }

    async update(idGoogle: string, user: Partial<User>): Promise<void> {
        const entries = Object.entries(user);
        if (entries.length === 0) return;

        const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
        const values = entries.map(([, value]) => value);
        values.push(idGoogle);

        this.db.prepare(`UPDATE users SET ${setClause} WHERE id_google_account = ?`).run(...values);
    }
}
