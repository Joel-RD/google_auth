import bcrypt from "bcryptjs";

/**
 * Hash a password using bcrypt.
 * @param {string} password - Plain text password.
 * @returns {string} Hashed password.
 */
export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

/**
 * Verify a password against a hash.
 * @param {string} password - Plain text password.
 * @param {string} hash - Hashed password.
 * @returns {boolean} True if password matches, false otherwise.
 */
export function verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}


