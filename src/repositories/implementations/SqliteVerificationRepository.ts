import { Database } from "better-sqlite3";
import { VerificationCode } from "../../models/types.js";
import { IVerificationRepository } from "../interfaces/IVerificationRepository.js";

export class SqliteVerificationRepository implements IVerificationRepository {
    constructor(private db: Database) { }

    async create(verification: Omit<VerificationCode, 'id' | 'expiresAt' | 'used' | 'usedAt'>): Promise<void> {
        this.db.prepare("INSERT INTO verification_codes (id_user, email, code) VALUES (?, ?, ?)")
            .run(verification.id_user, verification.email, verification.code);
    }

    async findByUserId(userId: number): Promise<VerificationCode | null> {
        const verification = this.db.prepare("SELECT * FROM verification_codes WHERE id_user = ?").get(userId) as VerificationCode | undefined;
        return verification || null;
    }

    async markAsUsed(id: number): Promise<void> {
        this.db.prepare("UPDATE verification_codes SET used = 1, usedAt = ? WHERE id = ?")
            .run(new Date().toISOString(), id);
    }
}
