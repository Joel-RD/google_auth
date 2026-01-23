import { VerificationCode } from "../../models/types.js";

export interface IVerificationRepository {
    create(verification: Omit<VerificationCode, 'id' | 'expiresAt' | 'used' | 'usedAt'>): Promise<void>;
    findByUserId(userId: number): Promise<VerificationCode | null>;
    markAsUsed(id: number): Promise<void>;
}
