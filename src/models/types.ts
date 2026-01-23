declare module "express-session" {
    interface SessionData {
        userId?: string;
    }
}

// Define User type for database rows
export interface User {
    id: number;
    id_google_account: string;
    email: string;
    name: string;
    accessToken: string;
    password?: string | null;
}

export interface VerificationCode {
    id: number;
    id_user: number;
    email: string;
    code: string;
    expiresAt: string;
    used: boolean;
    usedAt?: string;
}
